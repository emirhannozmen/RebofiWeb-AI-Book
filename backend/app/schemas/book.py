from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime
from uuid import UUID

class BookBase(BaseModel):
    title: str
    author: str
    publisher: Optional[str] = None
    isbn: Optional[str] = None
    publication_date: Optional[int] = None
    print_number: Optional[int] = None
    personal_rating: Optional[int] = Field(None, ge=1, le=5)
    reading_status: Optional[str] = None
    personal_notes: Optional[str] = None

class BookCreate(BookBase):
    pass

class BookUpdate(BookBase):
    title: Optional[str] = None
    author: Optional[str] = None

class BookResponse(BookBase):
    book_id: UUID
    user_id: UUID
    cover_image_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
