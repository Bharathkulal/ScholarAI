import csv
import io
import json
import logging
from typing import Dict, Any, List
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.repositories.user import UserRepository
from app.repositories.scholarship import ScholarshipRepository
from app.repositories.application import ApplicationRepository

logger = logging.getLogger(__name__)

class ReportGeneratorService:
    """Service providing CSV and JSON export generator for enterprise administrative auditing."""

    @classmethod
    async def generate_report(
        cls, report_type: str, export_format: str, db: AsyncIOMotorDatabase
    ) -> str:
        user_repo = UserRepository(db)
        sch_repo = ScholarshipRepository(db)
        app_repo = ApplicationRepository(db)

        if report_type == "students":
            students = await user_repo.find({"role": "student"}, limit=1000)
            if export_format == "json":
                for s in students:
                    s["_id"] = str(s["_id"])
                return json.dumps(students, indent=2, default=str)
            else:
                output = io.StringIO()
                fieldnames = ["full_name", "email", "phone", "state", "category", "course", "cgpa", "annual_income"]
                writer = csv.DictWriter(output, fieldnames=fieldnames)
                writer.writeheader()

                for s in students:
                    p = s.get("personal", {})
                    a = s.get("academic", {})
                    f = s.get("family", {})
                    e = s.get("eligibility", {})
                    writer.writerow({
                        "full_name": p.get("full_name") or s.get("full_name"),
                        "email": s.get("email"),
                        "phone": p.get("phone") or s.get("phone"),
                        "state": p.get("address", {}).get("state") or e.get("domicile"),
                        "category": e.get("category"),
                        "course": a.get("course"),
                        "cgpa": a.get("cgpa"),
                        "annual_income": f.get("annual_income"),
                    })
                return output.getvalue()

        elif report_type == "scholarships":
            sch_res = await sch_repo.find_with_filters(status_val=None, limit=1000)
            items = sch_res.get("items", [])
            if export_format == "json":
                return json.dumps(items, indent=2, default=str)
            else:
                output = io.StringIO()
                fieldnames = ["title", "provider", "government_level", "category", "amount", "deadline", "status", "slug"]
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
                    })
                return output.getvalue()

        else:  # applications report
            apps = await app_repo.find_all_admin(limit=1000)
            items = apps.get("items", [])
            if export_format == "json":
                return json.dumps(items, indent=2, default=str)
            else:
                output = io.StringIO()
                fieldnames = ["application_number", "student_id", "scholarship_title", "scholarship_provider", "status", "verification_status", "submitted_at"]
                writer = csv.DictWriter(output, fieldnames=fieldnames)
                writer.writeheader()

                for item in items:
                    writer.writerow({
                        "application_number": item.get("application_number"),
                        "student_id": item.get("student_id"),
                        "scholarship_title": item.get("scholarship_title"),
                        "scholarship_provider": item.get("scholarship_provider"),
                        "status": item.get("status"),
                        "verification_status": item.get("verification_status"),
                        "submitted_at": str(item.get("submitted_at") or item.get("created_at")),
                    })
                return output.getvalue()
