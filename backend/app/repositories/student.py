from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database.mongodb import get_database
from app.repositories.base import BaseRepository

class StudentRepository(BaseRepository):
    """Repository handling database queries for the Students collection."""
    def __init__(self, db: AsyncIOMotorDatabase = Depends(get_database)):
        super().__init__(db, "students")
