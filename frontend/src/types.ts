export interface UserSettings {
  director_name: string;
  shareholder_posture: string;
  openai_api_key?: string;
  anthropic_api_key?: string;
  auto_execute_tier1: boolean;
  auto_execute_tier2: boolean;
  email_briefing_time: string;
}

export interface Layer3Memory {
  posture: string;
  primary_audience: string;
  tone: string;
  topical_clusters: string[];
  monetization_rules: string[];
}

export interface Site {
  id: string;
  name: string;
  niche: string;
  url: string;
  asset_value: string;
  monthly_revenue: string;
  revenue_growth: string;
  topical_authority_score: number;
  geo_visibility_score: number;
  predictive_health_score: number;
  layer3_memory: Layer3Memory;
}

export interface EmergingTopic {
  cluster: string;
  growth: string;
  window: string;
  comp_level: string;
}

export interface Layer2Niche {
  site_id: string;
  industry_velocity: string;
  algorithm_weather: string;
  geo_ai_highlights: string[];
  emerging_topic_clusters: EmergingTopic[];
}

export interface HealthForecast {
  site_id: string;
  crawl_budget_status: string;
  crawl_budget_text: string;
  ctr_micro_status: string;
  ctr_micro_text: string;
  seasonality_text: string;
  competitor_site: string;
  competitor_text: string;
}

export interface DecisionItem {
  id: string;
  site_id: string;
  tier: string;
  action: string;
  detail: string;
  confidence?: string;
  status: string;
  time?: string;
  impact?: string;
  cost_est?: string;
  return_est?: string;
  strategic_risk?: string;
  discussion_prompt?: string;
}

export interface ContentPortfolio {
  id: string;
  site_id: string;
  title: string;
  cluster: string;
  demand_score: number;
  geo_score: number;
  monetization_score: number;
  comp_gap_score: number;
  authority_fit: number;
  time_to_result: string;
  opp_score: number;
  proj_revenue: string;
  monetization_type: string;
  status: string;
  atomized_channels: string[];
}

export interface EngineStat {
  share: string;
  status: string;
  pattern: string;
}

export interface GeoEngineVisibility {
  site_id: string;
  chatgpt: EngineStat;
  perplexity: EngineStat;
  claude: EngineStat;
}

export interface GeoBait {
  id: string;
  site_id: string;
  query_target: string;
  bait_structure: string;
  projected_ai_picks: string;
  status: string;
}

export interface GeoAudit {
  id: string;
  site_id: string;
  article_title: string;
  current_geo_score: number;
  defect: string;
  remediation: string;
  ctb_action: string;
}

export interface DecayItem {
  id: string;
  site_id: string;
  title: string;
  last_updated: string;
  decay_prob_score: string;
  projected_decay_date: string;
  action_type: string;
  reason: string;
  auto_refresh_brief: string;
  cost_est: string;
}

export interface RevenueAttribution {
  id: string;
  site_id: string;
  title: string;
  visits: string;
  current_rev: string;
  rpm: string;
  intent: string;
  actionable_gap: string;
}

export interface MonetizationRecommendation {
  id: string;
  site_id: string;
  rec_type: string;
  target_article: string;
  traffic: string;
  current_revenue: string;
  recommendation: string;
  value_creation: string;
  ctb: string;
}

export interface MonetizationRadar {
  id: string;
  site_id: string;
  program: string;
  update: string;
  match_score: string;
}

export interface Competitor {
  id: string;
  site_id: string;
  name: string;
  publishing_velocity: string;
  threat_level: string;
  topic_overlap: string;
  open_gap: string;
}

export interface InterceptedTrend {
  id: string;
  site_id: string;
  topic: string;
  source: string;
  urgency: string;
  search_demand_spike: string;
  fast_response_brief: string;
  ctb: string;
}

export interface HiveLearning {
  id: string;
  origin_site: string;
  target_site: string;
  learning_summary: string;
  adaptation_plan: string;
  projected_lift: string;
  ctb: string;
}

export interface StrategicFocusItem {
  id: string;
  decision: string;
  tier: string;
  return_est: string;
}

export interface MorningBriefing {
  site_id: string;
  date: string;
  situation_summary: string;
  strategic_focus: StrategicFocusItem[];
  thirty_day_forecast: string;
  rev_compounded_month: string;
  rev_pacing_target: string;
  rev_rpm_alpha: string;
  rev_top_driver: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface AtomizationResponse {
  core_title: string;
  cluster: string;
  newsletter: string;
  linkedin: string;
  twitter: string;
  youtube: string;
  podcast: string;
}
