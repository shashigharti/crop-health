from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from dotenv import load_dotenv

from core.gee import init_gee
from api.routes import router

load_dotenv()
init_gee()

app = FastAPI(title="CropHealth API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DIST = Path(__file__).parent.parent / "frontend" / "dist"

app.include_router(router)
app.mount("/assets", StaticFiles(directory=DIST / "assets"), name="assets")


@app.get("/{full_path:path}")
def serve_frontend(full_path: str):
    return FileResponse(DIST / "index.html")
