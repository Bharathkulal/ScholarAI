import re
import csv
import io
import logging
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.repositories.scholarship import ScholarshipRepository
from app.schemas.scholarship import (
    ScholarshipCreateSchema,
    ScholarshipUpdateSchema,
    BulkImportSummarySchema,
)

logger = logging.getLogger(__name__)

class ScholarshipService:
    """Service handling scholarship business logic, slug generation, filters, and CSV import/export."""

    @staticmethod
    def slugify(text: str) -> str:
        """Converts arbitrary title string to clean lower-case URL slug."""
        text = text.lower().strip()
        text = re.sub(r"[^\w\s-]", "", text)
        text = re.sub(r"[\s_-]+", "-", text)
        return text.strip("-") or "scholarship"

    @classmethod
    async def generate_unique_slug(cls, title: str, db: AsyncIOMotorDatabase) -> str:
        base_slug = cls.slugify(title)
        repo = ScholarshipRepository(db)
        
        slug = base_slug
        counter = 1
        while await repo.get_by_slug(slug):
            slug = f"{base_slug}-{counter}"
            counter += 1
        return slug

    @classmethod
    async def create_scholarship(
        cls, scholarship_in: ScholarshipCreateSchema, created_by: str, db: AsyncIOMotorDatabase
    ) -> Dict[str, Any]:
        repo = ScholarshipRepository(db)
        slug = await cls.generate_unique_slug(scholarship_in.title, db)

        data = scholarship_in.model_dump()
        data["slug"] = slug
        data["created_by"] = created_by

        # Parse numeric amount
        amt_info = data.get("amount_info", {})
        amt_str = str(amt_info.get("amount", "50000"))
        numeric_cleaned = re.sub(r"[^\d.]", "", amt_str)
        try:
            amt_info["numeric_amount"] = float(numeric_cleaned) if numeric_cleaned else 50000.0
        except ValueError:
            amt_info["numeric_amount"] = 50000.0
        data["amount_info"] = amt_info

        created = await repo.create_scholarship(data)
        created["_id"] = str(created["_id"])
        return created

    @classmethod
    async def update_scholarship(
        cls, id: str, scholarship_in: ScholarshipUpdateSchema, db: AsyncIOMotorDatabase
    ) -> Dict[str, Any]:
        repo = ScholarshipRepository(db)
        existing = await repo.get_by_id(id)

        if not existing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Scholarship record not found."
            )

        update_dict = {k: v for k, v in scholarship_in.model_dump().items() if v is not None}
        
        if "title" in update_dict and update_dict["title"] != existing.get("title"):
            update_dict["slug"] = await cls.generate_unique_slug(update_dict["title"], db)

        if "amount_info" in update_dict:
            amt_info = update_dict["amount_info"]
            amt_str = str(amt_info.get("amount", "50000"))
            numeric_cleaned = re.sub(r"[^\d.]", "", amt_str)
            try:
                amt_info["numeric_amount"] = float(numeric_cleaned) if numeric_cleaned else 50000.0
            except ValueError:
                amt_info["numeric_amount"] = 50000.0
            update_dict["amount_info"] = amt_info

        updated = await repo.update_scholarship(id, update_dict)
        if updated:
            updated["_id"] = str(updated["_id"])
            return updated
        existing["_id"] = str(existing["_id"])
        return existing

    @classmethod
    async def archive_scholarship(cls, id: str, db: AsyncIOMotorDatabase) -> bool:
        repo = ScholarshipRepository(db)
        existing = await repo.get_by_id(id)

        if not existing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Scholarship record not found."
            )

        await repo.archive_scholarship(id)
        return True

    @classmethod
    async def set_publish_status(cls, id: str, publish: bool, db: AsyncIOMotorDatabase) -> Dict[str, Any]:
        repo = ScholarshipRepository(db)
        status_val = "published" if publish else "draft"
        updated = await repo.set_status(id, status_val)

        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Scholarship record not found."
            )

        updated["_id"] = str(updated["_id"])
        return updated

    @classmethod
    async def get_by_slug(cls, slug: str, increment_view: bool, db: AsyncIOMotorDatabase) -> Dict[str, Any]:
        repo = ScholarshipRepository(db)
        scholarship = await repo.get_by_slug(slug)

        if not scholarship:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Scholarship scheme not found."
            )

        scholarship_id = str(scholarship["_id"])
        if increment_view:
            await repo.increment_views(scholarship_id)
            scholarship["view_count"] = scholarship.get("view_count", 0) + 1

        scholarship["_id"] = scholarship_id
        return scholarship

    @classmethod
    async def bulk_import_csv(cls, csv_text: str, created_by: str, db: AsyncIOMotorDatabase) -> BulkImportSummarySchema:
        repo = ScholarshipRepository(db)
        f = io.StringIO(csv_text)
        reader = csv.DictReader(f)

        processed = 0
        imported = 0
        skipped = 0
        errors = []

        for row in reader:
            processed += 1
            title = row.get("title") or row.get("Title") or row.get("SCHOLARSHIP_NAME")
            provider = row.get("provider") or row.get("Provider") or row.get("ORGANIZATION") or "State Govt"

            if not title:
                errors.append(f"Row {processed}: Missing title column.")
                skipped += 1
                continue

            # Duplicate check
            existing = await repo.collection.find_one({
                "title": {"$regex": f"^{re.escape(title.strip())}$", "$options": "i"},
                "provider": {"$regex": f"^{re.escape(provider.strip())}$", "$options": "i"}
            })

            if existing:
                skipped += 1
                continue

            slug = await cls.generate_unique_slug(title, db)
            amt = row.get("amount") or row.get("Amount") or "₹50,000 / year"
            numeric_cleaned = re.sub(r"[^\d.]", "", str(amt))
            try:
                numeric_amt = float(numeric_cleaned) if numeric_cleaned else 50000.0
            except ValueError:
                numeric_amt = 50000.0

            doc = {
                "title": title.strip(),
                "provider": provider.strip(),
                "organization": row.get("organization") or provider.strip(),
                "government_level": row.get("government_level") or row.get("Level") or "State",
                "category": row.get("category") or "Karnataka State",
                "slug": slug,
                "description": row.get("description") or f"Official scholarship program provided by {provider}.",
                "short_description": row.get("short_description") or f"Financial assistance scheme offered by {provider}.",
                "banner_image": row.get("banner_image"),
                "logo": row.get("logo") or "🎓",
                "official_website": row.get("official_website"),
                "official_apply_url": row.get("official_apply_url") or "https://ssp.postmatric.karnataka.gov.in",
                "contact_email": row.get("contact_email"),
                "contact_phone": row.get("contact_phone"),
                "amount_info": {
                    "amount": amt,
                    "numeric_amount": numeric_amt,
                    "currency": "INR",
                    "frequency": "Yearly",
                    "renewable": True,
                    "benefits_description": "Annual tuition reimbursement & maintenance grant."
                },
                "eligibility_criteria": {
                    "state": row.get("state") or "Karnataka",
                    "district": None,
                    "nationality": "Indian",
                    "domicile": row.get("state") or "Karnataka",
                    "category": row.get("eligible_category") or "General",
                    "religion": None,
                    "gender": "All",
                    "course": row.get("course") or "BE/BTech, Diploma, Degree",
                    "department": None,
                    "branch": None,
                    "education_level": row.get("education_level") or "UG",
                    "min_cgpa": 6.0,
                    "min_percentage": 60.0,
                    "max_income": 800000.0,
                    "age_limit": None,
                    "disability": "All",
                    "minority": "All",
                    "farmer": "All",
                    "sports_quota": "All",
                    "ncc": "All",
                    "single_girl_child": "All",
                    "hosteller_day_scholar": "All"
                },
                "required_documents": [
                    "SSLC / PUC Marks Card",
                    "Income & Caste Certificate",
                    "Aadhaar Identity Card"
                ],
                "application_info": {
                    "mode": "Online",
                    "start_date": "2026-06-01",
                    "end_date": row.get("deadline") or row.get("Deadline") or "2026-09-30",
                    "official_apply_url": row.get("official_apply_url") or "https://ssp.postmatric.karnataka.gov.in",
                    "steps": ["Apply online at official portal", "Submit verified documents"],
                    "faqs": []
                },
                "status": "published",
                "created_by": created_by,
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc),
                "view_count": 0,
                "saved_count": 0,
                "application_count": 0,
            }

            await repo.create(doc)
            imported += 1

        return BulkImportSummarySchema(
            total_processed=processed,
            imported_count=imported,
            skipped_count=skipped,
            errors=errors
        )

    @classmethod
    async def export_csv(cls, db: AsyncIOMotorDatabase) -> str:
        repo = ScholarshipRepository(db)
        res = await repo.find_with_filters(status_val=None, limit=1000)
        items = res.get("items", [])

        output = io.StringIO()
        fieldnames = ["title", "provider", "government_level", "category", "amount", "deadline", "status", "slug", "official_apply_url"]
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()

        for item in items:
            writer.writerow({
                "title": item.get("title"),
                "provider": item.get("provider"),
                "government_level": item.get("government_level"),
                "category": item.get("category"),
                "amount": item.get("amount_info", {}).get("amount"),
                "deadline": item.get("application_info", {}).get("end_date"),
                "status": item.get("status"),
                "slug": item.get("slug"),
                "official_apply_url": item.get("official_apply_url") or item.get("application_info", {}).get("official_apply_url"),
            })

        return output.getvalue()
