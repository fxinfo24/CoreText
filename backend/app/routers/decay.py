from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from typing import List

router = APIRouter(tags=["Preemptive Decay Shield"])

@router.get("/api/decay/{site_id}", response_model=List[schemas.DecayItem])
def get_decay_items(site_id: str, db: Session = Depends(get_db)):
    items = db.query(models.DBDecayItem).filter(models.DBDecayItem.site_id == site_id).all()
    return items

@router.post("/api/decay/shield/{decay_id}")
def deploy_decay_shield(decay_id: str, db: Session = Depends(get_db)):
    item = db.query(models.DBDecayItem).filter(models.DBDecayItem.id == decay_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Decay warning item not found")
        
    site = db.query(models.DBSite).filter(models.DBSite.id == item.site_id).first()
    title = item.title
    db.delete(item)
    
    # Bump site predictive health score to simulate immediate shielding
    if site and site.predictive_health_score < 100:
        site.predictive_health_score = min(100, site.predictive_health_score + 1)
        
    db.commit()
    return {"status": "success", "message": f"Preemptive Shield Activated! Executed flawless refresh brief on '{title}'. Digital Equity Preserved."}
