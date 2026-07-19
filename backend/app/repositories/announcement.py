from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.repositories.base import BaseRepository

class AnnouncementRepository(BaseRepository):
    """Repository handling system announcements and targeted broadcast notices."""
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db, collection_name="announcements")

    async def create_announcement(self, data: Dict[str, Any]) -> Dict[str, Any]:
        if not self.collection:
            return {}

        now = datetime.now(timezone.utc)
        doc = {
            "title": data.get("title"),
            "message": data.get("message"),
            "target_audience": data.get("target_audience", {"course": "All", "district": "All", "category": "All"}),
            "priority": data.get("priority", "Normal"),
            "published_by": data.get("published_by", "admin"),
            "created_at": now
        }

        created = await self.create(doc)
        created["_id"] = str(created["_id"])
        return created

    async def get_announcements(self, limit: int = 20) -> List[Dict[str, Any]]:
        if not self.collection:
            return []
        cursor = self.collection.find({}).sort("created_at", -1).limit(limit)
        items = await cursor.to_list(length=limit)
        for item in items:
            item["_id"] = str(item["_id"])
        return items
