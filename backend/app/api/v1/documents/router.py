from fastapi import APIRouter

router = APIRouter()

@router.get("", summary="List all uploaded student documents")
async def list_documents():
    return {"documents": [], "status": "placeholder"}

@router.post("/upload", summary="Upload a new document (e.g. transcript, recommendation letter)")
async def upload_document():
    return {"message": "Document uploaded successfully", "status": "placeholder"}

@router.delete("/{document_id}", summary="Delete an uploaded document")
async def delete_document(document_id: str):
    return {"id": document_id, "deleted": True, "status": "placeholder"}
