from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from uuid import UUID
from app.models.book import Book
from app.schemas.book import BookCreate, BookUpdate
from app.models.recommendation import Recommendation

async def create_book(db: AsyncSession, book: BookCreate, user_id: UUID, cover_image_url: str = None) -> Book:
    db_book = Book(
        **book.model_dump(),
        user_id=user_id,
        cover_image_url=cover_image_url
    )
    db.add(db_book)
    await db.commit()
    await db.refresh(db_book)
    return db_book

async def create_book_from_recommendation(db: AsyncSession, user_id: UUID, recommendation_id: UUID) -> Book:
    result = await db.execute(select(Recommendation).where(Recommendation.recommendation_id == recommendation_id, Recommendation.user_id == user_id))
    rec = result.scalars().first()
    if not rec:
        raise ValueError("Recommendation not found")
    
    db_book = Book(
        user_id=user_id,
        title=rec.recommended_title,
        author=rec.recommended_author,
        reading_status="want_to_read",
        personal_notes=f"Recommended because: {rec.recommendation_reason}"
    )
    db.add(db_book)
    await db.commit()
    await db.refresh(db_book)
    return db_book

async def get_books(db: AsyncSession, user_id: UUID, skip: int = 0, limit: int = 20) -> List[Book]:
    result = await db.execute(
        select(Book).where(Book.user_id == user_id).offset(skip).limit(limit).order_by(Book.created_at.desc())
    )
    return result.scalars().all()

async def get_book(db: AsyncSession, book_id: UUID, user_id: UUID) -> Optional[Book]:
    result = await db.execute(
        select(Book).where(Book.book_id == book_id, Book.user_id == user_id)
    )
    return result.scalars().first()

async def update_book(db: AsyncSession, book_id: UUID, user_id: UUID, book_update: BookUpdate, cover_url: str = None) -> Optional[Book]:
    db_book = await get_book(db, book_id, user_id)
    if not db_book:
        return None
    
    for key, value in book_update.model_dump(exclude_unset=True).items():
        if value is not None: # Only update if value is provided
            setattr(db_book, key, value)
    
    if cover_url:
        db_book.cover_image_url = cover_url
    
    await db.commit()
    await db.refresh(db_book)
    return db_book

async def delete_book(db: AsyncSession, book_id: UUID, user_id: UUID) -> bool:
    db_book = await get_book(db, book_id, user_id)
    if not db_book:
        return False
    
    await db.delete(db_book)
    await db.commit()
    return True