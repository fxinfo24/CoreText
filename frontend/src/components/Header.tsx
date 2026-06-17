import React from 'react';
import { Brain, TrendingUp, ShieldAlert, Zap, Award, CheckCircle2, Settings, Plus, Trash2 } from 'lucide-react';
import * as T from '../types';

interface HeaderProps {
  sites: T.Site[];
  activeSite: T.Site | null;
  onSelectSite: (siteId: string) => void;
  onOpenSettings: () => void;
  onAddSuite: () => void;
  onDeleteSite: (siteId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ sites, activeSite, onSelectSite, onOpenSettings, onAddSuite, onDeleteSite }) => {
  if (!activeSite) return null;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
      {/* Brand Logo & Title */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Brain className="w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">CoreText</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 uppercase tracking-wider">Executive OS</span>
            </div>
            <span className="block text-xs text-slate-400 font-medium">Shareholder Asset Compounding Suite</span>
          </div>
        </div>
      </div>

      {/* Active Asset Switcher & Real-time Live Executive Stats */}
      <div className="flex flex-wrap items-center gap-3">
        
        {/* Site Dropdown + Add/Delete Buttons */}
        <div className="flex items-center space-x-1.5">
          <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <select
              value={activeSite.id}
              onChange={(e) => onSelectSite(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-100 focus:outline-none pr-2 cursor-pointer"
            >
              {sites.map((site) => (
                <option key={site.id} value={site.id} className="bg-slate-900 text-slate-100 py-2">
                  {site.name} ({site.asset_value})
                </option>
              ))}
            </select>
          </div>

          {/* Add Suite Button */}
          <button
            onClick={onAddSuite}
            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 p-2 rounded-xl border border-emerald-500/25 hover:border-emerald-500/40 transition-all shadow"
            title="Add New Shareholder Suite"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Delete Suite Button */}
          {sites.length > 1 && (
            <button
              onClick={() => {
                if (window.confirm(`Permanently decommission "${activeSite.name}"? This cannot be undone.`)) {
                  onDeleteSite(activeSite.id);
                }
              }}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 p-2 rounded-xl border border-red-500/25 hover:border-red-500/40 transition-all shadow"
              title="Decommission Active Suite"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Executive Quick Bar Dashboard Stats */}
        <div className="hidden xl:flex items-center space-x-6 bg-slate-900/50 border border-slate-800/80 rounded-2xl px-5 py-2 shadow">
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Asset Valuation</span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="text-sm font-extrabold text-emerald-400">{activeSite.asset_value}</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="h-7 w-[1px] bg-slate-800" />
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Monthly Run-Rate</span>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="text-sm font-extrabold text-slate-100">{activeSite.monthly_revenue}</span>
              <span className="text-[10px] font-extrabold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
                {activeSite.revenue_growth}
              </span>
            </div>
          </div>
          <div className="h-7 w-[1px] bg-slate-800" />
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Topical Authority</span>
            <span className="block text-sm font-extrabold text-indigo-300 mt-0.5">
              {activeSite.topical_authority_score} / 100
            </span>
          </div>
          <div className="h-7 w-[1px] bg-slate-800" />
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">GEO Visibility</span>
            <span className="block text-sm font-extrabold text-purple-300 mt-0.5">
              {activeSite.geo_visibility_score} / 100
            </span>
          </div>
          <div className="h-7 w-[1px] bg-slate-800" />
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Predictive Health</span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="text-sm font-extrabold text-emerald-300">
                {activeSite.predictive_health_score} / 100
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white p-2.5 rounded-xl border border-slate-800/80 transition-all shadow flex items-center justify-center"
          title="Shareholder Command Preferences"
        >
          <Settings className="w-5 h-5" />
        </button>

      </div>
    </header>
  );
};
