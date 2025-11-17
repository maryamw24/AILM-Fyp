from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud
from ..database import get_db

router = APIRouter()


@router.post("/", response_model=schemas.LabOut)
def create_lab(
    lab_in: schemas.LabCreate, created_by: str = None, db: Session = Depends(get_db)
):
    if created_by is None:
        raise HTTPException(
            status_code=400, detail="created_by (teacher id) required as query param"
        )
    lab = crud.create_lab(db, lab_in, created_by)
    return lab
