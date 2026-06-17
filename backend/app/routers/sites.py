from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from typing import List
import re

router = APIRouter(tags=["Sites & Settings"])

@router.get("/sites", response_model=List[schemas.Site])
def get_all_sites(db: Session = Depends(get_db)):
    sites = db.query(models.DBSite).all()
    return sites

@router.get("/sites/{site_id}", response_model=schemas.Site)
def get_site(site_id: str, db: Session = Depends(get_db)):
    site = db.query(models.DBSite).filter(models.DBSite.id == site_id).first()
    if not site:
        raise HTTPException(status_code=404, detail="Shareholder property asset not found")
    return site

@router.post("/sites", response_model=schemas.Site, status_code=201)
def create_site(payload: schemas.SiteCreate, db: Session = Depends(get_db)):
    # Generate a slug-based ID from the name
    slug = re.sub(r'[^a-z0-9]+', '_', payload.name.lower()).strip('_')
    site_id = f"site_{slug}"

    # Prevent duplicates
    existing = db.query(models.DBSite).filter(models.DBSite.id == site_id).first()
    if existing:
        raise HTTPException(status_code=409, detail=f"Suite '{payload.name}' already exists")

    # Default Layer3 memory if not provided
    layer3 = payload.layer3_memory
    if layer3 is None:
        layer3_dict = {
            "posture": f"Expert-level analysis and strategic content for {payload.niche}.",
            "primary_audience": "High-value professionals seeking actionable intelligence.",
            "tone": "Authoritative, data-driven, and conversion-optimized.",
            "topical_clusters": [],
            "monetization_rules": []
        }
    else:
        layer3_dict = layer3.model_dump()

    new_site = models.DBSite(
        id=site_id,
        name=payload.name,
        niche=payload.niche,
        url=payload.url,
        asset_value=payload.asset_value,
        monthly_revenue=payload.monthly_revenue,
        revenue_growth=payload.revenue_growth,
        topical_authority_score=payload.topical_authority_score,
        geo_visibility_score=payload.geo_visibility_score,
        predictive_health_score=payload.predictive_health_score,
        layer3_memory=layer3_dict
    )
    db.add(new_site)

    # Scaffold empty related records so tabs don't crash
    db.add(models.DBLayer2Niche(
        site_id=site_id,
        industry_velocity="Awaiting Analysis",
        algorithm_weather="No data yet — run your first Nervous System scan.",
        geo_ai_highlights=[],
        emerging_topic_clusters=[]
    ))
    db.add(models.DBHealthForecast(
        site_id=site_id,
        crawl_budget_status="Pending",
        crawl_budget_text="Not yet analyzed.",
        ctr_micro_status="Pending",
        ctr_micro_text="Not yet analyzed.",
        seasonality_text="No seasonality data yet.",
        competitor_site="TBD",
        competitor_text="No competitor intelligence yet."
    ))
    db.add(models.DBGeoEngineVisibility(
        site_id=site_id,
        chatgpt={"share": "0%", "status": "Not Tracked", "pattern": "N/A"},
        perplexity={"share": "0%", "status": "Not Tracked", "pattern": "N/A"},
        claude={"share": "0%", "status": "Not Tracked", "pattern": "N/A"}
    ))
    db.add(models.DBMorningBriefing(
        site_id=site_id,
        date="Pending First Briefing",
        situation_summary=f"{payload.name} has been onboarded. Autonomous systems are initializing data collection and competitive intelligence pipelines.",
        strategic_focus=[],
        thirty_day_forecast="Forecasting will begin once 7 days of data have been collected.",
        rev_compounded_month="$0",
        rev_pacing_target=payload.monthly_revenue,
        rev_rpm_alpha="$0",
        rev_top_driver="Awaiting first content deployment"
    ))

    db.commit()
    db.refresh(new_site)
    return new_site

@router.delete("/sites/{site_id}")
def delete_site(site_id: str, db: Session = Depends(get_db)):
    site = db.query(models.DBSite).filter(models.DBSite.id == site_id).first()
    if not site:
        raise HTTPException(status_code=404, detail="Shareholder property asset not found")

    # Cascade delete all related records
    db.query(models.DBLayer2Niche).filter(models.DBLayer2Niche.site_id == site_id).delete()
    db.query(models.DBHealthForecast).filter(models.DBHealthForecast.site_id == site_id).delete()
    db.query(models.DBDecisionItem).filter(models.DBDecisionItem.site_id == site_id).delete()
    db.query(models.DBContentPortfolio).filter(models.DBContentPortfolio.site_id == site_id).delete()
    db.query(models.DBGeoEngineVisibility).filter(models.DBGeoEngineVisibility.site_id == site_id).delete()
    db.query(models.DBGeoBait).filter(models.DBGeoBait.site_id == site_id).delete()
    db.query(models.DBGeoAudit).filter(models.DBGeoAudit.site_id == site_id).delete()
    db.query(models.DBDecayItem).filter(models.DBDecayItem.site_id == site_id).delete()
    db.query(models.DBRevenueAttribution).filter(models.DBRevenueAttribution.site_id == site_id).delete()
    db.query(models.DBMonetizationRecommendation).filter(models.DBMonetizationRecommendation.site_id == site_id).delete()
    db.query(models.DBMonetizationRadar).filter(models.DBMonetizationRadar.site_id == site_id).delete()
    db.query(models.DBCompetitor).filter(models.DBCompetitor.site_id == site_id).delete()
    db.query(models.DBInterceptedTrend).filter(models.DBInterceptedTrend.site_id == site_id).delete()
    db.query(models.DBMorningBriefing).filter(models.DBMorningBriefing.site_id == site_id).delete()
    db.query(models.DBChatMessage).filter(models.DBChatMessage.site_id == site_id).delete()
    db.delete(site)
    db.commit()
    return {"status": "success", "message": f"Suite '{site.name}' permanently decommissioned."}

@router.get("/settings", response_model=schemas.UserSettings)
def get_user_settings(db: Session = Depends(get_db)):
    settings = db.query(models.DBUserSettings).first()
    if not settings:
        return schemas.UserSettings()
    return settings

@router.post("/settings", response_model=schemas.UserSettings)
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
