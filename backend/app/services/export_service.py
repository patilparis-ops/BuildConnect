from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile


class ExportError(RuntimeError):
    pass


class ExportNotFoundError(FileNotFoundError):
    pass


class ExportService:
    def __init__(
        self,
        generated_projects_dir: Path | None = None,
        exports_dir: Path | None = None,
    ) -> None:
        project_root = Path(__file__).resolve().parents[3]
        self.generated_projects_dir = (
            generated_projects_dir or project_root / "generated_projects"
        )
        self.exports_dir = exports_dir or project_root / "exports"

    def export_project(self, project_id: str) -> Path:
        project_dir = self.generated_projects_dir / project_id
        metadata_path = project_dir / "metadata.json"

        if not project_dir.is_dir() or not metadata_path.is_file():
            raise ExportNotFoundError(
                f"Project with project_id '{project_id}' was not found."
            )

        self.exports_dir.mkdir(parents=True, exist_ok=True)
        zip_path = self.get_export_path(project_id)

        try:
            with ZipFile(zip_path, "w", compression=ZIP_DEFLATED) as zip_file:
                for file_path in sorted(path for path in project_dir.rglob("*") if path.is_file()):
                    archive_name = file_path.relative_to(project_dir).as_posix()
                    zip_file.write(file_path, archive_name)
        except OSError as exc:
            raise ExportError(f"Failed to export project '{project_id}'.") from exc

        return zip_path

    def get_download_path(self, project_id: str) -> Path:
        zip_path = self.get_export_path(project_id)
        if not zip_path.is_file():
            raise ExportNotFoundError(
                f"Export ZIP for project_id '{project_id}' was not found."
            )

        return zip_path

    def get_export_path(self, project_id: str) -> Path:
        return self.exports_dir / f"{project_id}.zip"
