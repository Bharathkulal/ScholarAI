from datetime import datetime, timezone
from typing import Any, Dict, Optional, List
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.repositories.base import BaseRepository

class UserRepository(BaseRepository):
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db, collection_name="users")

    async def get_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        if self.collection is None or not email:
            return None
        # Case-insensitive email query
        return await self.collection.find_one({"email": email.strip().lower()})

    async def get_by_google_id(self, google_id: str) -> Optional[Dict[str, Any]]:
        if self.collection is None or not google_id:
            return None
        return await self.collection.find_one({"google_id": google_id})

    async def get_by_reset_token(self, token: str) -> Optional[Dict[str, Any]]:
        if self.collection is None or not token:
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
            "profile_completion": {
                "personal": 40,
                "academic": 0,
                "family": 0,
                "eligibility": 0,
                "documents": 0,
                "timeline": 0,
                "skills": 0,
                "overall": 20
            },
            "personal": {
                "full_name": user_data.get("full_name"),
                "email": user_data.get("email"),
                "phone": user_data.get("phone"),
                "gender": user_data.get("gender"),
                "dob": user_data.get("dob"),
                "avatar": user_data.get("avatar"),
                "address": {
                    "state": user_data.get("state"),
                    "district": user_data.get("district"),
                    "taluk": None,
                    "village_city": None,
                    "pin_code": None
                }
            },
            "academic": {
                "college_name": user_data.get("college"),
                "university": None,
                "course": user_data.get("course"),
                "branch": None,
                "semester": user_data.get("semester"),
                "current_year": None,
                "roll_number": None,
                "registration_number": None,
                "cgpa": user_data.get("cgpa"),
                "percentage": None,
                "sslc_percentage": None,
                "puc_percentage": None,
                "backlogs": 0,
                "expected_graduation": None
            },
            "family": {
                "father_name": None,
                "mother_name": None,
                "guardian": None,
                "occupation": None,
                "annual_income": user_data.get("income"),
                "bpl_status": "No",
                "ration_card_type": None
            },
            "eligibility": {
                "category": user_data.get("category"),
                "religion": None,
                "nationality": "Indian",
                "state": user_data.get("state"),
                "domicile": user_data.get("state"),
                "disability": "No",
                "ncc": "No",
                "sports_quota": "No",
                "farmer_family": "No",
                "single_girl_child": "No",
                "orphan": "No",
                "ex_serviceman": "No",
                "hosteller_day_scholar": "Hosteller"
            },
            "documents": [],
            "timeline": [],
            "skills": {
                "programming_skills": [],
                "languages": [],
                "projects": [],
                "internships": [],
                "certifications": [],
                "hackathons": [],
                "sports": [],
                "achievements": [],
                "volunteer_work": []
            },
            "refresh_tokens": [],
            "savedCount": 0,
            "appliedCount": 0,
        }
        return await self.create(doc)

    async def update_user(self, user_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        update_data["updated_at"] = datetime.now(timezone.utc)
        return await self.update(user_id, update_data)

    async def update_last_login(self, user_id: str) -> None:
        if self.collection is not None and ObjectId.is_valid(user_id):
            await self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"last_login": datetime.now(timezone.utc)}}
            )

    async def store_refresh_token(self, user_id: str, refresh_token: str) -> None:
        if self.collection is not None and ObjectId.is_valid(user_id):
            await self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$addToSet": {"refresh_tokens": refresh_token}}
            )

    async def remove_refresh_token(self, user_id: str, refresh_token: str) -> None:
        if self.collection is not None and ObjectId.is_valid(user_id):
            await self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$pull": {"refresh_tokens": refresh_token}}
            )

    async def clear_all_refresh_tokens(self, user_id: str) -> None:
        if self.collection is not None and ObjectId.is_valid(user_id):
            await self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"refresh_tokens": []}}
            )

    async def store_reset_token(self, user_id: str, token: str, expires_at: datetime) -> None:
        if self.collection is not None and ObjectId.is_valid(user_id):
            await self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {
                    "reset_password_token": token,
                    "reset_password_expires": expires_at
                }}
            )

    async def clear_reset_token(self, user_id: str) -> None:
        if self.collection is not None and ObjectId.is_valid(user_id):
            await self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$unset": {
                    "reset_password_token": "",
                    "reset_password_expires": ""
                }}
            )

    async def add_user_document(self, user_id: str, doc_item: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if self.collection is None or not ObjectId.is_valid(user_id):
            return None
        from pymongo import ReturnDocument
        return await self.collection.find_one_and_update(
            {"_id": ObjectId(user_id)},
            {
                "$push": {"documents": doc_item},
                "$set": {"updated_at": datetime.now(timezone.utc)}
            },
            return_document=ReturnDocument.AFTER
        )

    async def delete_user_document(self, user_id: str, doc_id: str) -> Optional[Dict[str, Any]]:
        if self.collection is None or not ObjectId.is_valid(user_id):
            return None
        from pymongo import ReturnDocument
        return await self.collection.find_one_and_update(
            {"_id": ObjectId(user_id)},
            {
                "$pull": {"documents": {"id": doc_id}},
                "$set": {"updated_at": datetime.now(timezone.utc)}
            },
            return_document=ReturnDocument.AFTER
        )

    async def update_document_status(
        self, user_id: str, doc_id: str, status_val: str, rejection_reason: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        if self.collection is None or not ObjectId.is_valid(user_id):
            return None
        from pymongo import ReturnDocument
        return await self.collection.find_one_and_update(
            {"_id": ObjectId(user_id), "documents.id": doc_id},
            {
                "$set": {
                    "documents.$.status": status_val,
                    "documents.$.rejection_reason": rejection_reason,
                    "updated_at": datetime.now(timezone.utc)
                }
            },
            return_document=ReturnDocument.AFTER
        )

    async def update_avatar(self, user_id: str, avatar_url: str) -> Optional[Dict[str, Any]]:
        if self.collection is None or not ObjectId.is_valid(user_id):
            return None
        from pymongo import ReturnDocument
        return await self.collection.find_one_and_update(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "avatar": avatar_url,
                    "personal.avatar": avatar_url,
                    "updated_at": datetime.now(timezone.utc)
                }
            },
            return_document=ReturnDocument.AFTER
        )
