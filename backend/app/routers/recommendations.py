from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from uuid import UUID
from app.database import get_db
from app.schemas.recommendation import RecommendationResponse, GenerateRequest
from app.services import recommendation_service
from app.utils.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/api/recommendations",
    tags=["recommendations"]
)

@router.post("/generate", response_model=List[RecommendationResponse], status_code=status.HTTP_201_CREATED)
async def generate_recommendations(
    request: GenerateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return await recommendation_service.generate_recommendations(
            db, 
            current_user.user_id, 
            request.reference_book_id,
            request.language
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        # Log error
        print(f"Error: {e}")
        raise HTTPException(status_code=503, detail=f"AI Service unavailable or error occurred: {str(e)}")

@router.get("/", response_model=List[RecommendationResponse])
async def get_recommendations(
    is_accepted: Optional[bool] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await recommendation_service.get_recommendations(db, current_user.user_id, is_accepted)

@router.put("/{rec_id}/accept", response_model=RecommendationResponse)
async def accept_recommendation(
    rec_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rec = await recommendation_service.accept_recommendation(db, rec_id, current_user.user_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    return rec

@router.put("/{rec_id}/read", response_model=RecommendationResponse)
async def mark_as_read(
    rec_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rec = await recommendation_service.mark_as_read(db, rec_id, current_user.user_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    return rec

@router.delete("/{rec_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recommendation(
    rec_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    success = await recommendation_service.delete_recommendation(db, rec_id, current_user.user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    return None
