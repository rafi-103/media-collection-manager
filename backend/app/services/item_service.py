from sqlalchemy.orm import Session
from app.repositories import item_repo as repo
from app.schemas.item_schema import ItemCreate

def get_all_items_service(db: Session):
    return repo.get_all_items(db)

def create_item_service(db: Session, item_data: ItemCreate):
    return repo.create_item(db, item_data)