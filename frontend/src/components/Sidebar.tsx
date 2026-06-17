import React from 'react';
import {
  LayoutDashboard,
  Layers,
  GitPullRequest,
  BarChart3,
  Sparkles,
  ShieldCheck,
  DollarSign,
  Crosshair,
  Network,
  MessageSquare,
  Zap,
} from 'lucide-react';

export interface TabItem {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}

const TABS: TabItem[] = [
  { id: 'tab_briefing', label: 'Morning Briefing', sublabel: '5-Min Shareholder Review', icon: <LayoutDashboard className="w-5 h-5 shrink-0" /> },
  { id: 'tab_stack', label: 'Nervous System Stack', sublabel: '3-Layer Brain & Predictions', icon: <Layers className="w-5 h-5 shrink-0" /> },
  { id: 'tab_routing', label: 'Decision Routing', sublabel: 'Tier 1-4 Action Matrix', icon: <GitPullRequest className="w-5 h-5 shrink-0" /> },
  { id: 'tab_portfolio', label: 'Content Portfolio', sublabel: 'Opp Scoring & Atomization', icon: <BarChart3 className="w-5 h-5 shrink-0" /> },
  { id: 'tab_geo', label: 'GEO Studio', sublabel: 'AI Engine Answer Baits', icon: <Sparkles className="w-5 h-5 shrink-0" /> },
  { id: 'tab_decay', label: 'Decay Shield', sublabel: '30-Day Preemptive Refresh', icon: <ShieldCheck className="w-5 h-5 shrink-0" /> },
  { id: 'tab_monetization', label: 'Monetization Engine', sublabel: 'Attribution & Partner Gaps', icon: <DollarSign className="w-5 h-5 shrink-0" /> },
  { id: 'tab_competitors', label: 'Competitive Radar', sublabel: 'Velocity & Trend Interception', icon: <Crosshair className="w-5 h-5 shrink-0" /> },
  { id: 'tab_hive', label: 'Collective Hive', sublabel: 'Cross-Site Learning Network', icon: <Network className="w-5 h-5 shrink-0" /> },
  { id: 'tab_chat', label: 'Conversational Co-Director', sublabel: 'AI Strategic Copilot', icon: <MessageSquare className="w-5 h-5 shrink-0" /> },
];

interface SidebarProps {
  activeTab: string;
  onSwitchTab: (tabId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSwitchTab }) => {
  return (
    <aside className="w-full md:w-72 lg:w-80 shrink-0 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between p-4 space-y-6">
      <nav className="space-y-1.5">
        <span className="block text-[11px] font-black text-slate-500 uppercase tracking-widest px-3 mb-3">
          Shareholder Modules
        </span>

        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSwitchTab(tab.id)}
              className={`w-full flex items-center space-x-3.5 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/25 to-violet-600/10 text-indigo-400 border-r-4 border-indigo-500 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className={isActive ? 'text-indigo-400' : 'text-slate-500'}>{tab.icon}</div>
              <div className="text-left flex-1">
                <span className="block">{tab.label}</span>
                <span className={`text-[10px] block font-medium ${isActive ? 'text-indigo-300' : 'text-slate-500'}`}>
                  {tab.sublabel}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* CTB Psychological Anchor Card */}
      <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 text-left shadow-xl">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-black text-indigo-200 uppercase tracking-wider">Click-to-Benefit (CTB)</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
          CoreText entirely eliminates Calls to Action (CTAs). You do not manage operational tasks. Every interaction strictly compounds your web asset value autonomously.
        </p>
      </div>
    </aside>
  );
};
