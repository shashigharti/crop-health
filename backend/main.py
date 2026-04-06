from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
from dotenv import load_dotenv

from core.gee import init_gee
from api.routes import router

load_dotenv()
init_gee()

app = FastAPI(title="CropHealth API")

DIST = Path(__file__).parent.parent / "frontend" / "dist"
app.mount("/assets", StaticFiles(directory=DIST / "assets"), name="assets")

app.include_router(router)


@app.get("/{full_path:path}")
def serve_frontend(full_path: str):
    return FileResponse(DIST / "index.html")
