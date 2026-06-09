from typing import Any

from pydantic import BaseModel, ConfigDict


class ProjectSummary(BaseModel):
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "project_id": "7c5f8b51-9b3c-4e5d-9f2d-8a15f493f832",
            "image_id": "8e8f4d6a-2ef5-4f70-a527-ff2a3e4e5425",
            "status": "completed",
            "created_at": "2026-06-06T20:45:31.123456+00:00",
        }
    })

    project_id: str
    image_id: str
    status: str
    created_at: str


class ProjectFile(BaseModel):
    path: str
    content: str


class ProjectDetail(BaseModel):
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "project_id": "7c5f8b51-9b3c-4e5d-9f2d-8a15f493f832",
            "metadata": {
                "project_id": "7c5f8b51-9b3c-4e5d-9f2d-8a15f493f832",
                "image_id": "8e8f4d6a-2ef5-4f70-a527-ff2a3e4e5425",
                "prompt": "Create a clean product landing page.",
                "status": "completed",
                "created_at": "2026-06-06T20:45:31.123456+00:00",
            },
            "files": [
                {
                    "path": "src/App.tsx",
                    "content": "export default function App() { ... }",
                }
            ],
        }
    })

    project_id: str
    metadata: dict[str, Any]
    files: list[ProjectFile]


class ProjectExportResponse(BaseModel):
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "success": True,
            "project_id": "7c5f8b51-9b3c-4e5d-9f2d-8a15f493f832",
            "download_url": "/api/projects/7c5f8b51-9b3c-4e5d-9f2d-8a15f493f832/download",
        }
    })

    success: bool
    project_id: str
    download_url: str
