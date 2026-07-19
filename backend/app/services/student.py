import uuid
import logging
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from fastapi import HTTPException, status, UploadFile
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.repositories.user import UserRepository
from app.schemas.student import StudentProfileUpdateSchema
from app.services.profile_completion import ProfileCompletionEngine
from app.services.eligibility_engine import EligibilityEngine
from app.services.storage import BaseStorageService

logger = logging.getLogger(__name__)

class StudentService:
    """Service handling student profile, wizard updates, uploads, completion & eligibility calculations."""

    @staticmethod
    def _format_profile_response(user_doc: Dict[str, Any]) -> Dict[str, Any]:
        """Ensures user document matches structured student profile output format."""
        doc = user_doc.copy()
        user_id = str(doc.get("_id") or doc.get("id"))
        doc["_id"] = user_id
        doc["user_id"] = user_id
        doc.pop("password_hash", None)
        doc.pop("refresh_tokens", None)

        # Compute completion and eligibility on the fly if missing
        completion = ProfileCompletionEngine.calculate_completion(doc)
        eligibility = EligibilityEngine.evaluate_eligibility(doc)

        doc["profile_completion"] = completion
        doc["eligibility_summary"] = eligibility
        
        # Ensure root compatibility fields
        doc["full_name"] = doc.get("personal", {}).get("full_name") or doc.get("full_name")
        doc["email"] = doc.get("personal", {}).get("email") or doc.get("email")
        doc["avatar"] = doc.get("personal", {}).get("avatar") or doc.get("avatar")
        doc["phone"] = doc.get("personal", {}).get("phone") or doc.get("phone")
        doc["cgpa"] = doc.get("academic", {}).get("cgpa") or doc.get("cgpa") or doc.get("gpa")
        doc["course"] = doc.get("academic", {}).get("course") or doc.get("course")
        doc["college"] = doc.get("academic", {}).get("college_name") or doc.get("college")

        return doc

    @classmethod
    async def get_student_profile(cls, user_id: str, db: AsyncIOMotorDatabase) -> Dict[str, Any]:
        user_repo = UserRepository(db)
        user = await user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found."
            )
        return cls._format_profile_response(user)

    @classmethod
    async def update_student_profile(
        cls, user_id: str, profile_update: StudentProfileUpdateSchema, db: AsyncIOMotorDatabase
    ) -> Dict[str, Any]:
        user_repo = UserRepository(db)
        existing_user = await user_repo.get_by_id(user_id)

        if not existing_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found."
            )

        update_dict = {}

        # Merge nested profile models cleanly
        if profile_update.personal is not None:
            current = existing_user.get("personal", {})
            new_data = profile_update.personal.model_dump(exclude_unset=True)
            current.update(new_data)
            update_dict["personal"] = current
            # Update root level attributes for flat access
            if "full_name" in new_data and new_data["full_name"]:
                update_dict["full_name"] = new_data["full_name"]
            if "phone" in new_data and new_data["phone"]:
                update_dict["phone"] = new_data["phone"]
            if "avatar" in new_data and new_data["avatar"]:
                update_dict["avatar"] = new_data["avatar"]

        if profile_update.academic is not None:
            current = existing_user.get("academic", {})
            new_data = profile_update.academic.model_dump(exclude_unset=True)
            current.update(new_data)
            update_dict["academic"] = current
            if "cgpa" in new_data and new_data["cgpa"]:
                update_dict["cgpa"] = new_data["cgpa"]
            if "course" in new_data and new_data["course"]:
                update_dict["course"] = new_data["course"]
            if "college_name" in new_data and new_data["college_name"]:
                update_dict["college"] = new_data["college_name"]

        if profile_update.family is not None:
            current = existing_user.get("family", {})
            new_data = profile_update.family.model_dump(exclude_unset=True)
            current.update(new_data)
            update_dict["family"] = current
            if "annual_income" in new_data and new_data["annual_income"]:
                update_dict["income"] = new_data["annual_income"]

        if profile_update.eligibility is not None:
            current = existing_user.get("eligibility", {})
            new_data = profile_update.eligibility.model_dump(exclude_unset=True)
            current.update(new_data)
            update_dict["eligibility"] = current
            if "category" in new_data and new_data["category"]:
                update_dict["category"] = new_data["category"]
            if "state" in new_data and new_data["state"]:
                update_dict["state"] = new_data["state"]

        if profile_update.documents is not None:
            update_dict["documents"] = [d.model_dump() for d in profile_update.documents]

        if profile_update.timeline is not None:
            update_dict["timeline"] = [t.model_dump() for t in profile_update.timeline]

        if profile_update.skills is not None:
            update_dict["skills"] = profile_update.skills.model_dump()

        # Recalculate section completion scores
        merged_user = {**existing_user, **update_dict}
        completion = ProfileCompletionEngine.calculate_completion(merged_user)
        update_dict["profile_completion"] = completion

        updated_user = await user_repo.update_user(user_id, update_dict)
        return cls._format_profile_response(updated_user or merged_user)

    @classmethod
    async def upload_avatar(
        cls, user_id: str, file: UploadFile, storage_service: BaseStorageService, db: AsyncIOMotorDatabase
    ) -> Dict[str, Any]:
        save_res = await storage_service.save_file(file, folder="avatars")
        avatar_url = save_res["file_url"]

        user_repo = UserRepository(db)
        updated_user = await user_repo.update_avatar(user_id, avatar_url)

        if not updated_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Failed to update avatar. User not found."
            )

        return {
            "avatar_url": avatar_url,
            "message": "Profile avatar updated successfully."
        }

    @classmethod
    async def upload_document(
        cls,
        user_id: str,
        file: UploadFile,
        doc_type: str,
        title: str,
        storage_service: BaseStorageService,
        db: AsyncIOMotorDatabase
    ) -> Dict[str, Any]:
        save_res = await storage_service.save_file(file, folder="documents")

        doc_item = {
            "id": uuid.uuid4().hex,
            "type": doc_type.strip().lower(),
            "title": title.strip() if title else doc_type.capitalize(),
            "file_name": save_res["original_filename"],
            "file_url": save_res["file_url"],
            "file_size": save_res["file_size"],
            "mime_type": save_res["mime_type"],
            "upload_date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            "status": "pending",
            "rejection_reason": None
        }

        user_repo = UserRepository(db)
        updated_user = await user_repo.add_user_document(user_id, doc_item)

        if not updated_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found."
            )

        # Update completion score
        completion = ProfileCompletionEngine.calculate_completion(updated_user)
        await user_repo.update_user(user_id, {"profile_completion": completion})

        return {
            "document": doc_item,
            "message": "Document uploaded successfully."
        }

    @classmethod
    async def delete_document(
        cls,
        user_id: str,
        doc_id: str,
        storage_service: BaseStorageService,
        db: AsyncIOMotorDatabase
    ) -> bool:
        user_repo = UserRepository(db)
        user = await user_repo.get_by_id(user_id)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found."
            )

        target_doc = None
        for d in user.get("documents", []):
            if d.get("id") == doc_id:
                target_doc = d
                break

        if not target_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Document not found."
            )

        # Delete physical file
        await storage_service.delete_file(target_doc.get("file_url"))

        # Remove from MongoDB array
        updated_user = await user_repo.delete_user_document(user_id, doc_id)

        if updated_user:
            completion = ProfileCompletionEngine.calculate_completion(updated_user)
            await user_repo.update_user(user_id, {"profile_completion": completion})

        return True

    @classmethod
    async def get_completion_scores(cls, user_id: str, db: AsyncIOMotorDatabase) -> Dict[str, Any]:
        user_repo = UserRepository(db)
        user = await user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
        completion = ProfileCompletionEngine.calculate_completion(user)
        return {"completion": completion}

    @classmethod
    async def get_eligibility_evaluation(cls, user_id: str, db: AsyncIOMotorDatabase) -> Dict[str, Any]:
        user_repo = UserRepository(db)
        user = await user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
        eligibility = EligibilityEngine.evaluate_eligibility(user)
        return {"eligibility": eligibility}
