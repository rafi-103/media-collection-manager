from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ItemBase(BaseModel):
    title: str
    type: str
    creator: str
    genre: Optional[str] = None
    status: str = "want_to_read"
    rating: Optional[int] = None
    platform: Optional[str] = None
    is_favorite: bool = False
    notes: Optional[str] = None

class ItemCreate(ItemBase):
    pass

class ItemUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    creator: Optional[str] = None
    genre: Optional[str] = None
    status: Optional[str] = None
    rating: Optional[int] = None
    platform: Optional[str] = None
    is_favorite: Optional[bool] = None
    notes: Optional[str] = None

class ItemResponse(ItemBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True