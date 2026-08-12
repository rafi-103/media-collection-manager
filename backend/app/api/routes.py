from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.item_schema import ItemCreate, ItemUpdate, ItemResponse
from app.services import item_service as service

router = APIRouter(prefix="/api/items", tags=["Items"])

# CREATE (POST)
@router.post("/", response_model=ItemResponse, status_code=201)
def create_item(item_data: ItemCreate, db: Session = Depends(get_db)):
    return service.create_item_service(db, item_data)

# READ (GET)
@router.get("/", response_model=list[ItemResponse])
def get_all_items(db: Session = Depends(get_db)):
    return service.get_all_items_service(db)

@router.get("/{item_id}", response_model=ItemResponse)
def get_item_by_id(item_id: int, db: Session = Depends(get_db)):
    item = service.get_item_service(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

# UPDATE (PUT)
@router.put("/{item_id}", response_model=ItemResponse)
def update_item(
    item_id: int,
    item_data: ItemUpdate,
    db: Session = Depends(get_db)
):
    try:
        updated = service.update_item_service(db, item_id, item_data)
        if not updated:
            raise HTTPException(status_code=404, detail="Item not found")
        return updated
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# DELETE
@router.delete("/{item_id}", status_code=204)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    deleted = service.delete_item_service(db, item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Item not found")
    return None

# SEARCH
@router.get("/search/", response_model=list[ItemResponse])
def search_items(keyword: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    return service.search_items_service(db, keyword)

# FILTER BY TYPE
@router.get("/filter/type/", response_model=list[ItemResponse])
def filter_by_type(type_filter: str = Query(..., pattern="^(book|movie)$"), db: Session = Depends(get_db)):
    return service.filter_by_type_service(db, type_filter)

# FILTER BY STATUS
@router.get("/filter/status/", response_model=list[ItemResponse])
def filter_by_status(status: str = Query(...), db: Session = Depends(get_db)):
    return service.filter_by_status_service(db, status)

# STATS
@router.get("/stats/")
def get_stats(db: Session = Depends(get_db)):
    all_items = service.get_all_items_service(db)
    total = len(all_items)
    books = len([i for i in all_items if i.type == "book"])
    movies = len([i for i in all_items if i.type == "movie"])
    favorites = len([i for i in all_items if i.is_favorite])
    return {
        "total": total,
        "books": books,
        "movies": movies,
        "favorites": favorites
    }