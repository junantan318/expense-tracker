from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas, oauth2
from app.database import get_db

router = APIRouter(
    prefix="/categories",
    tags=["Categories"]
)

@router.post("/", response_model=schemas.CategoryResponse)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    existing_category = db.query(models.Category).filter(models.Category.name == category.name).first()
    if existing_category:
        raise HTTPException(status_code=400, detail="Category already exists")
    
    new_category = models.Category(name=category.name, user_id=current_user.id)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@router.get("/", response_model=list[schemas.CategoryResponse])
def get_categories(db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    categories = db.query(models.Category).filter(models.Category.user_id == current_user.id).all()
    return categories

@router.get("/{category_id}", response_model=schemas.CategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    category = db.query(models.Category).filter(models.Category.id == category_id, models.Category.user_id == current_user.id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.put("/{category_id}", response_model=schemas.CategoryResponse)
def update_category(category_id: int, category: schemas.CategoryCreate, db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    existing_category = db.query(models.Category).filter(models.Category.id == category_id, models.Category.user_id == current_user.id).first()
    if not existing_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    existing_category.name = category.name
    db.commit()
    db.refresh(existing_category)
    return existing_category

@router.delete("/{category_id}", status_code=204)
def delete_category(category_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    existing_category = db.query(models.Category).filter(models.Category.id == category_id, models.Category.user_id == current_user.id).first()
    if not existing_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(existing_category)
    db.commit()
    return None