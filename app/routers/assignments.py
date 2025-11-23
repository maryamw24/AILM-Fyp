from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud
from ..database import get_db

router = APIRouter()


@router.post("/", response_model=schemas.AssignmentOut)
def create_assignment(
    assign_in: schemas.AssignmentCreate,
    created_by: str = None,
    db: Session = Depends(get_db),
):
    if created_by is None:
        raise HTTPException(
            status_code=400, detail="created_by (teacher id) required as query param"
        )
    assignment = crud.create_assignment(db, assign_in, created_by)
    return assignment


@router.post("/{assignment_id}/questions")
def add_question(
    assignment_id: str, q_in: schemas.QuestionCreate, db: Session = Depends(get_db)
):
    q = crud.create_question_with_testcases(db, assignment_id, q_in)
    return q

@router.get("/{class_id}")
def list_assignment_by_class(class_id: str, db: Session = Depends(get_db)):
    assignemnts = crud.get_assignment_by_class(db, class_id)
    return assignemnts
