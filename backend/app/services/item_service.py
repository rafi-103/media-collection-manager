from sqlalchemy.orm import Session
from app.repositories import item_repo as repo
from app.schemas.item_schema import ItemCreate, ItemUpdate

# CREATE
def create_item_service(db: Session, item_data: ItemCreate):
    if item_data.rating is not None and (item_data.rating < 1 or item_data.rating > 5):
        raise ValueError("Rating must be between 1 and 5")
    return repo.create_item(db, item_data)

# READ
def get_all_items_service(db: Session):
    return repo.get_all_items(db)

def get_item_service(db: Session, item_id: int):
    return repo.get_item_by_id(db, item_id)

# UPDATE
def update_item_service(db: Session, item_id: int, item_data: ItemUpdate):
    if item_data.rating is not None and (item_data.rating < 1 or item_data.rating > 5):
        raise ValueError("Rating must be between 1 and 5")
    return repo.update_item(db, item_id, item_data)

# DELETE
def delete_item_service(db: Session, item_id: int):
    return repo.delete_item(db, item_id)

# SEARCH
def search_items_service(db: Session, keyword: str):
    return repo.search_items(db, keyword)

# FILTER
def filter_by_type_service(db: Session, type_filter: str):
    return repo.filter_by_type(db, type_filter)

def filter_by_status_service(db: Session, status: str):
    return repo.filter_by_status(db, status)