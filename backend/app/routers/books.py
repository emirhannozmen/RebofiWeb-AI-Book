from fastapi import APIRouter, Depends, status, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from uuid import UUID
from app.database import get_db
from app.schemas.book import BookResponse, BookCreate, BookUpdate
from app.services import book_service
from app.utils.dependencies import get_current_user
from app.models.user import User
import shutil
import os
from app.config import settings

router = APIRouter(
    prefix="/api/books",
    tags=["books"]
)

@router.post("/", response_model=BookResponse, status_code=status.HTTP_201_CREATED)
async def create_book(
    title: str = Form(...),
    author: str = Form(...),
    publisher: Optional[str] = Form(None),
    isbn: Optional[str] = Form(None),
    publication_date: Optional[int] = Form(None),
    personal_rating: Optional[int] = Form(None),
    reading_status: Optional[str] = Form(None),
    personal_notes: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    book_in = BookCreate(
        title=title,
        author=author,
        publisher=publisher,
        isbn=isbn,
        publication_date=publication_date,
        personal_rating=personal_rating,
        reading_status=reading_status,
        personal_notes=personal_notes
    )
    
    cover_url = None
    if image:
        # Create upload dir if not exists
        upload_path = f"{settings.UPLOAD_DIR}/covers/{current_user.user_id}"
        os.makedirs(upload_path, exist_ok=True)
        
        file_path = f"{upload_path}/{image.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        cover_url = file_path

    return await book_service.create_book(db, book_in, current_user.user_id, cover_url)

@router.post("/from-recommendation/{rec_id}", response_model=BookResponse, status_code=status.HTTP_201_CREATED)
async def create_from_recommendation(
    rec_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return await book_service.create_book_from_recommendation(db, current_user.user_id, rec_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/", response_model=List[BookResponse])
async def read_books(
    skip: int = 0, 
    limit: int = 20, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await book_service.get_books(db, current_user.user_id, skip, limit)

@router.get("/{book_id}", response_model=BookResponse)
async def read_book(
    book_id: UUID, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    book = await book_service.get_book(db, book_id, current_user.user_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.put("/{book_id}", response_model=BookResponse)
async def update_book(
    book_id: UUID, 
    title: Optional[str] = Form(None),
    author: Optional[str] = Form(None),
    publisher: Optional[str] = Form(None),
    isbn: Optional[str] = Form(None),
    publication_date: Optional[int] = Form(None),
    personal_rating: Optional[int] = Form(None),
    reading_status: Optional[str] = Form(None),
    personal_notes: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    book_update = BookUpdate(
        title=title,
        author=author,
        publisher=publisher,
        isbn=isbn,
        publication_date=publication_date,
        personal_rating=personal_rating,
        reading_status=reading_status,
        personal_notes=personal_notes
    )
    
    cover_url = None
    if image:
        # Create upload dir if not exists
        upload_path = f"{settings.UPLOAD_DIR}/covers/{current_user.user_id}"
        os.makedirs(upload_path, exist_ok=True)
        
        file_path = f"{upload_path}/{image.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        cover_url = file_path

    book = await book_service.update_book(db, book_id, current_user.user_id, book_update, cover_url)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_book(
    book_id: UUID, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    success = await book_service.delete_book(db, book_id, current_user.user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Book not found")
    return None
