import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Sparkles, Rss, CheckCircle2, ShieldAlert } from 'lucide-react';
import * as T from '../../types';

interface GeoTabProps {
  data: {
    site_id: string;
    engine_visibility: T.GeoEngineVisibility;
    baits: T.GeoBait[];
    audits: T.GeoAudit[];
  } | null;
  onDeployBait: (id: string) => void;
  onRunAudit: () => void;
  onResolveDefect: (id: string) => void;
}

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];

export const GeoTab: React.FC<GeoTabProps> = ({ data, onDeployBait, onRunAudit, onResolveDefect }) => {
  if (!data) return <div className="p-8 text-slate-500 animate-pulse font-bold">Loading GEO Studio...</div>;

  const { engine_visibility, baits, audits, site_id } = data;

  // Recharts simulation based on active asset
  let pieData = [
    { name: 'Google Organic / SGE', value: 46 },
    { name: 'ChatGPT Search', value: 30 },
    { name: 'Perplexity Pro', value: 18 },
    { name: 'Claude Artifacts / Other', value: 6 },
  ];

  if (site_id === 'site_biohack') {
    pieData = [
      { name: 'Google Organic / SGE', value: 35 },
      { name: 'ChatGPT Search', value: 38 },
      { name: 'Perplexity Pro', value: 20 },
      { name: 'Claude Artifacts / Other', value: 7 },
    ];
  } else if (site_id === 'site_saas') {
    pieData = [
      { name: 'Google Organic / SGE', value: 25 },
      { name: 'ChatGPT Search', value: 45 },
      { name: 'Perplexity Pro', value: 22 },
      { name: 'Claude Artifacts / Other', value: 8 },
    ];
  }

  return (
    <div className="space-y-8 animate-fadeIn text-left">
      
      {/* Summary Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">GEO Studio: Generative Engine Optimization</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Systematizing the exact structures, XML webhooks, and answer patterns required for prominent institutional citation by ChatGPT, Perplexity, and Claude.
          </p>
        </div>
        <button
          onClick={onRunAudit}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow transition-all transform hover:-translate-y-0.5"
        >
          <span>Verify Live SGE Citability Schemas</span>
        </button>
      </div>

      {/* Discovery Share Overviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recharts Doughnut Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-extrabold text-slate-100 tracking-tight">AI Discovery Ecosystem</h4>
            <p className="text-xs text-slate-400 font-medium">Tracked brand visibility share across frontier search indices.</p>
          </div>
          
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#020617" strokeWidth={3} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 12, color: '#f8fafc', fontSize: 12 }}
                  formatter={(value: any) => [`${value}% Share`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-semibold">
            {pieData.map((entry, idx) => (
              <div key={idx} className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx] }} />
                <span className="text-slate-300 truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* The 3 Core AI Index Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* ChatGPT */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-white text-base tracking-tight">ChatGPT Search</span>
                <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 font-extrabold text-sm font-mono shadow-inner">
                  {engine_visibility.chatgpt.share}
                </span>
              </div>
              <span className="block text-xs font-bold text-slate-300">{engine_visibility.chatgpt.status}</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 font-mono shadow-inner flex-1 flex flex-col justify-between space-y-1">
              <strong className="text-emerald-400 block uppercase tracking-wider text-[10px]">Citation Posture Pattern:</strong>
              <span className="leading-relaxed">{engine_visibility.chatgpt.pattern}</span>
            </div>
          </div>

          {/* Perplexity */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-white text-base tracking-tight">Perplexity Pro</span>
                <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 font-extrabold text-sm font-mono shadow-inner">
                  {engine_visibility.perplexity.share}
                </span>
              </div>
              <span className="block text-xs font-bold text-slate-300">{engine_visibility.perplexity.status}</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 font-mono shadow-inner flex-1 flex flex-col justify-between space-y-1">
              <strong className="text-indigo-400 block uppercase tracking-wider text-[10px]">Citation Posture Pattern:</strong>
              <span className="leading-relaxed">{engine_visibility.perplexity.pattern}</span>
            </div>
          </div>

          {/* Claude */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-white text-base tracking-tight">Claude Artifacts</span>
                <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-extrabold text-sm font-mono shadow-inner">
                  {engine_visibility.claude.share}
                </span>
              </div>
              <span className="block text-xs font-bold text-slate-300">{engine_visibility.claude.status}</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 font-mono shadow-inner flex-1 flex flex-col justify-between space-y-1">
              <strong className="text-amber-400 block uppercase tracking-wider text-[10px]">Citation Posture Pattern:</strong>
              <span className="leading-relaxed">{engine_visibility.claude.pattern}</span>
            </div>
          </div>

        </div>

      </div>

      {/* Section: AI Answer Bait Deployment Suites */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-indigo-500/30 rounded-3xl p-6 shadow-2xl space-y-6">
        <div>
          <h3 className="text-xl font-extrabold text-white tracking-tight">AI Answer Bait Deployment Suites</h3>
          <p className="text-xs text-indigo-200 font-medium">Highly structured, authoritative markdown and JSON-schema pieces designed explicitly to weave into dynamic Webhooks and trigger AI engine citations.</p>
        </div>

        <div className="space-y-4">
          {baits.map((b) => (
            <div
              key={b.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-5 hover:border-indigo-500/50 transition-all"
            >
              <div className="space-y-1.5 flex-1">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black bg-violet-500/10 text-violet-400 border border-violet-500/25 uppercase tracking-wider">
                  Verified Answer Bait Blueprint
                </span>
                <h5 className="text-slate-100 font-extrabold text-base tracking-tight">Target Query: "{b.query_target}"</h5>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  <strong className="text-indigo-300 font-bold">Injected Schema Structure:</strong> {b.bait_structure}
                </p>
                <div className="pt-1">
                  <span className="inline-block text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                    {b.projected_ai_picks}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onDeployBait(b.id)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs px-6 py-4 rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 shrink-0 transition-all transform hover:-translate-y-0.5"
              >
                <Rss className="w-4 h-4 text-emerald-100" />
                <span>Deploy ChatGPT & Perplexity Citation Baits</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Quarterly GEO SGE Defect Remediations */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        <div>
          <h3 className="text-xl font-extrabold text-slate-100 tracking-tight">Quarterly GEO Citation Audits (Remediation Queue)</h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Existing published sitemap URLs flagged for automated SGE structuring.</p>
        </div>

        {audits.length === 0 ? (
          <p className="text-slate-500 text-xs italic p-2 font-semibold">
            All existing published sitemap URLs maintain impeccable GEO citation scores across LLM evaluation metrics. Zero remediation queued.
          </p>
        ) : (
          <div className="space-y-3">
            {audits.map((a) => (
              <div key={a.id} className="bg-slate-950 border border-slate-800/90 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 shadow-inner">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <h6 className="text-slate-100 font-extrabold text-base tracking-tight">{a.article_title}</h6>
                    <span className="px-3 py-1 rounded-lg text-xs font-black bg-amber-500/20 text-amber-300 font-mono">
                      GEO Trust: {a.current_geo_score} / 100
                    </span>
                  </div>
                  <p className="text-xs text-rose-300 font-medium">Defect Warning: {a.defect}</p>
                  <p className="text-xs text-emerald-300 font-bold">Autonomous Remediation Solution: {a.remediation}</p>
                </div>
                <button
                  onClick={() => onResolveDefect(a.id)}
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs px-5 py-3.5 rounded-2xl shadow transition-all transform hover:-translate-y-0.5 shrink-0"
                >
                  <span>{a.ctb_action}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
