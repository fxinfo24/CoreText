from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from typing import List

router = APIRouter(tags=["Sites & Settings"])

@router.get("/api/sites", response_model=List[schemas.Site])
def get_all_sites(db: Session = Depends(get_db)):
    sites = db.query(models.DBSite).all()
    return sites

@router.get("/api/sites/{site_id}", response_model=schemas.Site)
def get_site(site_id: str, db: Session = Depends(get_db)):
    site = db.query(models.DBSite).filter(models.DBSite.id == site_id).first()
    if not site:
        raise HTTPException(status_code=404, detail="Shareholder property asset not found")
    return site

@router.get("/api/settings", response_model=schemas.UserSettings)
def get_user_settings(db: Session = Depends(get_db)):
    settings = db.query(models.DBUserSettings).first()
    if not settings:
        return schemas.UserSettings()
    return settings

@router.post("/api/settings", response_model=schemas.UserSettings)
def update_user_settings(new_settings: schemas.UserSettings, db: Session = Depends(get_db)):
    settings = db.query(models.DBUserSettings).first()
    if not settings:
        settings = models.DBUserSettings()
        db.add(settings)
    
    settings.director_name = new_settings.director_name
    settings.shareholder_posture = new_settings.shareholder_posture
    settings.openai_api_key = new_settings.openai_api_key
    settings.anthropic_api_key = new_settings.anthropic_api_key
    settings.auto_execute_tier1 = new_settings.auto_execute_tier1
    settings.auto_execute_tier2 = new_settings.auto_execute_tier2
    settings.email_briefing_time = new_settings.email_briefing_time
    
    db.commit()
    db.refresh(settings)
    return settings
