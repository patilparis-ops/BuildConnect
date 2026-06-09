from pydantic import BaseModel, ConfigDict, Field


class GenerateProjectRequest(BaseModel):
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "image_id": "8e8f4d6a-2ef5-4f70-a527-ff2a3e4e5425",
            "prompt": "Create a clean product landing page.",
        }
    })

    image_id: str | None = None
    prompt: str | None = None


class GenerateProjectResponse(BaseModel):
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "success": True,
            "project_id": "7c5f8b51-9b3c-4e5d-9f2d-8a15f493f832",
            "status": "completed",
        }
    })

    success: bool
    project_id: str
    status: str
