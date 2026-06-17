import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Calendar, AlertCircle, CheckCircle2, TrendingUp, DollarSign, ArrowUpRight } from 'lucide-react';
import * as T from '../../types';

interface BriefingTabProps {
  briefing: T.MorningBriefing | null;
  onExecuteDecision: (decisionId: string) => void;
  onNavigateTab: (tabId: string) => void;
}

// Recharts data simulation for proactive CoreText vs traditional reactive tool ceiling
const FORECAST_DATA = [
  { name: 'May 1', CoreTextCompounding: 100, ReactiveCeiling: 100 },
  { name: 'May 8', CoreTextCompounding: 104, ReactiveCeiling: 102 },
  { name: 'May 15', CoreTextCompounding: 108, ReactiveCeiling: 98 },
  { name: 'May 22', CoreTextCompounding: 114, ReactiveCeiling: 95 },
  { name: 'May 29', CoreTextCompounding: 119, ReactiveCeiling: 94 },
  { name: 'Jun 5', CoreTextCompounding: 125, ReactiveCeiling: 91 },
  { name: 'Jun 12', CoreTextCompounding: 132, ReactiveCeiling: 89 },
  { name: 'Today (Jun 17)', CoreTextCompounding: 138, ReactiveCeiling: 88 },
  { name: '+7d Est', CoreTextCompounding: 146, ReactiveCeiling: 86 },
  { name: '+14d Est', CoreTextCompounding: 155, ReactiveCeiling: 83 },
  { name: '+21d Est', CoreTextCompounding: 168, ReactiveCeiling: 80 },
  { name: '+30d Alpha', CoreTextCompounding: 184, ReactiveCeiling: 78 },
];

export const BriefingTab: React.FC<BriefingTabProps> = ({ briefing, onExecuteDecision, onNavigateTab }) => {
  if (!briefing) return <div className="p-8 text-slate-500 animate-pulse font-bold">Loading Executive Briefing...</div>;

  return (
    <div className="space-y-8 animate-fadeIn text-left">
      
      {/* Welcome Shareholder Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-violet-950 border border-indigo-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between gap-6">
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 z-10">
          <div>
            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest block mb-1">
              Executive Shareholder Dashboard
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Morning Briefing</h2>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 font-mono shadow">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>{briefing.date}</span>
          </div>
        </div>

        {/* The 3-Sentence Executive Situation Summary */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 md:p-6 z-10 shadow-inner">
          <span className="block text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" />
            Overnight Strategic Synthesis
          </span>
          <p className="text-sm md:text-base text-slate-200 leading-relaxed font-medium">
            {briefing.situation_summary}
          </p>
        </div>

        {/* 30-Day Predictive Radar Warning */}
        <div className="flex items-center space-x-3 text-xs md:text-sm text-indigo-200 bg-indigo-500/10 border border-indigo-500/25 px-5 py-3.5 rounded-2xl z-10">
          <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0" />
          <p>
            <strong className="font-bold text-white">30-Day Leading Forecast:</strong> {briefing.thirty_day_forecast}
          </p>
        </div>
      </div>

      {/* Section: This Week's Strategic Focus Decisions (Proportional Approval Friction) */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-extrabold text-slate-100 tracking-tight">This Week's Strategic Decisions</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Proportional approval friction based on our Decision Significance Matrix.
            </p>
          </div>
          <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-xl border border-emerald-500/20">
            All Routine Tasks Handled Silently Overnight
          </span>
        </div>

        {/* Decisions List */}
        <div className="space-y-3">
          {briefing.strategic_focus.map((item, index) => (
            <div
              key={item.id || index}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl hover:border-indigo-500/50 transition-all"
            >
              <div className="flex items-start space-x-4">
                <span className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/25 mb-2">
                    {item.tier}
                  </span>
                  <h4 className="text-slate-100 font-semibold text-base">{item.decision}</h4>
                  <p className="text-xs text-indigo-300 font-medium mt-1">Projected Outcome: {item.return_est}</p>
                </div>
              </div>
              <button
                onClick={() => onExecuteDecision(item.id)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 shrink-0 transition-all transform hover:-translate-y-0.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-100" />
                <span>Compound Strategic Asset</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Shareholder Asset Compounding Forecast & Run-Rate Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recharts Line Chart Column (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="text-lg font-black text-slate-100 tracking-tight">30-Day Forward Asset Compounding Curve</h4>
              <p className="text-xs text-slate-400 font-medium">Predictive Layer 2 & GEO Alpha vs Traditional Reactive SEO Tools</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
              +38% Target Yield Lift
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={FORECAST_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 12, color: '#f8fafc', fontSize: 12 }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1' }} />
                <Line
                  type="monotone"
                  dataKey="CoreTextCompounding"
                  name="CoreText Asset Compounding (Predictive)"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#8b5cf6' }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="ReactiveCeiling"
                  name="Traditional Reactive Tool Trajectory"
                  stroke="#64748b"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Run-Rate Deep Dive Card (1 Col) */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">
              Financial Run-Rate Engine
            </span>
            <h4 className="text-3xl font-black text-emerald-400 tracking-tight">{briefing.rev_compounded_month}</h4>
            <span className="text-xs text-emerald-300 font-medium">Compounded Profit Pacing This Month</span>
          </div>

          <div className="space-y-3.5 pt-2 border-t border-slate-800 text-xs flex-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Monthly Pacing Target:</span>
              <span className="font-extrabold text-slate-200">{briefing.rev_pacing_target}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">RPM Alpha Multiple:</span>
              <span className="font-extrabold text-indigo-300 font-mono">{briefing.rev_rpm_alpha}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium mb-1.5">Primary Revenue Driver:</span>
              <span className="block font-semibold text-slate-200 bg-slate-950 p-3 rounded-2xl border border-slate-800 shadow-inner">
                {briefing.rev_top_driver}
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('tab_monetization')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs py-3.5 rounded-2xl transition-all shadow-lg flex items-center justify-center space-x-2"
          >
            <span>Explore Active Partner Recommendations</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
