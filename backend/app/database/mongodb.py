import logging
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

logger = logging.getLogger(__name__)

class DatabaseManager:
    """Manager class for configuring and accessing MongoDB database connection."""
    client: AsyncIOMotorClient = None
    db = None

    async def connect(self) -> None:
        """Establish a connection to the MongoDB instance and ping it to check status."""
        logger.info("Initializing connection to MongoDB...")
        try:
            self.client = AsyncIOMotorClient(settings.MONGODB_URI)
            # Ping the database to verify active connection
            await self.client.admin.command("ping")
            self.db = self.client[settings.DATABASE_NAME]
            logger.info(f"Connected to MongoDB database '{settings.DATABASE_NAME}' successfully.")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB at {settings.MONGODB_URI}: {e}")
            # Do not crash the server start, allow it to run in case Mongo is starting up or offline
            self.db = None

    async def close(self) -> None:
        """Close the active connection client."""
        if self.client:
            logger.info("Closing MongoDB connection client...")
            self.client.close()
            logger.info("MongoDB connection closed.")
            self.client = None
            self.db = None

db_manager = DatabaseManager()

async def get_database():
    """Dependency provider returning the active database reference."""
    return db_manager.db
