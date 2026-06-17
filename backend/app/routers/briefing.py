from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(tags=["Morning Briefing"])

@router.get("/api/briefing/{site_id}", response_model=schemas.MorningBriefing)
def get_morning_briefing(site_id: str, db: Session = Depends(get_db)):
    briefing = db.query(models.DBMorningBriefing).filter(models.DBMorningBriefing.site_id == site_id).first()
    if not briefing:
        raise HTTPException(status_code=404, detail="Executive morning briefing not found for this property")
    return briefing
