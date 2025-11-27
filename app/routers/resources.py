from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud
from ..database import get_db

router = APIRouter()


@router.post("/", response_model=schemas.ResourceOut)
def create_resource(
    resource_in: schemas.ResourceCreate,
    uploader_id: str = None,
    db: Session = Depends(get_db),
):
    if uploader_id is None:
        raise HTTPException(
            status_code=400, detail="uploader_id (teacher id) required as query param"
        )
    resource = crud.create_resource(db, resource_in, uploader_id)
    return resource


@router.get("/class/{class_id}")
def list_resources_by_class(class_id: str, db: Session = Depends(get_db)):
    resources = crud.get_resources_by_class(db, class_id)
    return resources


@router.delete("/{resource_id}")
def delete_resource(resource_id: str, db: Session = Depends(get_db)):
    success = crud.delete_resource(db, resource_id)
    if not success:
        raise HTTPException(status_code=404, detail="Resource not found")
    return {"message": "Resource deleted successfully"}

