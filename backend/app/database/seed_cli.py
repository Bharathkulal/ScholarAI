import asyncio
import logging
from app.database.mongodb import db_manager
from app.database.seed import seed_initial_roles_and_users

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("seed_cli")

async def main():
    logger.info("Connecting to MongoDB database...")
    await db_manager.connect()
    logger.info("Executing ScholarAI Database Seeder...")
    await seed_initial_roles_and_users(db_manager.db)
    await db_manager.close()
    logger.info("Seeding completed successfully.")

if __name__ == "__main__":
    asyncio.run(main())
