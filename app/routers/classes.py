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
    c = crud.create_class(db, owner_id, class_in)
    # Add member count and owner info
    member_count = db.query(models.ClassMember).filter(models.ClassMember.class_id == c.id).count()
    return {
        "id": c.id,
        "title": c.title,
        "description": c.description,
        "code": c.code,
        "owner_id": c.owner_id,
        "is_public": c.is_public,
        "created_at": c.created_at,
        "updated_at": c.updated_at,
        "deleted_at": c.deleted_at,
        "owner": {
            "id": c.owner.id if c.owner else None,
            "full_name": c.owner.full_name if c.owner else None,
            "display_name": c.owner.display_name if c.owner else None,
            "email": c.owner.email if c.owner else None,
        } if c.owner else None,
        "member_count": member_count,
    }


@router.get("/owner/{owner_id}")
def list_classes_by_owner(owner_id: str, db: Session = Depends(get_db)):
    classes = crud.get_classes_by_owner(db, owner_id)
    # Add member count and owner info to each class
    result = []
    for c in classes:
        member_count = db.query(models.ClassMember).filter(models.ClassMember.class_id == c.id).count()
        result.append({
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "code": c.code,
            "owner_id": c.owner_id,
            "is_public": c.is_public,
            "created_at": c.created_at,
            "updated_at": c.updated_at,
            "deleted_at": c.deleted_at,
            "owner": {
                "id": c.owner.id if c.owner else None,
                "full_name": c.owner.full_name if c.owner else None,
                "display_name": c.owner.display_name if c.owner else None,
                "email": c.owner.email if c.owner else None,
            } if c.owner else None,
            "member_count": member_count,
        })
    return result


@router.get("/{class_id}")
def get_class(class_id: str, db: Session = Depends(get_db)):
    c = crud.get_class(db, class_id)
    if not c:
        raise HTTPException(status_code=404, detail="Class not found")
    # Load relationships
    member_count = db.query(models.ClassMember).filter(models.ClassMember.class_id == class_id).count()
    return {
        "id": c.id,
        "title": c.title,
        "description": c.description,
        "code": c.code,
        "owner_id": c.owner_id,
        "owner": {
            "id": c.owner.id if c.owner else None,
            "full_name": c.owner.full_name if c.owner else None,
            "display_name": c.owner.display_name if c.owner else None,
            "email": c.owner.email if c.owner else None,
        } if c.owner else None,
        "member_count": member_count,
    }


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


@router.post("/join", response_model=schemas.ClassOut)
def join_class_by_code(payload: schemas.JoinClassByCode, db: Session = Depends(get_db)):
    class_ = crud.join_class_by_code(db, payload.code, payload.user_id)
    if not class_:
        raise HTTPException(status_code=404, detail="Class not found with the provided code")
    # Add member count and owner info
    member_count = db.query(models.ClassMember).filter(models.ClassMember.class_id == class_.id).count()
    return {
        "id": class_.id,
        "title": class_.title,
        "description": class_.description,
        "code": class_.code,
        "owner_id": class_.owner_id,
        "owner": {
            "id": class_.owner.id if class_.owner else None,
            "full_name": class_.owner.full_name if class_.owner else None,
            "display_name": class_.owner.display_name if class_.owner else None,
            "email": class_.owner.email if class_.owner else None,
        } if class_.owner else None,
        "member_count": member_count,
    }


@router.get("/student/{user_id}")
def list_classes_by_student(user_id: str, db: Session = Depends(get_db)):
    classes = crud.get_classes_by_student(db, user_id)
    # Add member count and owner info to each class
    result = []
    for c in classes:
        member_count = db.query(models.ClassMember).filter(models.ClassMember.class_id == c.id).count()
        result.append({
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "code": c.code,
            "owner_id": c.owner_id,
            "is_public": c.is_public,
            "created_at": c.created_at,
            "updated_at": c.updated_at,
            "deleted_at": c.deleted_at,
            "owner": {
                "id": c.owner.id if c.owner else None,
                "full_name": c.owner.full_name if c.owner else None,
                "display_name": c.owner.display_name if c.owner else None,
                "email": c.owner.email if c.owner else None,
            } if c.owner else None,
            "member_count": member_count,
        })
    return result


@router.get("/{class_id}/leaderboard")
def get_class_leaderboard(class_id: str, db: Session = Depends(get_db)):
    leaderboard = crud.get_leaderboard_by_class(db, class_id)
    return leaderboard


@router.get("/{class_id}/members")
def get_class_members(class_id: str, db: Session = Depends(get_db)):
    members = crud.get_class_members(db, class_id)
    return members