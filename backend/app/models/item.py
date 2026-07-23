from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)
    creator = Column(String(255), nullable=False)
    genre = Column(String(100))
    status = Column(String(50), nullable=False, default="want_to_read")
    rating = Column(Integer)
    platform = Column(String(100))
    is_favorite = Column(Boolean, default=False)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())