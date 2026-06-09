from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.schemas.upload_schema import UploadResponse
from app.services.upload_service import UnsupportedFileTypeError, UploadService


router = APIRouter(prefix="/api/upload", tags=["upload"])


def get_upload_service() -> UploadService:
    return UploadService()


@router.post(
    "",
    response_model=UploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload an image",
    description="Upload a PNG, JPG, JPEG, or WebP image for FrameForge.",
)
async def upload_image(
    file: UploadFile = File(..., description="Image file to upload."),
    upload_service: UploadService = Depends(get_upload_service),
) -> UploadResponse:
    try:
        saved_upload = await upload_service.save_image(file)
    except UnsupportedFileTypeError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    except OSError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save uploaded file.",
        ) from exc

    return UploadResponse(
        success=True,
        image_id=saved_upload.image_id,
        filename=saved_upload.filename,
        path=saved_upload.path,
    )
