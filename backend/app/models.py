from sqlalchemy import Column, Integer, String, Boolean, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class DBUserSettings(Base):
    __tablename__ = "user_settings"
    id = Column(Integer, primary_key=True, index=True)
    director_name = Column(String, default="Alexander Vance")
    shareholder_posture = Column(String, default="Aggressive Compounder")
    openai_api_key = Column(String, default="")
    anthropic_api_key = Column(String, default="")
    auto_execute_tier1 = Column(Boolean, default=True)
    auto_execute_tier2 = Column(Boolean, default=True)
    email_briefing_time = Column(String, default="07:00 AM")

class DBSite(Base):
    __tablename__ = "sites"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    niche = Column(String)
    url = Column(String)
    asset_value = Column(String)
    monthly_revenue = Column(String)
    revenue_growth = Column(String)
    topical_authority_score = Column(Integer)
    geo_visibility_score = Column(Integer)
    predictive_health_score = Column(Integer)
    layer3_memory = Column(JSON)  # Dict

class DBLayer2Niche(Base):
    __tablename__ = "layer2_niche"
    site_id = Column(String, ForeignKey("sites.id"), primary_key=True, index=True)
    industry_velocity = Column(String)
    algorithm_weather = Column(Text)
    geo_ai_highlights = Column(JSON)  # List[str]
    emerging_topic_clusters = Column(JSON)  # List[Dict]

class DBHealthForecast(Base):
    __tablename__ = "health_forecasts"
    site_id = Column(String, ForeignKey("sites.id"), primary_key=True, index=True)
    crawl_budget_status = Column(String)
    crawl_budget_text = Column(Text)
    ctr_micro_status = Column(String)
    ctr_micro_text = Column(Text)
    seasonality_text = Column(Text)
    competitor_site = Column(String)
    competitor_text = Column(Text)

class DBDecisionItem(Base):
    __tablename__ = "decision_items"
    id = Column(String, primary_key=True, index=True)
    site_id = Column(String, ForeignKey("sites.id"), index=True)
    tier = Column(String)  # "tier1", "tier2", "tier3", "tier4"
    action = Column(String)
    detail = Column(Text)
    confidence = Column(String, nullable=True)
    status = Column(String)
    time = Column(String, nullable=True)
    impact = Column(String, nullable=True)
    cost_est = Column(String, nullable=True)
    return_est = Column(String, nullable=True)
    strategic_risk = Column(String, nullable=True)
    discussion_prompt = Column(Text, nullable=True)

class DBContentPortfolio(Base):
    __tablename__ = "content_portfolios"
    id = Column(String, primary_key=True, index=True)
    site_id = Column(String, ForeignKey("sites.id"), index=True)
    title = Column(String)
    cluster = Column(String)
    demand_score = Column(Integer)
    geo_score = Column(Integer)
    monetization_score = Column(Integer)
    comp_gap_score = Column(Integer)
    authority_fit = Column(Integer)
    time_to_result = Column(String)
    opp_score = Column(Integer)
    proj_revenue = Column(String)
    monetization_type = Column(String)
    status = Column(String)
    atomized_channels = Column(JSON)  # List[str]

class DBGeoEngineVisibility(Base):
    __tablename__ = "geo_engine_visibility"
    site_id = Column(String, ForeignKey("sites.id"), primary_key=True, index=True)
    chatgpt = Column(JSON)  # Dict
    perplexity = Column(JSON)  # Dict
    claude = Column(JSON)  # Dict

class DBGeoBait(Base):
    __tablename__ = "geo_baits"
    id = Column(String, primary_key=True, index=True)
    site_id = Column(String, ForeignKey("sites.id"), index=True)
    query_target = Column(Text)
    bait_structure = Column(Text)
    projected_ai_picks = Column(String)
    status = Column(String)

class DBGeoAudit(Base):
    __tablename__ = "geo_audits"
    id = Column(String, primary_key=True, index=True)
    site_id = Column(String, ForeignKey("sites.id"), index=True)
    article_title = Column(String)
    current_geo_score = Column(Integer)
    defect = Column(Text)
    remediation = Column(Text)
    ctb_action = Column(String)

class DBDecayItem(Base):
    __tablename__ = "decay_items"
    id = Column(String, primary_key=True, index=True)
    site_id = Column(String, ForeignKey("sites.id"), index=True)
    title = Column(String)
    last_updated = Column(String)
    decay_prob_score = Column(String)
    projected_decay_date = Column(String)
    action_type = Column(String)
    reason = Column(Text)
    auto_refresh_brief = Column(Text)
    cost_est = Column(String)

class DBRevenueAttribution(Base):
    __tablename__ = "revenue_attributions"
    id = Column(String, primary_key=True, index=True)
    site_id = Column(String, ForeignKey("sites.id"), index=True)
    title = Column(String)
    visits = Column(String)
    current_rev = Column(String)
    rpm = Column(String)
    intent = Column(String)
    actionable_gap = Column(Text)

class DBMonetizationRecommendation(Base):
    __tablename__ = "monetization_recommendations"
    id = Column(String, primary_key=True, index=True)
    site_id = Column(String, ForeignKey("sites.id"), index=True)
    rec_type = Column(String)
    target_article = Column(String)
    traffic = Column(String)
    current_revenue = Column(String)
    recommendation = Column(Text)
    value_creation = Column(String)
    ctb = Column(String)

class DBMonetizationRadar(Base):
    __tablename__ = "monetization_radar"
    id = Column(String, primary_key=True, index=True)
    site_id = Column(String, ForeignKey("sites.id"), index=True)
    program = Column(String)
    update = Column(Text)
    match_score = Column(String)

class DBCompetitor(Base):
    __tablename__ = "competitors"
    id = Column(String, primary_key=True, index=True)
    site_id = Column(String, ForeignKey("sites.id"), index=True)
    name = Column(String)
    publishing_velocity = Column(String)
    threat_level = Column(String)
    topic_overlap = Column(String)
    open_gap = Column(Text)

class DBInterceptedTrend(Base):
    __tablename__ = "intercepted_trends"
    id = Column(String, primary_key=True, index=True)
    site_id = Column(String, ForeignKey("sites.id"), index=True)
    topic = Column(String)
    source = Column(String)
    urgency = Column(String)
    search_demand_spike = Column(String)
    fast_response_brief = Column(Text)
    ctb = Column(String)

class DBHiveLearning(Base):
    __tablename__ = "hive_learnings"
    id = Column(String, primary_key=True, index=True)
    origin_site = Column(String)
    target_site = Column(String)
    learning_summary = Column(Text)
    adaptation_plan = Column(Text)
    projected_lift = Column(String)
    ctb = Column(String)

class DBMorningBriefing(Base):
    __tablename__ = "morning_briefings"
    site_id = Column(String, ForeignKey("sites.id"), primary_key=True, index=True)
    date = Column(String)
    situation_summary = Column(Text)
    strategic_focus = Column(JSON)  # List[Dict]
    thirty_day_forecast = Column(Text)
    rev_compounded_month = Column(String)
    rev_pacing_target = Column(String)
    rev_rpm_alpha = Column(String)
    rev_top_driver = Column(String)

class DBChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(String, primary_key=True, index=True)
    site_id = Column(String, ForeignKey("sites.id"), index=True)
    sender = Column(String)  # "user" or "ai"
    text = Column(Text)
    timestamp = Column(String)
