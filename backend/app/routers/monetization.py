from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from typing import List, Dict, Any

router = APIRouter(tags=["Monetization Intelligence"])

@router.get("/api/monetization/{site_id}")
def get_monetization(site_id: str, db: Session = Depends(get_db)):
    attr = db.query(models.DBRevenueAttribution).filter(models.DBRevenueAttribution.site_id == site_id).all()
    recs = db.query(models.DBMonetizationRecommendation).filter(models.DBMonetizationRecommendation.site_id == site_id).all()
    radar = db.query(models.DBMonetizationRadar).filter(models.DBMonetizationRadar.site_id == site_id).all()
    
    return {
        "site_id": site_id,
        "revenue_attribution": attr,
        "recommendations": recs,
        "radar": radar
    }

@router.post("/api/monetization/capture/{rec_id}")
def capture_monetization_gap(rec_id: str, db: Session = Depends(get_db)):
    rec = db.query(models.DBMonetizationRecommendation).filter(models.DBMonetizationRecommendation.id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Monetization recommendation opportunity not found")
        
    site = db.query(models.DBSite).filter(models.DBSite.id == rec.site_id).first()
    
    # Increase monthly revenue stats dynamically
    if site:
        rev_val = int(site.monthly_revenue.replace("$", "").replace(",", "").strip())
        added_val = 1350
        if "149" in rec.recommendation:
            added_val = 3800
        elif "300" in rec.recommendation:
            added_val = 5400
        
        new_rev = rev_val + added_val
        site.monthly_revenue = f"${new_rev:,}"
        
        # Increase asset value dynamically (36x multiple!)
        asset_val = int(site.asset_value.replace("$", "").replace(",", "").strip())
        new_asset = asset_val + (added_val * 36)
        site.asset_value = f"${new_asset:,}"
        
    rec_type = rec.rec_type
    target = rec.target_article
    db.delete(rec)
    db.commit()
    
    return {
        "status": "success", 
        "message": f"Successfully operationalized '{rec_type}' across '{target}'. Yield compounded into top asset valuation."
    }
