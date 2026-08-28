import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SettingsModal } from './components/SettingsModal';
import { AtomizeModal } from './components/AtomizeModal';
import { AddSuiteModal } from './components/AddSuiteModal';
import { Toast } from './components/Toast';
import { Login } from './components/Login';
import { Landing } from './components/Landing';
import { UserManagementModal } from './components/UserManagementModal';
import { InvitationsModal } from './components/InvitationsModal';

import { BriefingTab } from './components/tabs/BriefingTab';
import { StackTab } from './components/tabs/StackTab';
import { RoutingTab } from './components/tabs/RoutingTab';
import { PortfolioTab } from './components/tabs/PortfolioTab';
import { GeoTab } from './components/tabs/GeoTab';
import { DecayTab } from './components/tabs/DecayTab';
import { MonetizationTab } from './components/tabs/MonetizationTab';
import { CompetitorsTab } from './components/tabs/CompetitorsTab';
import { HiveTab } from './components/tabs/HiveTab';
import { ChatTab } from './components/tabs/ChatTab';

import * as api from './api';
import * as T from './types';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<T.User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [sites, setSites] = useState<T.Site[]>([]);
  const [activeSite, setActiveSite] = useState<T.Site | null>(null);
  const [activeTab, setActiveTab] = useState('tab_briefing');
  const [settings, setSettings] = useState<T.UserSettings | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddSuiteOpen, setIsAddSuiteOpen] = useState(false);
  const [isUserMgmtOpen, setIsUserMgmtOpen] = useState(false);
  const [isInvitesOpen, setIsInvitesOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tab dynamic data states
  const [briefingData, setBriefingData] = useState<T.MorningBriefing | null>(null);
  const [nervousSystemData, setNervousSystemData] = useState<any>(null);
  const [decisionsData, setDecisionsData] = useState<any>(null);
  const [portfoliosData, setPortfoliosData] = useState<T.ContentPortfolio[]>([]);
  const [geoData, setGeoData] = useState<any>(null);
  const [decayData, setDecayData] = useState<T.DecayItem[]>([]);
  const [monetizationData, setMonetizationData] = useState<any>(null);
  const [competitorsData, setCompetitorsData] = useState<any>(null);
  const [hiveData, setHiveData] = useState<T.HiveLearning[]>([]);
  const [chatMessages, setChatMessages] = useState<T.ChatMessage[]>([]);

  // Atomization modal state
  const [atomizeData, setAtomizeData] = useState<T.AtomizationResponse | null>(null);
  const [isAtomizeOpen, setIsAtomizeOpen] = useState(false);

  // Initial auth check — restore session from stored token if valid.
  useEffect(() => {
    const restore = async () => {
      const token = api.getToken();
      if (!token) {
        setAuthChecked(true);
        return;
      }
      try {
        const user = await api.getCurrentUser();
        setCurrentUser(user);
      } catch {
        api.clearToken();
      } finally {
        setAuthChecked(true);
      }
    };
    restore();
  }, []);

  // Initial boot (only once authenticated)
  useEffect(() => {
    if (!currentUser) return;
    const bootOS = async () => {
      try {
        const loadedSites = await api.getSites();
        const loadedSettings = await api.getSettings();
        setSites(loadedSites);
        setSettings(loadedSettings);
        if (loadedSites.length > 0) {
          const firstSite = loadedSites[0];
          setActiveSite(firstSite);
          await fetchTabData(firstSite.id, 'tab_briefing');
        }
      } catch (err) {
        console.error('Failed to initialize CoreText Executive OS backend:', err);
      }
    };
    bootOS();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleLogin = (user: T.User) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setSites([]);
    setActiveSite(null);
    setSettings(null);
    setShowLogin(false);
  };

  const handleSelectSite = async (siteId: string) => {
    const selected = sites.find((s) => s.id === siteId) || sites[0];
    setActiveSite(selected);
    await fetchTabData(siteId, activeTab);
    setToastMessage(`Switched Shareholder Asset to: ${selected.name}`);
  };

  const handleSwitchTab = async (tabId: string) => {
    setActiveTab(tabId);
    if (activeSite) {
      await fetchTabData(activeSite.id, tabId);
    }
  };

  const fetchTabData = async (siteId: string, tabId: string) => {
    try {
      if (tabId === 'tab_briefing') {
        const d = await api.getMorningBriefing(siteId);
        setBriefingData(d);
      } else if (tabId === 'tab_stack') {
        const d = await api.getNervousSystem(siteId);
        setNervousSystemData(d);
      } else if (tabId === 'tab_routing') {
        const d = await api.getDecisions(siteId);
        setDecisionsData(d);
      } else if (tabId === 'tab_portfolio') {
        const d = await api.getPortfolios(siteId);
        setPortfoliosData(d);
      } else if (tabId === 'tab_geo') {
        const d = await api.getGeo(siteId);
        setGeoData(d);
      } else if (tabId === 'tab_decay') {
        const d = await api.getDecayItems(siteId);
        setDecayData(d);
      } else if (tabId === 'tab_monetization') {
        const d = await api.getMonetization(siteId);
        setMonetizationData(d);
      } else if (tabId === 'tab_competitors') {
        const d = await api.getCompetitorsAndTrends(siteId);
        setCompetitorsData(d);
      } else if (tabId === 'tab_hive') {
        const d = await api.getHiveLearnings();
        setHiveData(d);
      } else if (tabId === 'tab_chat') {
        const d = await api.getChatHistory(siteId);
        setChatMessages(d);
      }
    } catch (err) {
      console.error(`Error fetching data for tab ${tabId}:`, err);
    }
  };

  // UI Action Handlers
  const handleExecuteBriefingDecision = async (decisionId: string) => {
    await api.executeDecision(decisionId);
    if (activeSite) await fetchTabData(activeSite.id, 'tab_briefing');
    setToastMessage('Autonomous Compounding Blueprint Deployed Flawlessly!');
  };

  const handleApproveRoutingDecision = async (decisionId: string) => {
    await api.executeDecision(decisionId);
    if (activeSite) await fetchTabData(activeSite.id, 'tab_routing');
    setToastMessage('Strategic Decision Authorized and Activated into Sitemap Webhooks!');
  };

  const handleInitiateDialogue = async (promptText: string) => {
    setActiveTab('tab_chat');
    if (activeSite) {
      const d = await api.sendChatMessage(activeSite.id, promptText);
      setChatMessages(d);
    }
  };

  const handleRecalculatePortfolios = async () => {
    if (activeSite) {
      const d = await api.recalculatePortfolios(activeSite.id);
      setPortfoliosData(d);
      setToastMessage('Portfolio Opportunity Scores Successfully Re-indexed with Yield Alpha Lift!');
    }
  };

  const handleTriggerAtomization = async (portfolioId: string) => {
    try {
      const d = await api.atomizePortfolio(portfolioId);
      setAtomizeData(d);
      setIsAtomizeOpen(true);
    } catch (err) {
      console.error('Failed to execute atomization studio:', err);
      setToastMessage('Error triggering atomization studio.');
    }
  };

  const handleDeployAtomizedSuite = () => {
    setIsAtomizeOpen(false);
    setToastMessage('Spectacular Success! 6 Content Atoms Auto-distributed across all distributions Webhooks.');
  };

  const handleRunGeoAudit = async () => {
    if (activeSite) {
      const res = await api.runGeoAudit(activeSite.id);
      setToastMessage(res.message);
    }
  };

  const handleResolveGeoDefect = async (auditId: string) => {
    try {
      const res = await api.fixGeoAudit(auditId);
      if (activeSite) await fetchTabData(activeSite.id, 'tab_geo');
      setToastMessage(res.message || 'GEO defect resolved.');
    } catch (err: any) {
      const detail = err?.response?.data?.detail || 'Failed to resolve GEO defect.';
      setToastMessage(detail);
    }
  };

  const handleDeployDecayShield = async (decayId: string) => {
    const res = await api.deployDecayShield(decayId);
    if (activeSite) {
      await fetchTabData(activeSite.id, 'tab_decay');
      // Refresh top stats
      const updatedSite = await api.getSite(activeSite.id);
      setActiveSite(updatedSite);
      setSites(sites.map((s) => (s.id === updatedSite.id ? updatedSite : s)));
    }
    setToastMessage(res.message);
  };

  const handleCaptureMonetizationGap = async (recId: string) => {
    try {
      const res = await api.captureMonetizationGap(recId);
      if (activeSite) {
        await fetchTabData(activeSite.id, 'tab_monetization');
        const updatedSite = await api.getSite(activeSite.id);
        setActiveSite(updatedSite);
        setSites(sites.map((s) => (s.id === updatedSite.id ? updatedSite : s)));
      }
      setToastMessage(res.message || 'Monetization gap successfully captured and compounded!');
    } catch (err: any) {
      const detail = err?.response?.data?.detail || 'Failed to capture monetization gap.';
      setToastMessage(detail);
    }
  };

  const handleInterceptTrend = async (trendId: string) => {
    try {
      const res = await api.interceptTrend(trendId);
      if (activeSite) await fetchTabData(activeSite.id, 'tab_competitors');
      setToastMessage(res.message || 'Trend intercepted and queued for compounding.');
    } catch (err: any) {
      const detail = err?.response?.data?.detail || 'Failed to intercept trend.';
      setToastMessage(detail);
    }
  };

  const handleTransferHiveStrategy = async (hiveId: string) => {
    try {
      const res = await api.transferHiveStrategy(hiveId);
      await fetchTabData('', 'tab_hive');
      setToastMessage(res.message || 'Hive strategy transferred across portfolio.');
    } catch (err: any) {
      const detail = err?.response?.data?.detail || 'Failed to transfer hive strategy.';
      setToastMessage(detail);
    }
  };

  const handleSendChatMessage = async (text: string) => {
    if (activeSite) {
      const d = await api.sendChatMessage(activeSite.id, text);
      setChatMessages(d);
    }
  };

  const handleAddSuite = async (data: {
    name: string;
    niche: string;
    url: string;
    asset_value: string;
    monthly_revenue: string;
    revenue_growth: string;
  }) => {
    try {
      const newSite = await api.createSite(data);
      const updatedSites = [...sites, newSite];
      setSites(updatedSites);
      setActiveSite(newSite);
      await fetchTabData(newSite.id, 'tab_briefing');
      setActiveTab('tab_briefing');
      setIsAddSuiteOpen(false);
      setToastMessage(`Shareholder Suite "${newSite.name}" deployed and compounding!`);
    } catch (err: any) {
      const detail = err?.response?.data?.detail || 'Failed to create suite.';
      setToastMessage(detail);
    }
  };

  const handleDeleteSite = async (siteId: string) => {
    try {
      const res = await api.deleteSite(siteId);
      const remaining = sites.filter((s) => s.id !== siteId);
      setSites(remaining);
      if (remaining.length > 0) {
        setActiveSite(remaining[0]);
        await fetchTabData(remaining[0].id, activeTab);
      } else {
        setActiveSite(null);
      }
      setToastMessage(res.message);
    } catch (err) {
      setToastMessage('Failed to decommission suite.');
    }
  };

  return (
    <>
      {!authChecked ? (
        <div className="min-h-screen flex items-center justify-center bg-[#020617] text-slate-500 text-sm">
          Initializing secure session…
        </div>
      ) : !currentUser ? (
        showLogin ? (
          <Login onAuthenticated={handleLogin} />
        ) : (
          <Landing onEnterApp={() => setShowLogin(true)} />
        )
      ) : (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Bar Header */}
      <Header
        sites={sites}
        activeSite={activeSite}
        onSelectSite={handleSelectSite}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onAddSuite={() => setIsAddSuiteOpen(true)}
        onDeleteSite={handleDeleteSite}
        onOpenUserMgmt={() => setIsUserMgmtOpen(true)}
        onOpenInvites={() => setIsInvitesOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main OS Layout */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* Navigation Sidebar */}
        <Sidebar activeTab={activeTab} onSwitchTab={handleSwitchTab} />

        {/* Dynamic Tab Panel Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl">
          
          {activeTab === 'tab_briefing' && (
            <BriefingTab
              briefing={briefingData}
              onExecuteDecision={handleExecuteBriefingDecision}
              onNavigateTab={(tabId) => handleSwitchTab(tabId)}
            />
          )}

          {activeTab === 'tab_stack' && (
            <StackTab
              data={nervousSystemData}
              onQueueOpportunity={(cluster) => setToastMessage(`Locked in Window! Queued topic investment portfolio for "${cluster}".`)}
            />
          )}

          {activeTab === 'tab_routing' && (
            <RoutingTab
              decisions={decisionsData}
              onApproveDecision={handleApproveRoutingDecision}
              onInitiateDialogue={handleInitiateDialogue}
            />
          )}

          {activeTab === 'tab_portfolio' && (
            <PortfolioTab
              portfolios={portfoliosData}
              onRecalculate={handleRecalculatePortfolios}
              onAtomize={handleTriggerAtomization}
            />
          )}

          {activeTab === 'tab_geo' && (
            <GeoTab
              data={geoData}
              onDeployBait={(id) => setToastMessage('Flawless Success! Highly structured Answer Bait woven into dynamic sitemap Webhooks.')}
              onRunAudit={handleRunGeoAudit}
              onResolveDefect={handleResolveGeoDefect}
            />
          )}

          {activeTab === 'tab_decay' && (
            <DecayTab items={decayData} onDeployShield={handleDeployDecayShield} />
          )}

          {activeTab === 'tab_monetization' && (
            <MonetizationTab data={monetizationData} onCaptureGap={handleCaptureMonetizationGap} />
          )}

          {activeTab === 'tab_competitors' && (
            <CompetitorsTab
              data={competitorsData}
              onDeployAttack={(compName) => setToastMessage(`Preemptive Competitive Offensive Queued! Autonomous writing team dispatched against "${compName}".`)}
              onDeployTrend={handleInterceptTrend}
            />
          )}

          {activeTab === 'tab_hive' && (
            <HiveTab learnings={hiveData} onTransfer={handleTransferHiveStrategy} />
          )}

          {activeTab === 'tab_chat' && (
            <ChatTab
              messages={chatMessages}
              onSendMessage={handleSendChatMessage}
              activeSite={activeSite}
            />
          )}

        </main>

      </div>

      {/* Modals & Toasts */}
      {settings && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onSave={async (newSettings) => {
            const updated = await api.updateSettings(newSettings);
            setSettings(updated);
            setToastMessage('Shareholder Command Preferences Successfully Compounded!');
          }}
        />
      )}

      <AtomizeModal
        isOpen={isAtomizeOpen}
        onClose={() => setIsAtomizeOpen(false)}
        data={atomizeData}
        onDeploy={handleDeployAtomizedSuite}
      />

      <AddSuiteModal
        isOpen={isAddSuiteOpen}
        onClose={() => setIsAddSuiteOpen(false)}
        onSubmit={handleAddSuite}
      />

      <UserManagementModal
        isOpen={isUserMgmtOpen}
        onClose={() => setIsUserMgmtOpen(false)}
        currentUser={currentUser}
      />

      <InvitationsModal
        isOpen={isInvitesOpen}
        onClose={() => setIsInvitesOpen(false)}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

    </div>
      )}
    </>
  );
};
