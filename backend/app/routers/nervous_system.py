from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from typing import Dict, Any

router = APIRouter(tags=["Nervous System Stack"])

@router.get("/api/nervous-system/{site_id}")
def get_nervous_system(site_id: str, db: Session = Depends(get_db)):
    l2 = db.query(models.DBLayer2Niche).filter(models.DBLayer2Niche.site_id == site_id).first()
    hf = db.query(models.DBHealthForecast).filter(models.DBHealthForecast.site_id == site_id).first()
    site = db.query(models.DBSite).filter(models.DBSite.id == site_id).first()

    if not l2 or not hf or not site:
        raise HTTPException(status_code=404, detail="Nervous system signals not found")

    return {
        "site_id": site_id,
        "layer2_niche": l2,
        "health_forecast": hf,
        "layer3_memory": site.layer3_memory
    }
