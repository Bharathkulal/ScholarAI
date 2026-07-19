from datetime import datetime, timezone
from typing import Any, Dict, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.repositories.base import BaseRepository

class UserRepository(BaseRepository):
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db, collection_name="users")

    async def get_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        if not self.collection or not email:
            return None
        # Case-insensitive email query
        return await self.collection.find_one({"email": email.strip().lower()})

    async def get_by_google_id(self, google_id: str) -> Optional[Dict[str, Any]]:
        if not self.collection or not google_id:
            return None
        return await self.collection.find_one({"google_id": google_id})

    async def get_by_reset_token(self, token: str) -> Optional[Dict[str, Any]]:
        if not self.collection or not token:
            return None
        now = datetime.now(timezone.utc)
        return await self.collection.find_one({
            "reset_password_token": token,
            "reset_password_expires": {"$gt": now}
        })

    async def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        now = datetime.now(timezone.utc)
        doc = {
            "full_name": user_data.get("full_name"),
            "email": user_data.get("email", "").strip().lower(),
            "password_hash": user_data.get("password_hash"),
            "role": user_data.get("role", "student"),
            "avatar": user_data.get("avatar"),
            "phone": user_data.get("phone"),
            "state": user_data.get("state"),
            "district": user_data.get("district"),
            "college": user_data.get("college"),
            "course": user_data.get("course"),
            "semester": user_data.get("semester"),
            "cgpa": user_data.get("cgpa"),
            "category": user_data.get("category"),
            "income": user_data.get("income"),
            "gender": user_data.get("gender"),
            "dob": user_data.get("dob"),
            "is_email_verified": user_data.get("is_email_verified", False),
            "is_active": user_data.get("is_active", True),
            "created_at": now,
            "updated_at": now,
            "last_login": None,
            "google_id": user_data.get("google_id"),
            "provider": user_data.get("provider", "email"),
            "profile_completion": user_data.get("profile_completion", 40),
            "refresh_tokens": [],
            "savedCount": 0,
            "appliedCount": 0,
        }
        return await self.create(doc)

    async def update_user(self, user_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        update_data["updated_at"] = datetime.now(timezone.utc)
        return await self.update(user_id, update_data)

    async def update_last_login(self, user_id: str) -> None:
        if self.collection and ObjectId.is_valid(user_id):
            await self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"last_login": datetime.now(timezone.utc)}}
            )

    async def store_refresh_token(self, user_id: str, refresh_token: str) -> None:
        if self.collection and ObjectId.is_valid(user_id):
            await self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$addToSet": {"refresh_tokens": refresh_token}}
            )

    async def remove_refresh_token(self, user_id: str, refresh_token: str) -> None:
        if self.collection and ObjectId.is_valid(user_id):
            await self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$pull": {"refresh_tokens": refresh_token}}
            )

    async def clear_all_refresh_tokens(self, user_id: str) -> None:
        if self.collection and ObjectId.is_valid(user_id):
            await self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"refresh_tokens": []}}
            )

    async def store_reset_token(self, user_id: str, token: str, expires_at: datetime) -> None:
        if self.collection and ObjectId.is_valid(user_id):
            await self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {
                    "reset_password_token": token,
                    "reset_password_expires": expires_at
                }}
            )

    async def clear_reset_token(self, user_id: str) -> None:
        if self.collection and ObjectId.is_valid(user_id):
            await self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$unset": {
                    "reset_password_token": "",
                    "reset_password_expires": ""
                }}
            )
