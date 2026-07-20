from typing import Dict, Any, Optional, List
from fastapi import APIRouter, Depends, status, Path, Query, HTTPException, Body
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from app.database.mongodb import get_database
from app.core.security import RequireRole, get_current_user, get_password_hash
from app.schemas.response import SuccessResponse
from app.schemas.auth import AdminUserCreate, AdminUserUpdate, AdminPasswordReset
from app.repositories.user import UserRepository
from app.repositories.audit_log import AuditLogRepository
from app.services.admin_analytics import AdminAnalyticsService

router = APIRouter(dependencies=[RequireRole(["super_admin"])])

# ==================== ADMIN ACCOUNT MANAGEMENT ====================

@router.post("/admins", summary="Create a new Admin account", status_code=status.HTTP_201_CREATED)
async def create_admin(
    admin_in: AdminUserCreate,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    user_repo = UserRepository(db)
    audit_repo = AuditLogRepository(db)

    # Check for duplicate email
    existing = await user_repo.get_by_email(admin_in.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    password_hash = get_password_hash(admin_in.password)
    new_admin_data = {
        "full_name": admin_in.full_name,
        "email": admin_in.email.strip().lower(),
        "password_hash": password_hash,
        "role": admin_in.role,  # "admin" or "super_admin"
        "phone": admin_in.phone,
        "is_email_verified": True,
        "is_active": True,
        "provider": "email",
    }

    created_admin = await user_repo.create_user(new_admin_data)
    created_admin["_id"] = str(created_admin["_id"])
    created_admin.pop("password_hash", None)

    actor_email = current_user.get("email", "superadmin@scholarai.com")
    await audit_repo.log_event(
        action="ADMIN_CREATED",
        actor_email=actor_email,
        details={"created_admin_email": admin_in.email, "role": admin_in.role}
    )

    return SuccessResponse(
        success=True,
        message=f"Admin account '{admin_in.email}' created successfully.",
        data={"admin": created_admin}
    )

@router.get("/admins", summary="List all Admin and Super Admin accounts")
async def list_admins(
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    user_repo = UserRepository(db)
    admins = await user_repo.find({"role": {"$in": ["admin", "super_admin", "superadmin"]}})

    formatted_admins = []
    for a in admins:
        a["_id"] = str(a["_id"])
        a.pop("password_hash", None)
        formatted_admins.append(a)

    return SuccessResponse(
        success=True,
        message="Admin accounts list retrieved.",
        data={"admins": formatted_admins}
    )

@router.put("/admins/{id}", summary="Update an existing Admin account")
async def update_admin(
    admin_in: AdminUserUpdate,
    id: str = Path(..., description="Admin User ID"),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    user_repo = UserRepository(db)
    audit_repo = AuditLogRepository(db)

    update_dict = {k: v for k, v in admin_in.model_dump().items() if v is not None}
    if not update_dict:
        raise HTTPException(status_code=400, detail="No valid update fields provided.")

    updated = await user_repo.update_user(id, update_dict)
    if not updated:
        raise HTTPException(status_code=404, detail="Admin account not found.")

    updated["_id"] = str(updated["_id"])
    updated.pop("password_hash", None)

    actor_email = current_user.get("email", "superadmin@scholarai.com")
    await audit_repo.log_event(
        action="ADMIN_UPDATED",
        actor_email=actor_email,
        details={"admin_id": id, "updates": update_dict}
    )

    return SuccessResponse(
        success=True,
        message="Admin account details updated successfully.",
        data={"admin": updated}
    )

@router.patch("/admins/{id}/status", summary="Toggle active status of an Admin account")
async def toggle_admin_status(
    is_active: bool = Body(..., embed=True),
    id: str = Path(..., description="Admin User ID"),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    user_repo = UserRepository(db)
    audit_repo = AuditLogRepository(db)

    target_user = await user_repo.get_by_id(id)
    if not target_user:
        raise HTTPException(status_code=404, detail="Admin account not found.")

    if str(target_user.get("_id")) == str(current_user.get("_id")):
        raise HTTPException(status_code=400, detail="Super Admin cannot deactivate their own account.")

    updated = await user_repo.update_user(id, {"is_active": is_active})
    updated["_id"] = str(updated["_id"])
    updated.pop("password_hash", None)

    status_str = "activated" if is_active else "deactivated"
    actor_email = current_user.get("email", "superadmin@scholarai.com")
    await audit_repo.log_event(
        action=f"ADMIN_{status_str.upper()}",
        actor_email=actor_email,
        details={"admin_id": id, "target_email": target_user.get("email")}
    )

    return SuccessResponse(
        success=True,
        message=f"Admin account '{target_user.get('email')}' has been {status_str}.",
        data={"admin": updated}
    )

@router.delete("/admins/{id}", summary="Delete an Admin account")
async def delete_admin(
    id: str = Path(..., description="Admin User ID"),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    user_repo = UserRepository(db)
    audit_repo = AuditLogRepository(db)

    target_user = await user_repo.get_by_id(id)
    if not target_user:
        raise HTTPException(status_code=404, detail="Admin account not found.")

    if str(target_user.get("_id")) == str(current_user.get("_id")):
        raise HTTPException(status_code=400, detail="Super Admin cannot delete their own account.")

    await user_repo.delete(id)

    actor_email = current_user.get("email", "superadmin@scholarai.com")
    await audit_repo.log_event(
        action="ADMIN_DELETED",
        actor_email=actor_email,
        details={"deleted_admin_id": id, "deleted_admin_email": target_user.get("email")}
    )

    return SuccessResponse(
        success=True,
        message=f"Admin account '{target_user.get('email')}' deleted successfully.",
        data=None
    )

@router.post("/admins/{id}/reset-password", summary="Reset an Admin account password")
async def reset_admin_password(
    reset_in: AdminPasswordReset,
    id: str = Path(..., description="Admin User ID"),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    user_repo = UserRepository(db)
    audit_repo = AuditLogRepository(db)

    target_user = await user_repo.get_by_id(id)
    if not target_user:
        raise HTTPException(status_code=404, detail="Admin account not found.")

    new_hash = get_password_hash(reset_in.new_password)
    await user_repo.update_user(id, {"password_hash": new_hash})
    await user_repo.clear_all_refresh_tokens(id)

    actor_email = current_user.get("email", "superadmin@scholarai.com")
    await audit_repo.log_event(
        action="ADMIN_PASSWORD_RESET",
        actor_email=actor_email,
        details={"target_admin_email": target_user.get("email")}
    )

    return SuccessResponse(
        success=True,
        message=f"Password for Admin '{target_user.get('email')}' reset successfully.",
        data=None
    )

# ==================== SYSTEM AUDIT LOGS & SETTINGS ====================

@router.get("/audit-logs", summary="Retrieve platform security audit logs")
async def get_super_admin_audit_logs(
    actor_email: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    repo = AuditLogRepository(db)
    res = await repo.get_logs(actor_email=actor_email, page=page, limit=limit)
    return SuccessResponse(
        success=True,
        message="System audit logs retrieved.",
        data=res
    )

@router.get("/system-settings", summary="Retrieve global platform system settings")
async def get_system_settings(db: AsyncIOMotorDatabase = Depends(get_database)):
    settings_coll = db["system_settings"]
    config_doc = await settings_coll.find_one({"_id": "global_config"})
    if not config_doc:
        config_doc = {
            "_id": "global_config",
            "maintenance_mode": False,
            "ai_matching_engine": "enabled",
            "ai_recommendation_threshold": 75,
            "max_applications_per_student": 10,
            "allow_student_registration": True,
            "system_announcement": "Welcome to ScholarAI Enterprise Platform",
        }
        await settings_coll.insert_one(config_doc)

    config_doc.pop("_id", None)
    return SuccessResponse(
        success=True,
        message="System settings retrieved.",
        data={"settings": config_doc}
    )

@router.put("/system-settings", summary="Update global platform system settings")
async def update_system_settings(
    new_settings: Dict[str, Any] = Body(...),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    settings_coll = db["system_settings"]
    audit_repo = AuditLogRepository(db)

    await settings_coll.update_one(
        {"_id": "global_config"},
        {"$set": new_settings},
        upsert=True
    )

    actor_email = current_user.get("email", "superadmin@scholarai.com")
    await audit_repo.log_event(
        action="SYSTEM_SETTINGS_UPDATED",
        actor_email=actor_email,
        details={"updated_keys": list(new_settings.keys())}
    )

    return SuccessResponse(
        success=True,
        message="Global system settings updated.",
        data={"settings": new_settings}
    )

@router.get("/analytics", summary="Retrieve system enterprise telemetry")
async def get_super_admin_analytics(db: AsyncIOMotorDatabase = Depends(get_database)):
    telemetry = await AdminAnalyticsService.get_dashboard_telemetry(db)
    charts = await AdminAnalyticsService.get_analytics_charts(db)
    return SuccessResponse(
        success=True,
        message="Super Admin telemetry and analytics retrieved.",
        data={"telemetry": telemetry, "charts": charts}
    )
