from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import schemas, crud
from ..database import get_db

router = APIRouter()


@router.post("/register", response_model=schemas.UserOut)
def register_teacher(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = crud.get_user_by_email(db, user_in.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = crud.create_user(db, user_in, "teacher")
    return user


@router.post("/login", response_model=schemas.UserOut)
def login(user_in: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, user_in.email)
    if not user or not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    if not crud.verify_password(user_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    return user
