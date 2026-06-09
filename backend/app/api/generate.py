from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.generation_schema import (
    GenerateProjectRequest,
    GenerateProjectResponse,
)
from app.services.generation_service import (
    GenerationService,
    UploadedImageNotFoundError,
)


router = APIRouter(prefix="/api/generate", tags=["generate"])


def get_generation_service() -> GenerationService:
    return GenerationService()


@router.post(
    "",
    response_model=GenerateProjectResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Generate a project",
    description="Create a React + Vite project from an uploaded image.",
)
async def generate_project(
    request: GenerateProjectRequest,
    generation_service: GenerationService = Depends(get_generation_service),
) -> GenerateProjectResponse:
    if not request.image_id or not request.image_id.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="image_id is required.",
        )

    try:
        generated_project = generation_service.generate_project(
            image_id=request.image_id.strip(),
            prompt=request.prompt,
        )
    except UploadedImageNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc
    except OSError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate project files.",
        ) from exc

    return GenerateProjectResponse(
        success=True,
        project_id=generated_project.project_id,
        status=generated_project.status,
    )
