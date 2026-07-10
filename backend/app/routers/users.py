from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas, utils
from app.database import get_db

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post("/", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    hash_password = utils.hash_password(user.password)
    new_user = models.User(email=user.email, password=hash_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

