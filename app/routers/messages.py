from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud, models
from ..database import get_db

router = APIRouter()


@router.post("/", response_model=schemas.MessageOut)
def create_message(
    message_in: schemas.MessageCreate,
    sender_id: str = None,
    db: Session = Depends(get_db),
):
    if sender_id is None:
        raise HTTPException(
            status_code=400, detail="sender_id required as query param"
        )
    message = crud.create_message(db, message_in.class_id, sender_id, message_in.content, message_in.message_type or "chat")
    # Load sender info
    sender = db.query(models.User).filter(models.User.id == sender_id).first()
    return {
        "id": message.id,
        "class_id": message.class_id,
        "sender_id": message.sender_id,
        "content": message.content,
        "message_type": message.message_type,
        "created_at": message.created_at,
        "sender": {
            "id": sender.id if sender else None,
            "full_name": sender.full_name if sender else None,
            "display_name": sender.display_name if sender else None,
            "email": sender.email if sender else None,
            "role": sender.role if sender else None,
        } if sender else None,
    }


@router.get("/class/{class_id}")
def list_messages_by_class(class_id: str, db: Session = Depends(get_db)):
    messages = crud.get_messages_by_class(db, class_id)
    # Load sender info for each message
    result = []
    for msg in messages:
        sender = db.query(models.User).filter(models.User.id == msg.sender_id).first()
        result.append({
            "id": msg.id,
            "class_id": msg.class_id,
            "sender_id": msg.sender_id,
            "content": msg.content,
            "message_type": msg.message_type,
            "created_at": msg.created_at,
            "sender": {
                "id": sender.id if sender else None,
                "full_name": sender.full_name if sender else None,
                "display_name": sender.display_name if sender else None,
                "email": sender.email if sender else None,
                "role": sender.role if sender else None,
            } if sender else None,
        })
    return result

