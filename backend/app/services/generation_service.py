import json
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from uuid import uuid4


SUPPORTED_IMAGE_EXTENSIONS = ("png", "jpg", "jpeg", "webp")


class UploadedImageNotFoundError(FileNotFoundError):
    pass


@dataclass(frozen=True)
class GeneratedProject:
    project_id: str
    status: str


class GenerationService:
    def __init__(
        self,
        uploads_dir: Path | None = None,
        generated_projects_dir: Path | None = None,
    ) -> None:
        project_root = Path(__file__).resolve().parents[3]
        self.uploads_dir = uploads_dir or project_root / "uploads"
        self.generated_projects_dir = (
            generated_projects_dir or project_root / "generated_projects"
        )

    def generate_project(self, image_id: str, prompt: str | None = None) -> GeneratedProject:
        self._get_uploaded_image_path(image_id)

        project_id = str(uuid4())
        project_dir = self.generated_projects_dir / project_id
        src_dir = project_dir / "src"
        src_dir.mkdir(parents=True, exist_ok=False)

        metadata = {
            "project_id": project_id,
            "image_id": image_id,
            "prompt": prompt or "",
            "status": "completed",
            "created_at": datetime.now(UTC).isoformat(),
        }

        self._write_project_files(project_dir, src_dir, metadata)

        return GeneratedProject(project_id=project_id, status="completed")

    def _get_uploaded_image_path(self, image_id: str) -> Path:
        for extension in SUPPORTED_IMAGE_EXTENSIONS:
            image_path = self.uploads_dir / f"{image_id}.{extension}"
            if image_path.is_file():
                return image_path

        raise UploadedImageNotFoundError(
            f"Uploaded image with image_id '{image_id}' was not found."
        )

    def _write_project_files(
        self,
        project_dir: Path,
        src_dir: Path,
        metadata: dict[str, str],
    ) -> None:
        (project_dir / "metadata.json").write_text(
            json.dumps(metadata, indent=2),
            encoding="utf-8",
        )
        (project_dir / "package.json").write_text(
            json.dumps(self._package_json(), indent=2),
            encoding="utf-8",
        )
        (src_dir / "App.tsx").write_text(self._app_tsx(), encoding="utf-8")
        (src_dir / "main.tsx").write_text(self._main_tsx(), encoding="utf-8")
        (src_dir / "index.css").write_text(self._index_css(), encoding="utf-8")

    def _package_json(self) -> dict[str, object]:
        return {
            "scripts": {
                "dev": "vite",
                "build": "tsc -b && vite build",
                "preview": "vite preview",
            },
            "dependencies": {
                "@vitejs/plugin-react": "latest",
                "vite": "latest",
                "typescript": "latest",
                "react": "latest",
                "react-dom": "latest",
            },
            "devDependencies": {},
        }

    def _app_tsx(self) -> str:
        return """export default function App() {
  return <h1>FrameForge Generated Project</h1>;
}
"""

    def _main_tsx(self) -> str:
        return """import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
"""

    def _index_css(self) -> str:
        return """body {
  margin: 0;
  font-family: Arial, sans-serif;
}

#root {
  min-height: 100vh;
  display: grid;
  place-items: center;
}
"""
