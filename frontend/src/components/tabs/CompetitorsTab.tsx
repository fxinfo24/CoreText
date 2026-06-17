import React from 'react';
import { Crosshair, Rocket, Flame, Radio } from 'lucide-react';
import * as T from '../../types';

interface CompetitorsTabProps {
  data: {
    site_id: string;
    competitors: T.Competitor[];
    intercepted_trends: T.InterceptedTrend[];
  } | null;
  onDeployAttack: (compName: string) => void;
  onDeployTrend: (id: string) => void;
}

export const CompetitorsTab: React.FC<CompetitorsTabProps> = ({ data, onDeployAttack, onDeployTrend }) => {
  if (!data) return <div className="p-8 text-slate-500 animate-pulse font-bold">Loading Competitive Radar...</div>;

  const { competitors, intercepted_trends } = data;

  return (
    <div className="space-y-8 animate-fadeIn text-left">
      
      {/* Summary Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Continuous Competitive Radar & Trend Interception Loop</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Real-time tracking of competitor content publishing velocity and unaddressed market sector gaps across Reddit, Quora, X, and YouTube Search.
          </p>
        </div>
        <span className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono shadow">
          Scraping Radar Engine 100% Synced
        </span>
      </div>

      {/* Tracked Competitors */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div>
          <h3 className="text-xl font-extrabold text-slate-100 tracking-tight">Tracked Market Sector Competitors</h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Spotting exactly when a competitor's high-performing article is aging or weakening to execute an immediate autonomous attack.
          </p>
        </div>

        <div className="space-y-4">
          {competitors.map((c) => (
            <div
              key={c.id}
              className="bg-slate-950 border border-slate-800/90 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-5 hover:border-slate-700 transition-all shadow-inner"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h5 className="text-slate-100 font-black text-xl tracking-tight">{c.name}</h5>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/15 text-rose-400 border border-rose-500/30">
                    {c.threat_level}
                  </span>
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                    Velocity: {c.publishing_velocity}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  <strong className="text-slate-400 font-bold">Unaddressed Topical Gap:</strong> {c.open_gap}
                </p>
              </div>

              {/* CTB Target Button */}
              <button
                onClick={() => onDeployAttack(c.name)}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-xs px-6 py-4 rounded-2xl shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2 shrink-0 transition-all transform hover:-translate-y-0.5"
              >
                <Crosshair className="w-5 h-5 text-indigo-200" />
                <span className="text-sm">Lock in Preemptive Competitive Moat</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Intercepted Multi-Source Forum Trends */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-extrabold text-slate-100 tracking-tight">Multi-Source Trend Interception (Fast Response Studio)</h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Emerging discussions detected on specific niche forums and social media. Automated Fast Response Briefs ready to deploy within the golden window.
          </p>
        </div>

        <div className="space-y-5">
          {intercepted_trends.length === 0 ? (
            <p className="text-slate-500 text-xs italic p-4 font-semibold">
              All intercepted forum and social sector questions have been successfully operationalized into writing production sprints.
            </p>
          ) : (
            intercepted_trends.map((t) => (
              <div
                key={t.id}
                className="bg-gradient-to-br from-slate-900 to-indigo-950/30 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-5 relative overflow-hidden"
              >
                
                {/* Top Info */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3.5 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center shadow-inner">
                      <Flame className="w-4 h-4 mr-1.5 text-amber-400" />
                      {t.urgency}
                    </span>
                    <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-xl border border-indigo-500/20">
                      Radar Engine Source: {t.source}
                    </span>
                  </div>
                  <span className="text-sm font-black text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-xl border border-emerald-500/20">
                    Demand Lift: {t.search_demand_spike}
                  </span>
                </div>

                {/* Topic */}
                <h4 className="text-slate-100 font-black text-xl tracking-tight leading-snug">{t.topic}</h4>

                {/* Fast Response Brief */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-200 font-mono space-y-1.5 shadow-inner">
                  <strong className="text-indigo-400 font-bold text-sm block">Generated Fast Response Master Brief:</strong>
                  <p className="leading-relaxed">{t.fast_response_brief}</p>
                </div>

                {/* CTB Interception Button */}
                <button
                  onClick={() => onDeployTrend(t.id)}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center space-x-2.5 transition-all transform hover:-translate-y-0.5"
                >
                  <Rocket className="w-5 h-5 text-emerald-100" />
                  <span>{t.ctb}</span>
                </button>

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
