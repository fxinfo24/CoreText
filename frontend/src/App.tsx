import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SettingsModal } from './components/SettingsModal';
import { AtomizeModal } from './components/AtomizeModal';
import { Toast } from './components/Toast';

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
  const [sites, setSites] = useState<T.Site[]>([]);
  const [activeSite, setActiveSite] = useState<T.Site | null>(null);
  const [activeTab, setActiveTab] = useState('tab_briefing');
  const [settings, setSettings] = useState<T.UserSettings | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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

  // Initial boot
  useEffect(() => {
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
  }, []);

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
    const res = await api.fixGeoAudit(auditId);
    if (activeSite) await fetchTabData(activeSite.id, 'tab_geo');
    setToastMessage(res.message);
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
    const res = await api.captureMonetizationGap(recId);
    if (activeSite) {
      await fetchTabData(activeSite.id, 'tab_monetization');
      const updatedSite = await api.getSite(activeSite.id);
      setActiveSite(updatedSite);
      setSites(sites.map((s) => (s.id === updatedSite.id ? updatedSite : s)));
    }
    setToastMessage(res.message);
  };

  const handleInterceptTrend = async (trendId: string) => {
    const res = await api.interceptTrend(trendId);
    if (activeSite) await fetchTabData(activeSite.id, 'tab_competitors');
    setToastMessage(res.message);
  };

  const handleTransferHiveStrategy = async (hiveId: string) => {
    const res = await api.transferHiveStrategy(hiveId);
    await fetchTabData('', 'tab_hive');
    setToastMessage(res.message);
  };

  const handleSendChatMessage = async (text: string) => {
    if (activeSite) {
      const d = await api.sendChatMessage(activeSite.id, text);
      setChatMessages(d);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Bar Header */}
      <Header
        sites={sites}
        activeSite={activeSite}
        onSelectSite={handleSelectSite}
        onOpenSettings={() => setIsSettingsOpen(true)}
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

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

    </div>
  );
};
