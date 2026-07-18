from fastapi import APIRouter
from app.database.connection import get_database

router = APIRouter()

@router.get("/health")
@router.get("")
async def health_check():
    db = get_database()
    db_status = "disconnected"
    if db is not None:
        try:
            # Verify database is active and responsive
            await db.client.admin.command('ping')
            db_status = "connected"
        except Exception:
            db_status = "disconnected"
            
    return {
        "status": "healthy",
        "server": "running",
        "database": db_status,
        "version": "1.0.0"
    }
