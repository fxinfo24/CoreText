from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from typing import List, Dict, Any

router = APIRouter(tags=["Competitive Radar"])

@router.get("/api/competitors/{site_id}")
def get_competitors_and_trends(site_id: str, db: Session = Depends(get_db)):
    comps = db.query(models.DBCompetitor).filter(models.DBCompetitor.site_id == site_id).all()
    trends = db.query(models.DBInterceptedTrend).filter(models.DBInterceptedTrend.site_id == site_id).all()
    
    return {
        "site_id": site_id,
        "competitors": comps,
        "intercepted_trends": trends
    }

@router.post("/api/competitors/intercept/{trend_id}")
def intercept_trend(trend_id: str, db: Session = Depends(get_db)):
    trend = db.query(models.DBInterceptedTrend).filter(models.DBInterceptedTrend.id == trend_id).first()
    if not trend:
        raise HTTPException(status_code=404, detail="Intercepted trend opportunity not found")
        
    topic = trend.topic
    db.delete(trend)
    db.commit()
    
    return {
        "status": "success",
        "message": f"Preemptive Counter-Offensive Deployed! Topic '{topic[:32]}...' successfully dispatched into upcoming live AI writing sprint."
    }
