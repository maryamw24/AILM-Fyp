from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud, models
from ..database import get_db

router = APIRouter()


@router.post("/", response_model=schemas.ClassOut)
def create_class(
    class_in: schemas.ClassCreate, owner_id: str = None, db: Session = Depends(get_db)
):
    if owner_id is None:
        raise HTTPException(
            status_code=400, detail="owner_id required (pass as query param for now)"
        )
    return crud.create_class(db, owner_id, class_in)


@router.get("/owner/{owner_id}")
def list_classes_by_owner(owner_id: str, db: Session = Depends(get_db)):
    classes = crud.get_classes_by_owner(db, owner_id)
    return classes


@router.get("/{class_id}")
def get_class(class_id: str, db: Session = Depends(get_db)):
    c = crud.get_class(db, class_id)
    if not c:
        raise HTTPException(status_code=404, detail="Class not found")
    return c


@router.post("/add-student")
def add_student(payload: schemas.AddStudentToClass, db: Session = Depends(get_db)):
    user = crud.get_user_by_email_or_create(db, payload.user_email)
    if not user:
        raise HTTPException(
            status_code=400,
            detail="This email is not assigned to a user and already exists",
        )
    member = crud.add_student_to_class(db, payload.class_id, user, role="student")
    return {"message": "student added", "member_id": member.id}
