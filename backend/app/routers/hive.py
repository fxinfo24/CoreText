from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from typing import List

router = APIRouter(tags=["Hive Collective Network"])

@router.get("/hive", response_model=List[schemas.HiveLearning])
def get_hive_learnings(db: Session = Depends(get_db)):
    hives = db.query(models.DBHiveLearning).all()
    return hives

@router.post("/hive/transfer/{hive_id}")
def transfer_hive_strategy(hive_id: str, db: Session = Depends(get_db)):
    hive = db.query(models.DBHiveLearning).filter(models.DBHiveLearning.id == hive_id).first()
    if not hive:
        raise HTTPException(status_code=404, detail="Collective learning insight not found")
        
    origin = hive.origin_site
    target = hive.target_site
    db.delete(hive)
    db.commit()
    
    return {
        "status": "success",
        "message": f"Flawless Architecture Sync! Victorious compounding strategy successfully migrated from '{origin}' to '{target}'."
    }
