import axios from 'axios';
import * as T from './types';

// Use active /api proxy or default fallback
const apiClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Auth token handling ----------------------------------------------------
const TOKEN_KEY = 'coretext_token';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Attach the bearer token to every request when present.
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend rejects with 401, the session is invalid — drop the token so
// the app returns to the login screen on the next render.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearToken();
    }
    return Promise.reject(error);
  }
);

export interface LoginResult {
  access_token?: string;
  token_type?: string;
  totp_required?: boolean;
  temp_token?: string;
}

export const login = async (req: T.LoginRequest): Promise<LoginResult> => {
  const res = await apiClient.post<LoginResult>('/api/auth/login', req);
  return res.data;
};

export const verifyTwoFactor = async (tempToken: string, code: string): Promise<LoginResult> => {
  const res = await apiClient.post<LoginResult>('/api/auth/2fa/verify', {
    temp_token: tempToken,
    code,
  });
  return res.data;
};

export interface TwoFactorSetup {
  secret: string;
  otpauth_uri: string;
  issuer: string;
}

export const setupTwoFactor = async (): Promise<TwoFactorSetup> => {
  const res = await apiClient.post<TwoFactorSetup>('/api/auth/2fa/setup');
  return res.data;
};

export const enableTwoFactor = async (code: string): Promise<{ backup_codes: string[] }> => {
  const res = await apiClient.post<{ backup_codes: string[] }>('/api/auth/2fa/enable', { code });
  return res.data;
};

export const regenerateBackupCodes = async (): Promise<{ backup_codes: string[] }> => {
  const res = await apiClient.post<{ backup_codes: string[] }>('/api/auth/2fa/backup-codes');
  return res.data;
};

export const disableTwoFactor = async (): Promise<T.User> => {
  const res = await apiClient.post<T.User>('/api/auth/2fa/disable');
  return res.data;
};

export const register = async (req: {
  email: string;
  password: string;
  full_name?: string;
  role?: string;
  invite_code: string;
}): Promise<T.User> => {
  const res = await apiClient.post<T.User>('/api/auth/register', req);
  return res.data;
};

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/api/auth/logout');
  } catch {
    // stateless: ignore network errors on logout
  }
  clearToken();
};

export const getCurrentUser = async (): Promise<T.User> => {
  const res = await apiClient.get<T.User>('/api/auth/me');
  return res.data;
};

// --- Admin user management --------------------------------------------------
export const listUsers = async (): Promise<T.User[]> => {
  const res = await apiClient.get<T.User[]>('/api/auth/users');
  return res.data;
};

export const createUser = async (req: {
  email: string;
  password: string;
  full_name?: string;
  role?: string;
}): Promise<T.User> => {
  const res = await apiClient.post<T.User>('/api/auth/users', req);
  return res.data;
};

export const updateUser = async (
  userId: string,
  payload: Partial<{ email: string; full_name: string; role: string; password: string; is_active: boolean }>
): Promise<T.User> => {
  const res = await apiClient.put<T.User>(`/api/auth/users/${userId}`, payload);
  return res.data;
};

export const deleteUser = async (userId: string): Promise<void> => {
  await apiClient.delete(`/api/auth/users/${userId}`);
};

export interface InviteCode {
  id: string;
  role: string;
  created_at: string;
  created_by: string;
  used_by: string | null;
  used_at: string | null;
  revoked: boolean;
  revoked_at: string | null;
  code?: string | null;
}

export const createInvites = async (req: { count?: number; role?: string }): Promise<InviteCode[]> => {
  const res = await apiClient.post<InviteCode[]>('/api/auth/invites', req);
  return res.data;
};

export const listInvites = async (): Promise<InviteCode[]> => {
  const res = await apiClient.get<InviteCode[]>('/api/auth/invites');
  return res.data;
};

export const revokeInvite = async (inviteId: string): Promise<void> => {
  await apiClient.delete(`/api/auth/invites/${inviteId}`);
};

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
