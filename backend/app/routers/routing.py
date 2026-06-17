from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from typing import Dict, List

router = APIRouter(tags=["Decision Routing"])

@router.get("/decisions/{site_id}")
def get_decisions(site_id: str, db: Session = Depends(get_db)):
    items = db.query(models.DBDecisionItem).filter(models.DBDecisionItem.site_id == site_id).all()
    
    decisions = {
        "tier1": [],
        "tier2": [],
        "tier3": [],
        "tier4": []
    }
    
    for item in items:
        if item.tier in decisions:
            decisions[item.tier].append(item)
            
    return decisions

@router.post("/decisions/execute/{decision_id}")
def execute_decision(decision_id: str, db: Session = Depends(get_db)):
    item = db.query(models.DBDecisionItem).filter(models.DBDecisionItem.id == decision_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Decision item not found")
        
    item.status = "Executed Securely & Compounded"
    db.commit()
    return {"status": "success", "message": f"Successfully activated structural blueprint: {item.action}"}
