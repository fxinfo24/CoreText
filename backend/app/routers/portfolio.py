from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.ai_engine import atomize_brief
from typing import List
import random

router = APIRouter(tags=["Content Opportunity Portfolio"])

@router.get("/api/portfolios/{site_id}", response_model=List[schemas.ContentPortfolio])
def get_portfolios(site_id: str, db: Session = Depends(get_db)):
    items = db.query(models.DBContentPortfolio).filter(models.DBContentPortfolio.site_id == site_id).all()
    return items

@router.post("/api/portfolios/recalculate/{site_id}", response_model=List[schemas.ContentPortfolio])
def recalculate_portfolios(site_id: str, db: Session = Depends(get_db)):
    items = db.query(models.DBContentPortfolio).filter(models.DBContentPortfolio.site_id == site_id).all()
    
    # Give a +3 to +5 point multi-signal lift to simulate live algorithmic re-indexing
    for item in items:
        lift = random.randint(2, 5)
        item.opp_score = min(100, item.opp_score + lift)
        item.demand_score = min(100, item.demand_score + random.randint(1, 3))
        item.monetization_score = min(100, item.monetization_score + random.randint(1, 2))
        
    db.commit()
    return items

class AtomizeRequest(schemas.BaseModel):
    portfolio_id: str

@router.post("/api/portfolios/atomize", response_model=schemas.AtomizationResponse)
def atomize_portfolio(req: AtomizeRequest, db: Session = Depends(get_db)):
    item = db.query(models.DBContentPortfolio).filter(models.DBContentPortfolio.id == req.portfolio_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Content portfolio asset not found")
        
    settings = db.query(models.DBUserSettings).first()
    openai_key = settings.openai_api_key if settings else None
    
    res = atomize_brief(
        core_title=item.title,
        cluster=item.cluster,
        openai_key=openai_key
    )
    return res
