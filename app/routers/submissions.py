from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud
from ..database import get_db

router = APIRouter()


@router.post("/", response_model=schemas.SubmissionOut)
def create_submission(sub_in: schemas.SubmissionCreate, db: Session = Depends(get_db)):
    s = crud.create_submission(db, sub_in)
    return s


@router.post("/grade")
def grade_submission(grade_req: schemas.GradeRequest, db: Session = Depends(get_db)):
    s = crud.grade_submission(db, grade_req)
    if not s:
        raise HTTPException(status_code=404, detail="Submission not found")
    return {"message": "graded", "submission_id": s.id, "score": s.score}
