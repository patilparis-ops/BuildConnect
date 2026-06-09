from dataclasses import dataclass
from pathlib import Path
from shutil import copyfileobj
from typing import BinaryIO
from uuid import uuid4

from fastapi import UploadFile
from starlette.concurrency import run_in_threadpool


SUPPORTED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}
SUPPORTED_CONTENT_TYPES = {
    "image/png",
    "image/jpeg",
    "image/webp",
}


class UnsupportedFileTypeError(ValueError):
    pass


@dataclass(frozen=True)
class SavedUpload:
    image_id: str
    filename: str
    path: str


class UploadService:
    def __init__(self, upload_dir: Path | None = None) -> None:
        project_root = Path(__file__).resolve().parents[3]
        self.upload_dir = upload_dir or project_root / "uploads"

    async def save_image(self, upload_file: UploadFile) -> SavedUpload:
        extension = self.validate_file_type(upload_file)
        image_id = str(uuid4())
        filename = self.generate_filename(image_id, extension)
        destination = self.upload_dir / filename

        self.upload_dir.mkdir(parents=True, exist_ok=True)
        await upload_file.seek(0)
        await run_in_threadpool(self._save_file, upload_file.file, destination)

        return SavedUpload(
            image_id=image_id,
            filename=filename,
            path=Path("uploads", filename).as_posix(),
        )

    def validate_file_type(self, upload_file: UploadFile) -> str:
        if not upload_file.filename:
            raise UnsupportedFileTypeError("Uploaded file must include a filename.")

        extension = Path(upload_file.filename).suffix.lower().lstrip(".")
        if extension not in SUPPORTED_EXTENSIONS:
            raise UnsupportedFileTypeError(
                "Unsupported file type. Supported formats are PNG, JPG, JPEG, and WebP."
            )

        content_type = (upload_file.content_type or "").lower()
        if content_type not in SUPPORTED_CONTENT_TYPES:
            raise UnsupportedFileTypeError(
                "Unsupported file content type. Supported formats are PNG, JPG, JPEG, and WebP."
            )

        return extension

    def generate_filename(self, image_id: str, extension: str) -> str:
        return f"{image_id}.{extension}"

    def _save_file(self, source: BinaryIO, destination: Path) -> None:
        with destination.open("wb") as output_file:
            copyfileobj(source, output_file)
