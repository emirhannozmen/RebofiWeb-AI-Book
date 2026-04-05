from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class RecommendationBase(BaseModel):
    recommended_title: str
    recommended_author: str
    recommendation_reason: str

class RecommendationCreate(RecommendationBase):
    reference_book_id: UUID

class RecommendationResponse(RecommendationBase):
    recommendation_id: UUID
    user_id: UUID
    reference_book_id: Optional[UUID] = None
    is_accepted: bool
    is_read: bool
    recommended_at: datetime
    accepted_at: Optional[datetime] = None
    read_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class GenerateRequest(BaseModel):
    reference_book_id: UUID
    language: str = "tr"  # Default to Turkish
