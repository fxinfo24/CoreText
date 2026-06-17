from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class UserSettings(BaseModel):
    director_name: str = "Alexander Vance"
    shareholder_posture: str = "Aggressive Compounder"
    openai_api_key: Optional[str] = ""
    anthropic_api_key: Optional[str] = ""
    auto_execute_tier1: bool = True
    auto_execute_tier2: bool = True
    email_briefing_time: str = "07:00 AM"

class Layer3Memory(BaseModel):
    posture: str
    primary_audience: str
    tone: str
    topical_clusters: List[str]
    monetization_rules: List[str]

class Site(BaseModel):
    id: str
    name: str
    niche: str
    url: str
    asset_value: str
    monthly_revenue: str
    revenue_growth: str
    topical_authority_score: int
    geo_visibility_score: int
    predictive_health_score: int
    layer3_memory: Layer3Memory

class EmergingTopic(BaseModel):
    cluster: str
    growth: str
    window: str
    comp_level: str

class Layer2Niche(BaseModel):
    site_id: str
    industry_velocity: str
    algorithm_weather: str
    geo_ai_highlights: List[str]
    emerging_topic_clusters: List[EmergingTopic]

class HealthForecast(BaseModel):
    site_id: str
    crawl_budget_status: str
    crawl_budget_text: str
    ctr_micro_status: str
    ctr_micro_text: str
    seasonality_text: str
    competitor_site: str
    competitor_text: str

class DecisionItem(BaseModel):
    id: str
    site_id: str
    tier: str  # "tier1", "tier2", "tier3", "tier4"
    action: str
    detail: str
    confidence: Optional[str] = None
    status: str
    time: Optional[str] = None
    impact: Optional[str] = None
    cost_est: Optional[str] = None
    return_est: Optional[str] = None
    strategic_risk: Optional[str] = None
    discussion_prompt: Optional[str] = None

class ContentPortfolio(BaseModel):
    id: str
    site_id: str
    title: str
    cluster: str
    demand_score: int
    geo_score: int
    monetization_score: int
    comp_gap_score: int
    authority_fit: int
    time_to_result: str
    opp_score: int
    proj_revenue: str
    monetization_type: str
    status: str
    atomized_channels: List[str]

class EngineStat(BaseModel):
    share: str
    status: str
    pattern: str

class GeoEngineVisibility(BaseModel):
    site_id: str
    chatgpt: EngineStat
    perplexity: EngineStat
    claude: EngineStat

class GeoBait(BaseModel):
    id: str
    site_id: str
    query_target: str
    bait_structure: str
    projected_ai_picks: str
    status: str

class GeoAudit(BaseModel):
    id: str
    site_id: str
    article_title: str
    current_geo_score: int
    defect: str
    remediation: str
    ctb_action: str

class DecayItem(BaseModel):
    id: str
    site_id: str
    title: str
    last_updated: str
    decay_prob_score: str
    projected_decay_date: str
    action_type: str
    reason: str
    auto_refresh_brief: str
    cost_est: str

class RevenueAttribution(BaseModel):
    id: str
    site_id: str
    title: str
    visits: str
    current_rev: str
    rpm: str
    intent: str
    actionable_gap: str

class MonetizationRecommendation(BaseModel):
    id: str
    site_id: str
    rec_type: str
    target_article: str
    traffic: str
    current_revenue: str
    recommendation: str
    value_creation: str
    ctb: str

class MonetizationRadar(BaseModel):
    id: str
    site_id: str
    program: str
    update: str
    match_score: str

class Competitor(BaseModel):
    id: str
    site_id: str
    name: str
    publishing_velocity: str
    threat_level: str
    topic_overlap: str
    open_gap: str

class InterceptedTrend(BaseModel):
    id: str
    site_id: str
    topic: str
    source: str
    urgency: str
    search_demand_spike: str
    fast_response_brief: str
    ctb: str

class HiveLearning(BaseModel):
    id: str
    origin_site: str
    target_site: str
    learning_summary: str
    adaptation_plan: str
    projected_lift: str
    ctb: str

class StrategicFocusItem(BaseModel):
    id: str
    decision: str
    tier: str
    return_est: str

class MorningBriefing(BaseModel):
    site_id: str
    date: str
    situation_summary: str
    strategic_focus: List[StrategicFocusItem]
    thirty_day_forecast: str
    rev_compounded_month: str
    rev_pacing_target: str
    rev_rpm_alpha: str
    rev_top_driver: str

class ChatMessage(BaseModel):
    id: str
    sender: str  # "user" or "ai"
    text: str
    timestamp: str

class ChatRequest(BaseModel):
    site_id: str
    message: str

class AtomizationResponse(BaseModel):
    core_title: str
    cluster: str
    newsletter: str
    linkedin: str
    twitter: str
    youtube: str
    podcast: str

class GeoAuditResponse(BaseModel):
    status: str
    message: str
