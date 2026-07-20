from typing import Any, Dict, List, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

class BaseRepository:
    """Base repository class wrapping generic async MongoDB CRUD queries using Motor."""
    def __init__(self, db: AsyncIOMotorDatabase, collection_name: str):
        self.db = db
        self.collection = db[collection_name] if db is not None else None

    async def get_by_id(self, id: str) -> Optional[Dict[str, Any]]:
        """Finds a single document by its ObjectId string representation."""
        if self.collection is None or not ObjectId.is_valid(id):
            return None
        return await self.collection.find_one({"_id": ObjectId(id)})

    async def find(
        self, 
        query: Dict[str, Any] = None, 
        limit: int = 10, 
        skip: int = 0, 
        sort: List[tuple] = None
    ) -> List[Dict[str, Any]]:
        """Retrieves a list of documents matching the search query with pagination."""
        if self.collection is None:
            return []
        query = query or {}
        cursor = self.collection.find(query).skip(skip).limit(limit)
        if sort:
            cursor = cursor.sort(sort)
        return await cursor.to_list(length=limit)

    async def create(self, document: Dict[str, Any]) -> Dict[str, Any]:
        """Inserts a new document into the collection."""
        if self.collection is None:
            raise RuntimeError("Database connection not established")
        result = await self.collection.insert_one(document)
        document["_id"] = result.inserted_id
        return document

    async def update(self, id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Updates and returns the modified document by its id."""
        if self.collection is None or not ObjectId.is_valid(id):
            return None
        
        # Ensure we return the updated document
        from pymongo import ReturnDocument
        result = await self.collection.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": update_data},
            return_document=ReturnDocument.AFTER
        )
        return result

    async def delete(self, id: str) -> bool:
        """Removes a document from the collection by its id."""
        if self.collection is None or not ObjectId.is_valid(id):
            return False
        result = await self.collection.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0

    async def count(self, query: Dict[str, Any] = None) -> int:
        """Counts the total number of documents matching a query."""
        if self.collection is None:
            return 0
        query = query or {}
        return await self.collection.count_documents(query)
