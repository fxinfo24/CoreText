from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.ai_engine import generate_chat_reply
from typing import List
import uuid

router = APIRouter(tags=["Conversational Co-Director AI"])

@router.get("/chat/{site_id}", response_model=List[schemas.ChatMessage])
def get_chat_history(site_id: str, db: Session = Depends(get_db)):
    msgs = db.query(models.DBChatMessage).filter(models.DBChatMessage.site_id == site_id).order_by(models.DBChatMessage.timestamp).all()
    return msgs

@router.post("/chat", response_model=List[schemas.ChatMessage])
def send_chat_message(req: schemas.ChatRequest, db: Session = Depends(get_db)):
    site = db.query(models.DBSite).filter(models.DBSite.id == req.site_id).first()
    site_name = site.name if site else "Your Enterprise Asset"
    
    # Save user message
    user_msg = models.DBChatMessage(
        id=str(uuid.uuid4()),
        site_id=req.site_id,
        sender="user",
        text=req.message,
        timestamp="Just Now"
    )
    db.add(user_msg)
    
    # Generate intelligent reply
    settings = db.query(models.DBUserSettings).first()
    openai_key = settings.openai_api_key if settings else None
    
    reply_html = generate_chat_reply(
        site_name=site_name,
        user_query=req.message,
        openai_key=openai_key
    )
    
    ai_msg = models.DBChatMessage(
        id=str(uuid.uuid4()),
        site_id=req.site_id,
        sender="ai",
        text=reply_html,
        timestamp="Just Now"
    )
    db.add(ai_msg)
    db.commit()
    
    # Return updated stream
    msgs = db.query(models.DBChatMessage).filter(models.DBChatMessage.site_id == req.site_id).order_by(models.DBChatMessage.timestamp).all()
    return msgs
