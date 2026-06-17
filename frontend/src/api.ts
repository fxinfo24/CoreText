import axios from 'axios';
import * as T from './types';

// Use active /api proxy or default fallback
const apiClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSites = async (): Promise<T.Site[]> => {
  const res = await apiClient.get<T.Site[]>('/api/sites');
  return res.data;
};

export const getSite = async (siteId: string): Promise<T.Site> => {
  const res = await apiClient.get<T.Site>(`/api/sites/${siteId}`);
  return res.data;
};

export const getSettings = async (): Promise<T.UserSettings> => {
  const res = await apiClient.get<T.UserSettings>('/api/settings');
  return res.data;
};

export const updateSettings = async (settings: T.UserSettings): Promise<T.UserSettings> => {
  const res = await apiClient.post<T.UserSettings>('/api/settings', settings);
  return res.data;
};

export const getMorningBriefing = async (siteId: string): Promise<T.MorningBriefing> => {
  const res = await apiClient.get<T.MorningBriefing>(`/api/briefing/${siteId}`);
  return res.data;
};

export const getNervousSystem = async (siteId: string): Promise<{
  site_id: string;
  layer2_niche: T.Layer2Niche;
  health_forecast: T.HealthForecast;
  layer3_memory: T.Layer3Memory;
}> => {
  const res = await apiClient.get(`/api/nervous-system/${siteId}`);
  return res.data;
};

export const getDecisions = async (siteId: string): Promise<{
  tier1: T.DecisionItem[];
  tier2: T.DecisionItem[];
  tier3: T.DecisionItem[];
  tier4: T.DecisionItem[];
}> => {
  const res = await apiClient.get(`/api/decisions/${siteId}`);
  return res.data;
};

export const executeDecision = async (decisionId: string): Promise<{ status: string; message: string }> => {
  const res = await apiClient.post(`/api/decisions/execute/${decisionId}`);
  return res.data;
};

export const getPortfolios = async (siteId: string): Promise<T.ContentPortfolio[]> => {
  const res = await apiClient.get<T.ContentPortfolio[]>(`/api/portfolios/${siteId}`);
  return res.data;
};

export const recalculatePortfolios = async (siteId: string): Promise<T.ContentPortfolio[]> => {
  const res = await apiClient.post<T.ContentPortfolio[]>(`/api/portfolios/recalculate/${siteId}`);
  return res.data;
};

export const atomizePortfolio = async (portfolioId: string): Promise<T.AtomizationResponse> => {
  const res = await apiClient.post<T.AtomizationResponse>('/api/portfolios/atomize', { portfolio_id: portfolioId });
  return res.data;
};

export const getGeo = async (siteId: string): Promise<{
  site_id: string;
  engine_visibility: T.GeoEngineVisibility;
  baits: T.GeoBait[];
  audits: T.GeoAudit[];
}> => {
  const res = await apiClient.get(`/api/geo/${siteId}`);
  return res.data;
};

export const runGeoAudit = async (siteId: string): Promise<{ status: string; message: string }> => {
  const res = await apiClient.post(`/api/geo/audit/${siteId}`);
  return res.data;
};

export const fixGeoAudit = async (auditId: string): Promise<{ status: string; message: string }> => {
  const res = await apiClient.post(`/api/geo/fix/${auditId}`);
  return res.data;
};

export const getDecayItems = async (siteId: string): Promise<T.DecayItem[]> => {
  const res = await apiClient.get<T.DecayItem[]>(`/api/decay/${siteId}`);
  return res.data;
};

export const deployDecayShield = async (decayId: string): Promise<{ status: string; message: string }> => {
  const res = await apiClient.post(`/api/decay/shield/${decayId}`);
  return res.data;
};

export const getMonetization = async (siteId: string): Promise<{
  site_id: string;
  revenue_attribution: T.RevenueAttribution[];
  recommendations: T.MonetizationRecommendation[];
  radar: T.MonetizationRadar[];
}> => {
  const res = await apiClient.get(`/api/monetization/${siteId}`);
  return res.data;
};

export const captureMonetizationGap = async (recId: string): Promise<{ status: string; message: string }> => {
  const res = await apiClient.post(`/api/monetization/capture/${recId}`);
  return res.data;
};

export const getCompetitorsAndTrends = async (siteId: string): Promise<{
  site_id: string;
  competitors: T.Competitor[];
  intercepted_trends: T.InterceptedTrend[];
}> => {
  const res = await apiClient.get(`/api/competitors/${siteId}`);
  return res.data;
};

export const interceptTrend = async (trendId: string): Promise<{ status: string; message: string }> => {
  const res = await apiClient.post(`/api/competitors/intercept/${trendId}`);
  return res.data;
};

export const getHiveLearnings = async (): Promise<T.HiveLearning[]> => {
  const res = await apiClient.get<T.HiveLearning[]>('/api/hive');
  return res.data;
};

export const transferHiveStrategy = async (hiveId: string): Promise<{ status: string; message: string }> => {
  const res = await apiClient.post(`/api/hive/transfer/${hiveId}`);
  return res.data;
};

export const getChatHistory = async (siteId: string): Promise<T.ChatMessage[]> => {
  const res = await apiClient.get<T.ChatMessage[]>(`/api/chat/${siteId}`);
  return res.data;
};

export const sendChatMessage = async (siteId: string, message: string): Promise<T.ChatMessage[]> => {
  const res = await apiClient.post<T.ChatMessage[]>('/api/chat', { site_id: siteId, message });
  return res.data;
};

export const createSite = async (payload: {
  name: string;
  niche: string;
  url: string;
  asset_value?: string;
  monthly_revenue?: string;
  revenue_growth?: string;
}): Promise<T.Site> => {
  const res = await apiClient.post<T.Site>('/api/sites', payload);
  return res.data;
};

export const deleteSite = async (siteId: string): Promise<{ status: string; message: string }> => {
  const res = await apiClient.delete(`/api/sites/${siteId}`);
  return res.data;
};
