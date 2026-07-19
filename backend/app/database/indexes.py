import logging
from pymongo import IndexModel, ASCENDING, DESCENDING, TEXT
from app.database.mongodb import db_manager

logger = logging.getLogger(__name__)

async def create_indexes() -> None:
    """
    Creates necessary MongoDB indexes on startup across users, scholarships,
    applications, saved_scholarships, audit_logs, and announcements collections.
    """
    db = db_manager.db
    if db is None:
        logger.warning("MongoDB client is not connected. Skipping index creation.")
        return

    logger.info("Initializing database index verification...")

    try:
        # 1. Users Indexes
        users_indexes = [
            IndexModel([("email", ASCENDING)], unique=True, name="idx_user_email_unique")
        ]
        await db.users.create_indexes(users_indexes)

        # 2. Scholarships Indexes
        scholarship_indexes = [
            IndexModel([("slug", ASCENDING)], unique=True, name="idx_scholarship_slug_unique"),
            IndexModel([("status", ASCENDING)], name="idx_scholarship_status"),
            IndexModel([("category", ASCENDING)], name="idx_scholarship_category"),
            IndexModel([("government_level", ASCENDING)], name="idx_scholarship_govt_level"),
            IndexModel([("eligibility_criteria.state", ASCENDING)], name="idx_scholarship_state"),
            IndexModel([("application_info.end_date", ASCENDING)], name="idx_scholarship_deadline"),
            IndexModel(
                [
                    ("title", TEXT),
                    ("provider", TEXT),
                    ("short_description", TEXT),
                    ("description", TEXT)
                ],
                name="idx_scholarship_text_search"
            )
        ]
        await db.scholarships.create_indexes(scholarship_indexes)

        # 3. Applications Indexes
        applications_indexes = [
            IndexModel([("application_number", ASCENDING)], unique=True, name="idx_app_num_unique"),
            IndexModel([("student_id", ASCENDING), ("scholarship_id", ASCENDING)], unique=True, name="idx_app_student_sch_unique"),
            IndexModel([("status", ASCENDING)], name="idx_app_status"),
            IndexModel([("student_id", ASCENDING)], name="idx_app_student_id")
        ]
        await db.applications.create_indexes(applications_indexes)

        # 4. Saved Scholarships Indexes
        saved_indexes = [
            IndexModel([("student_id", ASCENDING), ("scholarship_id", ASCENDING)], unique=True, name="idx_saved_student_sch_unique"),
            IndexModel([("student_id", ASCENDING)], name="idx_saved_student_id")
        ]
        await db.saved_scholarships.create_indexes(saved_indexes)

        # 5. Audit Logs Indexes
        audit_indexes = [
            IndexModel([("timestamp", DESCENDING)], name="idx_audit_timestamp"),
            IndexModel([("actor_email", ASCENDING)], name="idx_audit_actor")
        ]
        await db.audit_logs.create_indexes(audit_indexes)

        # 6. Announcements Indexes
        announcement_indexes = [
            IndexModel([("created_at", DESCENDING)], name="idx_announcement_date")
        ]
        await db.announcements.create_indexes(announcement_indexes)

        logger.info("Database index validation complete.")
    except Exception as e:
        logger.error(f"Error occurred during database index creation: {e}")
