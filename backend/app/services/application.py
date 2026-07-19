import random
import logging
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.repositories.application import ApplicationRepository
from app.repositories.scholarship import ScholarshipRepository
from app.repositories.saved_scholarship import SavedScholarshipRepository
from app.services.student import StudentService
from app.services.eligibility_engine import EligibilityEngine
from app.schemas.application import (
    ApplicationCreateSchema,
    AdminApplicationReviewSchema,
)

logger = logging.getLogger(__name__)

class ApplicationService:
    """Service handling student scholarship applications, saved bookmarks, tracking timelines, and admin reviews."""

    @staticmethod
    def generate_application_number() -> str:
        rand_digits = random.randint(10000, 99999)
        current_year = datetime.now().year
        return f"APP-{current_year}-{rand_digits}"

    @classmethod
    async def create_or_submit_application(
        cls, student_id: str, app_in: ApplicationCreateSchema, db: AsyncIOMotorDatabase
    ) -> Dict[str, Any]:
        app_repo = ApplicationRepository(db)
        sch_repo = ScholarshipRepository(db)

        # 1. Validate Scholarship
        scholarship = await sch_repo.get_by_id(app_in.scholarship_id)
        if not scholarship:
            scholarship = await sch_repo.get_by_slug(app_in.scholarship_slug)

        if not scholarship:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Target scholarship scheme not found."
            )

        scholarship_id = str(scholarship["_id"])

        # 2. Check Duplicate Submission
        existing = await app_repo.get_by_student_and_scholarship(student_id, scholarship_id)
        if existing and existing.get("status") in ["submitted", "under_review", "approved"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"You have already submitted an application ({existing.get('application_number')}) for this scholarship."
            )

        # 3. Retrieve Student Profile & Perform Eligibility Evaluation
        profile = await StudentService.get_student_profile(student_id, db)
        eligibility_res = EligibilityEngine.evaluate(profile, scholarship)

        # 4. Freeze Student Profile Snapshot
        snapshot = {
            "personal": profile.get("personal", {}),
            "academic": profile.get("academic", {}),
            "family": profile.get("family", {}),
            "eligibility": profile.get("eligibility", {}),
            "documents": profile.get("documents", []),
        }

        now = datetime.now(timezone.utc)
        app_number = existing.get("application_number") if existing else cls.generate_application_number()

        history = existing.get("application_history", []) if existing else []
        status_target = app_in.status

        if status_target == "submitted":
            history.append({
                "step": "Application Submitted",
                "status": "submitted",
                "timestamp": now.isoformat(),
                "by": "Student",
                "remarks": "Application submitted online by student."
            })
        else:
            history.append({
                "step": "Draft Created",
                "status": "draft",
                "timestamp": now.isoformat(),
                "by": "Student",
                "remarks": "Application draft auto-saved."
            })

        app_data = {
            "application_number": app_number,
            "student_id": student_id,
            "scholarship_id": scholarship_id,
            "scholarship_slug": scholarship.get("slug"),
            "scholarship_title": scholarship.get("title"),
            "scholarship_provider": scholarship.get("provider"),
            "status": status_target,
            "snapshot": snapshot,
            "documents": profile.get("documents", []),
            "eligibility_standing": eligibility_res,
            "application_history": history,
        }

        if existing:
            updated = await app_repo.update(str(existing["_id"]), app_data)
            updated["_id"] = str(updated["_id"])
            res_doc = updated
        else:
            res_doc = await app_repo.create_application(app_data)

        # Increment application counter on scholarship if submitted
        if status_target == "submitted":
            if sch_repo.collection:
                from bson import ObjectId
                await sch_repo.collection.update_one(
                    {"_id": ObjectId(scholarship_id)},
                    {"$inc": {"application_count": 1}}
                )

        return res_doc

    @classmethod
    async def get_student_applications(
        cls, student_id: str, status_val: Optional[str], db: AsyncIOMotorDatabase
    ) -> List[Dict[str, Any]]:
        repo = ApplicationRepository(db)
        return await repo.find_by_student(student_id, status_val)

    @classmethod
    async def get_application_detail(
        cls, app_id: str, student_id: str, db: AsyncIOMotorDatabase
    ) -> Dict[str, Any]:
        repo = ApplicationRepository(db)
        app_doc = await repo.get_by_id(app_id)

        if not app_doc:
            app_doc = await repo.get_by_number(app_id)

        if not app_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application record not found."
            )

        # Ensure student is owner or admin
        if app_doc.get("student_id") != student_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Unauthorized access to this application file."
            )

        app_doc["_id"] = str(app_doc["_id"])
        return app_doc

    @classmethod
    async def withdraw_application(
        cls, app_id: str, student_id: str, db: AsyncIOMotorDatabase
    ) -> Dict[str, Any]:
        repo = ApplicationRepository(db)
        existing = await repo.get_by_id(app_id)

        if not existing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application file not found."
            )

        if existing.get("student_id") != student_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Unauthorized action on this application file."
            )

        if existing.get("status") in ["approved", "rejected"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot withdraw application that has already been {existing.get('status')}."
            )

        updated = await repo.cancel_application(app_id, student_id)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to withdraw application."
            )

        return updated

    @classmethod
    async def toggle_saved_scholarship(
        cls, student_id: str, scholarship_id: str, db: AsyncIOMotorDatabase
    ) -> Dict[str, Any]:
        saved_repo = SavedScholarshipRepository(db)
        sch_repo = ScholarshipRepository(db)

        scholarship = await sch_repo.get_by_id(scholarship_id)
        if not scholarship:
            scholarship = await sch_repo.get_by_slug(scholarship_id)

        if not scholarship:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Scholarship scheme not found."
            )

        target_sch_id = str(scholarship["_id"])
        is_already_saved = await saved_repo.is_saved(student_id, target_sch_id)

        if is_already_saved:
            await saved_repo.remove_saved_scholarship(student_id, target_sch_id)
            await sch_repo.increment_saved(target_sch_id, delta=-1)
            return {"saved": False, "message": "Scholarship removed from bookmarks."}
        else:
            await saved_repo.save_scholarship(student_id, target_sch_id, scholarship)
            await sch_repo.increment_saved(target_sch_id, delta=1)
            return {"saved": True, "message": "Scholarship saved to bookmarks!"}

    @classmethod
    async def get_saved_scholarships(
        cls, student_id: str, db: AsyncIOMotorDatabase
    ) -> List[Dict[str, Any]]:
        saved_repo = SavedScholarshipRepository(db)
        return await saved_repo.get_saved_by_student(student_id)

    @classmethod
    async def get_student_dashboard_data(
        cls, student_id: str, db: AsyncIOMotorDatabase
    ) -> Dict[str, Any]:
        app_repo = ApplicationRepository(db)
        saved_repo = SavedScholarshipRepository(db)
        sch_repo = ScholarshipRepository(db)

        profile = await StudentService.get_student_profile(student_id, db)
        applications = await app_repo.find_by_student(student_id)
        saved_items = await saved_repo.get_saved_by_student(student_id)

        # Get published recommendations
        rec_res = await sch_repo.find_with_filters(status_val="published", limit=5)
        recommendations = rec_res.get("items", [])

        # Stats calculations
        active_apps = [a for a in applications if a.get("status") in ["submitted", "under_review"]]
        approved_apps = [a for a in applications if a.get("status") == "approved"]
        draft_apps = [a for a in applications if a.get("status") == "draft"]

        return {
            "profile_completion": profile.get("profile_completion", {}),
            "eligibility_summary": profile.get("eligibility_summary", {}),
            "statistics": {
                "active_applications": len(active_apps),
                "approved_applications": len(approved_apps),
                "saved_scholarships": len(saved_items),
                "total_applications": len(applications),
            },
            "recent_applications": applications[:5],
            "saved_scholarships": saved_items[:5],
            "recommended_scholarships": recommendations,
            "draft_to_continue": draft_apps[0] if draft_apps else None
        }

    @classmethod
    async def admin_review_application(
        cls,
        app_id: str,
        review_in: AdminApplicationReviewSchema,
        admin_email: str,
        db: AsyncIOMotorDatabase
    ) -> Dict[str, Any]:
        repo = ApplicationRepository(db)
        existing = await repo.get_by_id(app_id)

        if not existing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application record not found."
            )

        now = datetime.now(timezone.utc)
        history_event = {
            "step": f"Application {review_in.status.replace('_', ' ').title()}",
            "status": review_in.status,
            "timestamp": now.isoformat(),
            "by": f"Admin ({admin_email})",
            "remarks": review_in.remarks or f"Status set to {review_in.status} by verification officer."
        }

        updated = await repo.update_review_status(
            id=app_id,
            status_val=review_in.status,
            verification_status=review_in.verification_status or "verified",
            admin_comments=review_in.admin_comments,
            remarks=review_in.remarks,
            history_event=history_event
        )

        return updated
