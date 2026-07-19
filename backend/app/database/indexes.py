import logging
from pymongo import IndexModel, ASCENDING, TEXT
from app.database.mongodb import db_manager

logger = logging.getLogger(__name__)

async def create_indexes() -> None:
    """
    Creates necessary MongoDB indexes on startup to optimize query performance
    and enforce uniqueness constraints across users and scholarships collections.
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

        logger.info("Database index validation complete.")
    except Exception as e:
        logger.error(f"Error occurred during database index creation: {e}")
