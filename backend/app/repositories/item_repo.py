from sqlalchemy.orm import Session
from app.models.item import Item
from app.schemas.item_schema import ItemCreate, ItemUpdate

# ========== READ ==========
def get_all_items(db: Session):
    return db.query(Item).all()

def get_item_by_id(db: Session, item_id: int):
    return db.query(Item).filter(Item.id == item_id).first()

# ========== CREATE ==========
def create_item(db: Session, item_data: ItemCreate):
    db_item = Item(**item_data.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

# ========== UPDATE ==========
def update_item(db: Session, item_id: int, item_data: ItemUpdate):
    db_item = get_item_by_id(db, item_id)
    if not db_item:
        return None
    
    # Update only the fields that were provided
    for key, value in item_data.model_dump(exclude_unset=True).items():
        setattr(db_item, key, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item

# ========== DELETE ==========
def delete_item(db: Session, item_id: int):
    db_item = get_item_by_id(db, item_id)
    if not db_item:
        return None
    
    db.delete(db_item)
    db.commit()
    return db_item