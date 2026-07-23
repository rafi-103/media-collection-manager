from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.item_schema import ItemCreate, ItemResponse
from app.services import item_service as service

router = APIRouter(prefix="/api/items", tags=["Items"])

@router.get("/", response_model=list[ItemResponse])
def get_all_items(db: Session = Depends(get_db)):
    return service.get_all_items_service(db)

@router.post("/", response_model=ItemResponse, status_code=201)
def create_item(item_data: ItemCreate, db: Session = Depends(get_db)):
    return service.create_item_service(db, item_data)