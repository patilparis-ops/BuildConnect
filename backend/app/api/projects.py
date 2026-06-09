from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse

from app.schemas.project_schema import (
    ProjectDetail,
    ProjectExportResponse,
    ProjectFile,
    ProjectSummary,
)
from app.services.export_service import ExportError, ExportNotFoundError, ExportService
from app.services.project_service import ProjectNotFoundError, ProjectReadError, ProjectService


router = APIRouter(prefix="/api/projects", tags=["projects"])


def get_project_service() -> ProjectService:
    return ProjectService()


def get_export_service() -> ExportService:
    return ExportService()


@router.get(
    "",
    response_model=list[ProjectSummary],
    summary="List generated projects",
    description="Return all generated projects from generated_projects/*/metadata.json.",
)
async def list_projects(
    project_service: ProjectService = Depends(get_project_service),
) -> list[ProjectSummary]:
    try:
        projects = project_service.list_projects()
    except ProjectReadError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc

    return [ProjectSummary(**project) for project in projects]


@router.get(
    "/{project_id}",
    response_model=ProjectDetail,
    summary="Get generated project",
    description="Return metadata and generated project files for a project.",
)
async def get_project(
    project_id: str,
    project_service: ProjectService = Depends(get_project_service),
) -> ProjectDetail:
    try:
        project = project_service.get_project(project_id)
    except ProjectNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc
    except ProjectReadError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc

    return ProjectDetail(
        project_id=project.project_id,
        metadata=project.metadata,
        files=[
            ProjectFile(path=project_file.path, content=project_file.content)
            for project_file in project.files
        ],
    )


@router.post(
    "/{project_id}/export",
    response_model=ProjectExportResponse,
    summary="Export generated project",
    description="Create a ZIP archive for a generated project.",
)
async def export_project(
    project_id: str,
    export_service: ExportService = Depends(get_export_service),
) -> ProjectExportResponse:
    try:
        export_service.export_project(project_id)
    except ExportNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc
    except ExportError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc

    return ProjectExportResponse(
        success=True,
        project_id=project_id,
        download_url=f"/api/projects/{project_id}/download",
    )


@router.get(
    "/{project_id}/download",
    response_class=FileResponse,
    summary="Download exported project",
    description="Download the ZIP archive for a generated project.",
)
async def download_project(
    project_id: str,
    export_service: ExportService = Depends(get_export_service),
) -> FileResponse:
    try:
        zip_path = export_service.get_download_path(project_id)
    except ExportNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    return FileResponse(
        path=zip_path,
        media_type="application/zip",
        filename=f"{project_id}.zip",
    )
