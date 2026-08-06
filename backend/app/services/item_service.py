from sqlalchemy.orm import Session
from app.repositories import item_repo as repo
from app.schemas.item_schema import ItemCreate, ItemUpdate

# ========== CREATE ==========
def create_item_service(db: Session, item_data: ItemCreate):
    # Validate rating
    if item_data.rating is not None and (item_data.rating < 1 or item_data.rating > 5):
        raise ValueError("Rating must be between 1 and 5")
    return repo.create_item(db, item_data)

# ========== READ ==========
def get_all_items_service(db: Session):
    return repo.get_all_items(db)

def get_item_service(db: Session, item_id: int):
    return repo.get_item_by_id(db, item_id)

# ========== UPDATE ==========
def update_item_service(db: Session, item_id: int, item_data: ItemUpdate):
    # Validate rating if provided
    if item_data.rating is not None and (item_data.rating < 1 or item_data.rating > 5):
        raise ValueError("Rating must be between 1 and 5")
    return repo.update_item(db, item_id, item_data)

# ========== DELETE ==========
def delete_item_service(db: Session, item_id: int):
    return repo.delete_item(db, item_id)