from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.repositories.base import BaseRepository

class AuditLogRepository(BaseRepository):
    """Repository handling database operations for operational audit logs."""
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db, collection_name="audit_logs")

    async def log_event(
        self,
        action: str,
        actor_email: str,
        actor_role: str = "admin",
        details: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None
    ) -> Dict[str, Any]:
        if not self.collection:
            return {}

        doc = {
            "action": action,
            "actor_email": actor_email,
            "actor_role": actor_role,
            "details": details or {},
            "ip_address": ip_address,
            "timestamp": datetime.now(timezone.utc)
        }

        created = await self.create(doc)
        created["_id"] = str(created["_id"])
        return created

    async def get_logs(
        self, actor_email: Optional[str] = None, page: int = 1, limit: int = 20
    ) -> Dict[str, Any]:
        if not self.collection:
            return {"items": [], "total": 0, "page": page, "limit": limit, "pages": 0}

        match_query = {}
        if actor_email:
            match_query["actor_email"] = actor_email

        skip = max(0, (page - 1) * limit)
        total = await self.collection.count_documents(match_query)

        cursor = self.collection.find(match_query).sort("timestamp", -1).skip(skip).limit(limit)
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
