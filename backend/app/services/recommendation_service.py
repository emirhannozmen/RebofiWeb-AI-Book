from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
from typing import List
from app.models.recommendation import Recommendation
from app.models.book import Book
from app.services import gemini_service
from datetime import datetime

async def generate_recommendations(db: AsyncSession, user_id: UUID, reference_book_id: UUID, language: str = "tr") -> List[Recommendation]:
    # Get reference book
    result = await db.execute(select(Book).where(Book.book_id == reference_book_id))
    book = result.scalars().first()
    if not book:
        raise ValueError("Reference book not found")

    # Call Gemini
    ai_recs = await gemini_service.generate_book_recommendations(book.title, book.author, language)

    # Save to DB
    db_recs = []
    for rec in ai_recs:
        db_rec = Recommendation(
            user_id=user_id,
            reference_book_id=reference_book_id,
            recommended_title=rec.recommended_title,
            recommended_author=rec.recommended_author,
            recommendation_reason=rec.recommendation_reason,
            is_accepted=False,
            is_read=False
        )
        db.add(db_rec)
        db_recs.append(db_rec)
    
    await db.commit()
    for rec in db_recs:
        await db.refresh(rec)
        
    return db_recs

async def get_recommendations(db: AsyncSession, user_id: UUID, is_accepted: bool = None) -> List[Recommendation]:
    query = select(Recommendation).where(Recommendation.user_id == user_id)
    if is_accepted is not None:
        query = query.where(Recommendation.is_accepted == is_accepted)
    
    result = await db.execute(query.order_by(Recommendation.recommended_at.desc()))
    return result.scalars().all()

async def accept_recommendation(db: AsyncSession, recommendation_id: UUID, user_id: UUID) -> Recommendation:
    result = await db.execute(select(Recommendation).where(Recommendation.recommendation_id == recommendation_id, Recommendation.user_id == user_id))
    rec = result.scalars().first()
    if rec:
        rec.is_accepted = True
        rec.accepted_at = datetime.utcnow()
        await db.commit()
        await db.refresh(rec)
    return rec

async def mark_as_read(db: AsyncSession, recommendation_id: UUID, user_id: UUID) -> Recommendation:
    result = await db.execute(select(Recommendation).where(Recommendation.recommendation_id == recommendation_id, Recommendation.user_id == user_id))
    rec = result.scalars().first()
    if rec:
        rec.is_read = True
        rec.read_at = datetime.utcnow()
        await db.commit()
        await db.refresh(rec)
    return rec

async def delete_recommendation(db: AsyncSession, recommendation_id: UUID, user_id: UUID) -> bool:
    result = await db.execute(select(Recommendation).where(Recommendation.recommendation_id == recommendation_id, Recommendation.user_id == user_id))
    rec = result.scalars().first()
    if not rec:
        return False
    
    await db.delete(rec)
    await db.commit()
    return True
