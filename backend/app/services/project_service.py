import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any


class ProjectNotFoundError(FileNotFoundError):
    pass


class ProjectReadError(RuntimeError):
    pass


@dataclass(frozen=True)
class ProjectFileData:
    path: str
    content: str


@dataclass(frozen=True)
class ProjectData:
    project_id: str
    metadata: dict[str, Any]
    files: list[ProjectFileData]


class ProjectService:
    def __init__(self, generated_projects_dir: Path | None = None) -> None:
        project_root = Path(__file__).resolve().parents[3]
        self.generated_projects_dir = (
            generated_projects_dir or project_root / "generated_projects"
        )

    def list_projects(self) -> list[dict[str, str]]:
        if not self.generated_projects_dir.exists():
            return []

        projects: list[dict[str, str]] = []
        for metadata_path in sorted(self.generated_projects_dir.glob("*/metadata.json")):
            metadata = self._read_metadata(metadata_path)
            projects.append({
                "project_id": str(metadata.get("project_id", "")),
                "image_id": str(metadata.get("image_id", "")),
                "status": str(metadata.get("status", "")),
                "created_at": str(metadata.get("created_at", "")),
            })

        return projects

    def get_project(self, project_id: str) -> ProjectData:
        project_dir = self.generated_projects_dir / project_id
        metadata_path = project_dir / "metadata.json"

        if not project_dir.is_dir() or not metadata_path.is_file():
            raise ProjectNotFoundError(f"Project with project_id '{project_id}' was not found.")

        metadata = self._read_metadata(metadata_path)
        files = self._read_project_files(project_dir)

        return ProjectData(project_id=project_id, metadata=metadata, files=files)

    def _read_metadata(self, metadata_path: Path) -> dict[str, Any]:
        try:
            return json.loads(metadata_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            raise ProjectReadError(f"Failed to read metadata file: {metadata_path}") from exc

    def _read_project_files(self, project_dir: Path) -> list[ProjectFileData]:
        files: list[ProjectFileData] = []

        for file_path in sorted(path for path in project_dir.rglob("*") if path.is_file()):
            relative_path = file_path.relative_to(project_dir).as_posix()
            if relative_path == "metadata.json":
                continue

            try:
                content = file_path.read_text(encoding="utf-8")
            except OSError as exc:
                raise ProjectReadError(f"Failed to read project file: {file_path}") from exc

            files.append(ProjectFileData(path=relative_path, content=content))

        return files
