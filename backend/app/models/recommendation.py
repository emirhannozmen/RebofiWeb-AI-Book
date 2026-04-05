from sqlalchemy import Column, String, Boolean, Text, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.database import Base

class Recommendation(Base):
    __tablename__ = "recommendations"

    recommendation_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    reference_book_id = Column(UUID(as_uuid=True), ForeignKey("books.book_id", ondelete="SET NULL"), nullable=True)
    recommended_title = Column(String(500), nullable=False)
    recommended_author = Column(String(255), nullable=False)
    recommendation_reason = Column(Text, nullable=False)
    is_accepted = Column(Boolean, default=False)
    is_read = Column(Boolean, default=False)
    recommended_at = Column(DateTime(timezone=True), server_default=func.now())
    accepted_at = Column(DateTime(timezone=True))
    read_at = Column(DateTime(timezone=True))

    user = relationship("User", back_populates="recommendations")
    reference_book = relationship("Book", back_populates="recommendations")
