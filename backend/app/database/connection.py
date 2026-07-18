import logging
from motor.motor_asyncio import AsyncIOMotorClient
from app.config.settings import settings

logger = logging.getLogger(__name__)

class DatabaseConnection:
    client: AsyncIOMotorClient = None
    db = None

db_instance = DatabaseConnection()

async def connect_to_mongo():
    logger.info("Connecting to MongoDB...")
    try:
        db_instance.client = AsyncIOMotorClient(settings.MONGODB_URI)
        # Attempt to ping database to verify credentials
        await db_instance.client.admin.command('ping')
        try:
            db_name = db_instance.client.get_default_database().name
        except Exception:
            db_name = "scholarai"
        db_instance.db = db_instance.client[db_name]
        logger.info(f"Connected to MongoDB database '{db_name}' successfully.")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        # Allow the application to start without crashing so developers can work on other API endpoints.
        db_instance.db = None

async def close_mongo_connection():
    logger.info("Closing MongoDB connection...")
    if db_instance.client:
        db_instance.client.close()
        logger.info("MongoDB connection closed.")

def get_database():
    """Dependency provider for database reference."""
    return db_instance.db
