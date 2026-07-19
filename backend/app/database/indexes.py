import logging
from pymongo import IndexModel, ASCENDING, TEXT
from app.database.mongodb import db_manager

logger = logging.getLogger(__name__)

async def create_indexes() -> None:
    """
    Creates necessary MongoDB indexes on startup to optimize query performance
    and enforce uniqueness constraints.
    """
    db = db_manager.db
    if db is None:
        logger.warning("MongoDB client is not connected. Skipping index creation.")
        return

    logger.info("Initializing database index verification...")

    try:
        users_indexes = [
            IndexModel([("email", ASCENDING)], unique=True, name="idx_user_email_unique")
        ]
        await db.users.create_indexes(users_indexes)


        logger.info("Database index validation complete.")
    except Exception as e:
        logger.error(f"Error occurred during database index creation: {e}")
