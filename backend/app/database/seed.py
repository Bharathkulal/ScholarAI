import logging
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.config import settings
from app.core.security import get_password_hash
from app.repositories.user import UserRepository

logger = logging.getLogger(__name__)

async def seed_initial_roles_and_users(db: AsyncIOMotorDatabase) -> None:
    """
    Checks the users collection on application startup and seeds default
    Super Admin and Admin accounts if none exist in MongoDB.
    """
    if db is None:
        logger.warning("Database connection is None. Skipping seed initialization.")
        return

    user_repo = UserRepository(db)

    # 1. Check & Seed Super Admin
    super_admin_count = await user_repo.count({"role": "super_admin"})
    if super_admin_count == 0:
        # Also check for legacy 'superadmin' role string just in case
        legacy_count = await user_repo.count({"role": "superadmin"})
        if legacy_count > 0:
            logger.info("Migrating legacy 'superadmin' role documents to 'super_admin'...")
            await user_repo.collection.update_many(
                {"role": "superadmin"},
                {"$set": {"role": "super_admin"}}
            )
        else:
            logger.info(f"No Super Admin account found. Creating default Super Admin: '{settings.DEFAULT_SUPER_ADMIN_EMAIL}'...")
            super_admin_data = {
                "full_name": "System Super Admin",
                "email": settings.DEFAULT_SUPER_ADMIN_EMAIL.strip().lower(),
                "password_hash": get_password_hash(settings.DEFAULT_SUPER_ADMIN_PASSWORD),
                "role": "super_admin",
                "is_email_verified": True,
                "is_active": True,
                "provider": "email",
                "phone": "+10000000000",
            }
            await user_repo.create_user(super_admin_data)
            logger.info("Default Super Admin account created successfully.")

    # 2. Check & Seed Default Admin
    admin_count = await user_repo.count({"role": "admin"})
    if admin_count == 0:
        logger.info(f"No Admin account found. Creating default Admin: '{settings.DEFAULT_ADMIN_EMAIL}'...")
        admin_data = {
            "full_name": "ScholarAI Portal Admin",
            "email": settings.DEFAULT_ADMIN_EMAIL.strip().lower(),
            "password_hash": get_password_hash(settings.DEFAULT_ADMIN_PASSWORD),
            "role": "admin",
            "is_email_verified": True,
            "is_active": True,
            "provider": "email",
            "phone": "+10000000001",
        }
        await user_repo.create_user(admin_data)
        logger.info("Default Admin account created successfully.")
