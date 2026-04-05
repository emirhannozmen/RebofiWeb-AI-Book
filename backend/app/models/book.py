from sqlalchemy import Column, String, Integer, Date, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.database import Base
from app.models import TimestampMixin

class Book(Base, TimestampMixin):
    __tablename__ = "books"

    book_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=False, index=True)
    author = Column(String(255), nullable=False, index=True)
    publisher = Column(String(255))
    isbn = Column(String(20))
    publication_date = Column(Integer)
    print_number = Column(Integer)
    cover_image_url = Column(Text)
    personal_rating = Column(Integer)
    reading_status = Column(String(20))  # 'completed', 'reading', 'want_to_read'
    personal_notes = Column(Text)

    owner = relationship("User", back_populates="books")
    recommendations = relationship("Recommendation", back_populates="reference_book")
