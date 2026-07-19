from fastapi import APIRouter

router = APIRouter()

@router.post("", summary="Submit a scholarship application")
async def submit_application():
    return {"message": "Application submitted successfully", "status": "placeholder"}

@router.get("", summary="List all submitted applications for the active student")
async def list_applications():
    return {"applications": [], "status": "placeholder"}

@router.get("/{application_id}", summary="Get details of a specific application")
async def get_application(application_id: str):
    return {"id": application_id, "details": {}, "status": "placeholder"}

@router.delete("/{application_id}", summary="Withdraw a pending application")
async def withdraw_application(application_id: str):
    return {"id": application_id, "withdrawn": True, "status": "placeholder"}
