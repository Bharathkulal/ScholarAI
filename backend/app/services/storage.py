import os
import uuid
import shutil
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, List
from fastapi import UploadFile, HTTPException, status

logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

class BaseStorageService(ABC):
    """Abstract base class defining storage operations for student documents and avatars."""

    @abstractmethod
    async def save_file(self, file: UploadFile, folder: str = "documents") -> Dict[str, Any]:
        pass

    @abstractmethod
    async def delete_file(self, file_url_or_path: str) -> bool:
        pass

class LocalStorageService(BaseStorageService):
    """Local filesystem storage implementation with abstraction for future Cloud providers."""

    def __init__(self, base_dir: str = None):
        if not base_dir:
            # Default to backend/app/uploads directory
            base_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
        self.base_dir = base_dir
        os.makedirs(self.base_dir, exist_ok=True)

    async def save_file(self, file: UploadFile, folder: str = "documents") -> Dict[str, Any]:
        # Validate filename and extension
        filename = file.filename or "file"
        _, ext = os.path.splitext(filename)
        ext = ext.lower()

        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file format '{ext}'. Allowed formats: PDF, PNG, JPG, JPEG."
            )

        # Check file size by reading chunk or seek
        file.file.seek(0, os.SEEK_END)
        file_size = file.file.tell()
        file.file.seek(0)

        if file_size > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File size exceeds the 10 MB limit (Current: {round(file_size / (1024 * 1024), 2)} MB)."
            )

        # Prepare target folder
        target_folder = os.path.join(self.base_dir, folder)
        os.makedirs(target_folder, exist_ok=True)

        unique_filename = f"{uuid.uuid4().hex}{ext}"
        target_filepath = os.path.join(target_folder, unique_filename)

        # Write file contents
        try:
            with open(target_filepath, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            logger.error(f"Failed to save uploaded file locally: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to store uploaded file on server."
            )

        # Public relative URL
        file_url = f"/uploads/{folder}/{unique_filename}"

        return {
            "filename": unique_filename,
            "original_filename": filename,
            "file_url": file_url,
            "file_size": file_size,
            "mime_type": file.content_type or "application/octet-stream"
        }

    async def delete_file(self, file_url_or_path: str) -> bool:
        if not file_url_or_path:
            return False

        # Clean URL prefix if present
        clean_path = file_url_or_path
        if clean_path.startswith("/uploads/"):
            clean_path = clean_path.replace("/uploads/", "")
        
        full_path = os.path.join(self.base_dir, clean_path)

        if os.path.exists(full_path) and os.path.isfile(full_path):
            try:
                os.remove(full_path)
                logger.info(f"Successfully deleted local file: {full_path}")
                return True
            except Exception as e:
                logger.error(f"Error removing local file {full_path}: {e}")
                return False
        return False

def get_storage_service() -> BaseStorageService:
    """Dependency factory providing configured storage service instance."""
    return LocalStorageService()
