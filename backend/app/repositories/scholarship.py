from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.repositories.base import BaseRepository

class ScholarshipRepository(BaseRepository):
    """Repository handling database operations for the Scholarships collection."""
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db, collection_name="scholarships")

    async def get_by_slug(self, slug: str) -> Optional[Dict[str, Any]]:
        if not self.collection or not slug:
            return None
        return await self.collection.find_one({"slug": slug.strip()})

    async def create_scholarship(self, data: Dict[str, Any]) -> Dict[str, Any]:
        now = datetime.now(timezone.utc)
        doc = {
            "title": data.get("title"),
            "provider": data.get("provider"),
            "organization": data.get("organization"),
            "government_level": data.get("government_level", "State"),
            "category": data.get("category", "General"),
            "slug": data.get("slug"),
            "description": data.get("description"),
            "short_description": data.get("short_description"),
            "banner_image": data.get("banner_image"),
            "logo": data.get("logo"),
            "official_website": data.get("official_website"),
            "official_apply_url": data.get("official_apply_url"),
            "contact_email": data.get("contact_email"),
            "contact_phone": data.get("contact_phone"),
            "amount_info": data.get("amount_info", {}),
            "eligibility_criteria": data.get("eligibility_criteria", {}),
            "required_documents": data.get("required_documents", []),
            "application_info": data.get("application_info", {}),
            "status": data.get("status", "published"),
            "created_by": data.get("created_by", "admin"),
            "created_at": now,
            "updated_at": now,
            "view_count": 0,
            "saved_count": 0,
            "application_count": 0,
        }
        return await self.create(doc)

    async def update_scholarship(self, id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        update_data["updated_at"] = datetime.now(timezone.utc)
        return await self.update(id, update_data)

    async def archive_scholarship(self, id: str) -> Optional[Dict[str, Any]]:
        return await self.update_scholarship(id, {"status": "archived"})

    async def set_status(self, id: str, status_val: str) -> Optional[Dict[str, Any]]:
        return await self.update_scholarship(id, {"status": status_val})

    async def find_with_filters(
        self,
        query: Optional[str] = None,
        category: Optional[str] = None,
        government_level: Optional[str] = None,
        provider: Optional[str] = None,
        state: Optional[str] = None,
        min_amount: Optional[float] = None,
        max_income: Optional[float] = None,
        status_val: Optional[str] = "published",
        page: int = 1,
        limit: int = 10,
        sort_by: str = "newest"
    ) -> Dict[str, Any]:
        if not self.collection:
            return {"items": [], "total": 0, "page": page, "limit": limit, "pages": 0}

        match_query: Dict[str, Any] = {}

        if status_val:
            match_query["status"] = status_val

        if query and query.strip():
            q_clean = query.strip()
            match_query["$or"] = [
                {"title": {"$regex": q_clean, "$options": "i"}},
                {"provider": {"$regex": q_clean, "$options": "i"}},
                {"description": {"$regex": q_clean, "$options": "i"}},
                {"category": {"$regex": q_clean, "$options": "i"}}
            ]

        if category and category.strip() and category != "All":
            match_query["category"] = {"$regex": f"^{category.strip()}", "$options": "i"}

        if government_level and government_level.strip() and government_level != "All":
            match_query["government_level"] = government_level.strip()

        if provider and provider.strip() and provider != "All":
            match_query["provider"] = {"$regex": provider.strip(), "$options": "i"}

        if state and state.strip() and state != "All":
            match_query["$or"] = [
                {"eligibility_criteria.state": {"$regex": state.strip(), "$options": "i"}},
                {"eligibility_criteria.state": "All"}
            ]

        if min_amount is not None and min_amount > 0:
            match_query["amount_info.numeric_amount"] = {"$gte": min_amount}

        if max_income is not None and max_income > 0:
            match_query["eligibility_criteria.max_income"] = {"$lte": max_income}

        # Sorting logic
        sort_spec = [("created_at", -1)]
        if sort_by == "deadline":
            sort_spec = [("application_info.end_date", 1)]
        elif sort_by == "highest_amount":
            sort_spec = [("amount_info.numeric_amount", -1)]
        elif sort_by == "popularity":
            sort_spec = [("view_count", -1), ("saved_count", -1)]
        elif sort_by == "recently_updated":
            sort_spec = [("updated_at", -1)]
        elif sort_by == "alphabetical":
            sort_spec = [("title", 1)]

        skip = max(0, (page - 1) * limit)

        total = await self.collection.count_documents(match_query)
        cursor = self.collection.find(match_query).sort(sort_spec).skip(skip).limit(limit)
        items = await cursor.to_list(length=limit)

        for item in items:
            item["_id"] = str(item["_id"])

        pages = (total + limit - 1) // limit if limit > 0 else 0

        return {
            "items": items,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": pages
        }

    async def increment_views(self, id: str) -> None:
        if self.collection and ObjectId.is_valid(id):
            await self.collection.update_one(
                {"_id": ObjectId(id)},
                {"$inc": {"view_count": 1}}
            )

    async def increment_saved(self, id: str, delta: int = 1) -> None:
        if self.collection and ObjectId.is_valid(id):
            await self.collection.update_one(
                {"_id": ObjectId(id)},
                {"$inc": {"saved_count": delta}}
            )

    async def get_distinct_categories(self) -> List[str]:
        if not self.collection:
            return []
        categories = await self.collection.distinct("category", {"status": "published"})
        return sorted([c for c in categories if c])

    async def get_distinct_providers(self) -> List[str]:
        if not self.collection:
            return []
        providers = await self.collection.distinct("provider", {"status": "published"})
        return sorted([p for p in providers if p])
