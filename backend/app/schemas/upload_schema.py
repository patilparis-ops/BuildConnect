from pydantic import BaseModel, ConfigDict


class UploadResponse(BaseModel):
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "success": True,
            "image_id": "8e8f4d6a-2ef5-4f70-a527-ff2a3e4e5425",
            "filename": "8e8f4d6a-2ef5-4f70-a527-ff2a3e4e5425.png",
            "path": "uploads/8e8f4d6a-2ef5-4f70-a527-ff2a3e4e5425.png",
        }
    })

    success: bool
    image_id: str
    filename: str
    path: str
