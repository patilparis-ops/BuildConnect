from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import generate, projects, upload


ALLOWED_ORIGINS = ["http://localhost:5173"]


def create_app() -> FastAPI:
    app = FastAPI(
        title="FrameForge Backend",
        description="Backend foundation for FrameForge.",
        version="0.1.0",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(upload.router)
    app.include_router(generate.router)
    app.include_router(projects.router)

    @app.get("/health", tags=["health"])
    async def health_check() -> dict[str, str]:
        return {
            "status": "healthy",
            "service": "FrameForge Backend",
        }

    return app


app = create_app()
