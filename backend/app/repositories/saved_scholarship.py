from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.repositories.base import BaseRepository

class SavedScholarshipRepository(BaseRepository):
    """Repository handling database operations for the Saved Scholarships collection."""
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db, collection_name="saved_scholarships")

    async def save_scholarship(
        self, student_id: str, scholarship_id: str, scholarship_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        if self.collection is None:
            return {}

        existing = await self.collection.find_one({
            "student_id": student_id,
            "scholarship_id": scholarship_id
        })

        if existing:
            existing["_id"] = str(existing["_id"])
            return existing

        doc = {
            "student_id": student_id,
            "scholarship_id": scholarship_id,
            "scholarship_slug": scholarship_data.get("slug"),
            "scholarship_title": scholarship_data.get("title"),
            "scholarship_provider": scholarship_data.get("provider"),
            "scholarship_amount": scholarship_data.get("amount_info", {}).get("amount", "₹50,000 / year"),
            "scholarship_deadline": scholarship_data.get("application_info", {}).get("end_date", "2026-08-31"),
            "saved_at": datetime.now(timezone.utc)
        }

        created = await self.create(doc)
        created["_id"] = str(created["_id"])
        return created

    async def remove_saved_scholarship(self, student_id: str, scholarship_id: str) -> bool:
        if self.collection is None:
            return False
        res = await self.collection.delete_one({
            "student_id": student_id,
            "scholarship_id": scholarship_id
        })
        return res.deleted_count > 0

    async def get_saved_by_student(self, student_id: str) -> List[Dict[str, Any]]:
        if self.collection is None:
            return []
        cursor = self.collection.find({"student_id": student_id}).sort("saved_at", -1)
        items = await cursor.to_list(length=100)
        for item in items:
            item["_id"] = str(item["_id"])
        return items

    async def is_saved(self, student_id: str, scholarship_id: str) -> bool:
        if self.collection is None:
            return False
        count = await self.collection.count_documents({
            "student_id": student_id,
            "scholarship_id": scholarship_id
        })
        return count > 0
