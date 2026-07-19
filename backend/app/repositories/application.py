from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.repositories.base import BaseRepository

class ApplicationRepository(BaseRepository):
    """Repository handling database operations for the Applications collection."""
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db, collection_name="applications")

    async def get_by_number(self, application_number: str) -> Optional[Dict[str, Any]]:
        if not self.collection or not application_number:
            return None
        return await self.collection.find_one({"application_number": application_number})

    async def get_by_student_and_scholarship(
        self, student_id: str, scholarship_id: str
    ) -> Optional[Dict[str, Any]]:
        if not self.collection:
            return None
        return await self.collection.find_one({
            "student_id": student_id,
            "scholarship_id": scholarship_id
        })

    async def create_application(self, data: Dict[str, Any]) -> Dict[str, Any]:
        now = datetime.now(timezone.utc)
        doc = {
            "application_number": data.get("application_number"),
            "student_id": data.get("student_id"),
            "scholarship_id": data.get("scholarship_id"),
            "scholarship_slug": data.get("scholarship_slug"),
            "scholarship_title": data.get("scholarship_title"),
            "scholarship_provider": data.get("scholarship_provider"),
            "status": data.get("status", "submitted"),
            "snapshot": data.get("snapshot", {}),
            "documents": data.get("documents", []),
            "eligibility_standing": data.get("eligibility_standing", {}),
            "verification_status": "pending",
            "admin_comments": None,
            "remarks": None,
            "application_history": data.get("application_history", []),
            "submitted_at": now if data.get("status") == "submitted" else None,
            "created_at": now,
            "updated_at": now,
        }
        created = await self.create(doc)
        created["_id"] = str(created["_id"])
        return created

    async def find_by_student(
        self, student_id: str, status_val: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        if not self.collection:
            return []
        match_query = {"student_id": student_id}
        if status_val:
            match_query["status"] = status_val

        cursor = self.collection.find(match_query).sort("created_at", -1)
        items = await cursor.to_list(length=100)
        for item in items:
            item["_id"] = str(item["_id"])
        return items

    async def find_all_admin(
        self,
        status_val: Optional[str] = None,
        query: Optional[str] = None,
        page: int = 1,
        limit: int = 20
    ) -> Dict[str, Any]:
        if not self.collection:
            return {"items": [], "total": 0, "page": page, "limit": limit, "pages": 0}

        match_query: Dict[str, Any] = {}
        if status_val and status_val != "all":
            match_query["status"] = status_val

        if query and query.strip():
            q_clean = query.strip()
            match_query["$or"] = [
                {"application_number": {"$regex": q_clean, "$options": "i"}},
                {"scholarship_title": {"$regex": q_clean, "$options": "i"}},
                {"scholarship_provider": {"$regex": q_clean, "$options": "i"}}
            ]

        skip = max(0, (page - 1) * limit)

        total = await self.collection.count_documents(match_query)
        cursor = self.collection.find(match_query).sort("created_at", -1).skip(skip).limit(limit)
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

    async def update_review_status(
        self,
        id: str,
        status_val: str,
        verification_status: str,
        admin_comments: Optional[str],
        remarks: Optional[str],
        history_event: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        if not self.collection or not ObjectId.is_valid(id):
            return None

        now = datetime.now(timezone.utc)
        update_doc = {
            "$set": {
                "status": status_val,
                "verification_status": verification_status,
                "admin_comments": admin_comments,
                "remarks": remarks,
                "updated_at": now
            },
            "$push": {
                "application_history": history_event
            }
        }

        await self.collection.update_one({"_id": ObjectId(id)}, update_doc)
        updated = await self.get_by_id(id)
        if updated:
            updated["_id"] = str(updated["_id"])
        return updated

    async def cancel_application(self, id: str, student_id: str) -> Optional[Dict[str, Any]]:
        if not self.collection or not ObjectId.is_valid(id):
            return None

        now = datetime.now(timezone.utc)
        history_event = {
            "step": "Withdrawn",
            "status": "cancelled",
            "timestamp": now,
            "by": "Student",
            "remarks": "Application withdrawn by student."
        }

        res = await self.collection.update_one(
            {"_id": ObjectId(id), "student_id": student_id},
            {
                "$set": {"status": "cancelled", "updated_at": now},
                "$push": {"application_history": history_event}
            }
        )

        if res.modified_count > 0:
            updated = await self.get_by_id(id)
            if updated:
                updated["_id"] = str(updated["_id"])
            return updated
        return None
