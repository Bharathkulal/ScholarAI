from fastapi import APIRouter

router = APIRouter()

@router.get("/overview", summary="Retrieve basic portal analytics statistics")
async def get_overview():
    return {"metrics": {}, "status": "placeholder"}

@router.get("/demographics", summary="Retrieve demographic analytics on applications")
async def get_demographics():
    return {"demographics": {}, "status": "placeholder"}
