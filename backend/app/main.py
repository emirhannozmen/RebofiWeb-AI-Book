from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, books, recommendations
import os

app = FastAPI(title="Book Recommender API")

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

app.include_router(auth.router)
app.include_router(books.router)
app.include_router(recommendations.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Book Recommender API"}
