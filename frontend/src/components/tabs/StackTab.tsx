import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Sparkles, Activity, MousePointer, Calendar, ShieldAlert } from 'lucide-react';
import * as T from '../../types';

interface StackTabProps {
  data: {
    site_id: string;
    layer2_niche: T.Layer2Niche;
    health_forecast: T.HealthForecast;
    layer3_memory: T.Layer3Memory;
  } | null;
  onQueueOpportunity: (cluster: string) => void;
}

// Recharts data simulation for Crawl Velocity vs Target Organic SERP Rankings alpha
const CRAWL_DATA = [
  { week: 'Week -6', CrawlHits: 120, AvgSerpRank: 12 },
  { week: 'Week -5', CrawlHits: 135, AvgSerpRank: 12 },
  { week: 'Week -4', CrawlHits: 142, AvgSerpRank: 11 },
  { week: 'Week -3', CrawlHits: 180, AvgSerpRank: 8 },
  { week: 'Week -2', CrawlHits: 210, AvgSerpRank: 5 },
  { week: 'Week -1', CrawlHits: 260, AvgSerpRank: 3 },
  { week: 'This Week', CrawlHits: 310, AvgSerpRank: 1 },
];

export const StackTab: React.FC<StackTabProps> = ({ data, onQueueOpportunity }) => {
  if (!data) return <div className="p-8 text-slate-500 animate-pulse font-bold">Loading Nervous System Stack...</div>;

  const { layer2_niche, health_forecast, layer3_memory } = data;

  return (
    <div className="space-y-8 animate-fadeIn text-left">
      
      {/* Top Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">The Three-Layer Intelligence Stack</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Synthesizing Universal LLM Knowledge, Live Niche Market Signals, and Site Institutional Memory.
          </p>
        </div>
        <span className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow">
          Layer 2 Live Market Radar Active
        </span>
      </div>

      {/* The 3 Intelligence Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Layer 1: Universal Knowledge */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-sm shadow">
                L1
              </span>
              <h3 className="text-lg font-extrabold text-slate-100 tracking-tight">Universal Intelligence</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Foundational global world knowledge, entity relationships, language syntax, and general conceptual reasoning powered by elite frontier LLMs.
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 text-xs text-slate-400 space-y-2 shadow-inner">
            <div className="flex justify-between"><span className="text-slate-500">Frontier Engines:</span><span className="text-slate-200 font-bold">GPT-4o / Claude 3.5</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Entity Synced:</span><span className="text-emerald-400 font-mono font-bold">100% Active</span></div>
          </div>
        </div>

        {/* Layer 2: Niche Intelligence (The Proprietary Alpha Upgrade) */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900 border-2 border-indigo-500/40 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-black px-3.5 py-1 rounded-bl-2xl uppercase tracking-wider shadow">
            Proprietary Moat
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <span className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-black text-sm shadow">
                L2
              </span>
              <h3 className="text-lg font-extrabold text-white tracking-tight">Niche Intelligence Layer</h3>
            </div>
            <p className="text-xs text-indigo-200 leading-relaxed font-medium">
              Continuous live tracking of emerging keywords, competitor publishing velocity, and shifting algorithm weather parameters <em className="text-indigo-300 font-semibold">specific to your sector</em>.
            </p>
          </div>

          <div className="space-y-2 text-xs flex-1">
            <div className="bg-slate-950/90 p-3.5 rounded-2xl border border-slate-800/90 shadow-inner">
              <span className="text-slate-400 block text-[10px] font-bold">Sector Competitive Velocity:</span>
              <span className="font-extrabold text-rose-400 text-sm">{layer2_niche.industry_velocity}</span>
            </div>
            <div className="bg-slate-950/90 p-3.5 rounded-2xl border border-slate-800/90 shadow-inner">
              <span className="text-slate-400 block text-[10px] font-bold">Algorithm Weather Warning:</span>
              <span className="text-slate-100 font-semibold block mt-1 leading-snug">{layer2_niche.algorithm_weather}</span>
            </div>
          </div>
        </div>

        {/* Layer 3: Site Brain & Memory */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-sm shadow">
                L3
              </span>
              <h3 className="text-lg font-extrabold text-slate-100 tracking-tight">Site Brain & Moat Memory</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Complete institutional memory of your specific property—sitemap URLs, exact tone of voice, editorial posture, and stringent monetization rules.
            </p>
          </div>

          <div className="space-y-2 text-xs flex-1">
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 shadow-inner">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Editorial Posture:</span>
              <span className="text-slate-200 block mt-1 font-semibold">{layer3_memory.posture}</span>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 shadow-inner">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Verified Target Audience:</span>
              <span className="text-slate-200 block mt-1 font-semibold">{layer3_memory.primary_audience}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Layer 2 Deep Dive: Emerging Niche Topic Clusters */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div>
          <h3 className="text-xl font-extrabold text-slate-100 tracking-tight">Layer 2 Market Radar: Emerging Topic Clusters</h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Topics spiking across your industry before your competitors detect them in standard reactive keyword tools.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase font-bold">
                <th className="py-3 px-4">Topic Cluster Opportunity</th>
                <th className="py-3 px-4">3-Day Velocity</th>
                <th className="py-3 px-4">Interception Window</th>
                <th className="py-3 px-4">Competition Level</th>
                <th className="py-3 px-4 text-right">Autonomous Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-800/60 font-medium">
              {layer2_niche.emerging_topic_clusters.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-950/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-100">{t.cluster}</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-black">{t.growth}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                      {t.window}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{t.comp_level}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onQueueOpportunity(t.cluster)}
                      className="bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow ml-auto transition-all transform hover:-translate-y-0.5"
                    >
                      <span>Lock in Window</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section: Predictive Signal Forecast Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Leading Indicators Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-xl font-extrabold text-slate-100 tracking-tight">Predictive Signal Engine</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Forecasting structural algorithm issues 2-4 weeks in advance based on leading indicators.</p>
          </div>

          <div className="space-y-4 text-xs">
            
            {/* Indicator 1: Crawl */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/90 flex items-start space-x-3.5 shadow-inner">
              <Activity className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-100 text-sm">Crawl Budget Consumption</span>
                  <span className="text-emerald-400 font-extrabold font-mono text-xs">{health_forecast.crawl_budget_status}</span>
                </div>
                <p className="text-slate-300 leading-snug">{health_forecast.crawl_budget_text}</p>
              </div>
            </div>

            {/* Indicator 2: CTR */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/90 flex items-start space-x-3.5 shadow-inner">
              <MousePointer className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-100 text-sm">CTR Micro-Changes (Position Forecaster)</span>
                  <span className="text-amber-400 font-extrabold font-mono text-xs">{health_forecast.ctr_micro_status}</span>
                </div>
                <p className="text-slate-300 leading-snug">{health_forecast.ctr_micro_text}</p>
              </div>
            </div>

            {/* Indicator 3: Seasonality */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/90 flex items-start space-x-3.5 shadow-inner">
              <Calendar className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
              <div className="space-y-1 flex-1">
                <span className="font-extrabold text-slate-100 text-sm block">12-Month Seasonality Forward Demand Curve</span>
                <p className="text-slate-300 leading-snug">{health_forecast.seasonality_text}</p>
              </div>
            </div>

            {/* Indicator 4: Threat */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-rose-500/25 flex items-start space-x-3.5 shadow-inner">
              <ShieldAlert className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-rose-300 text-sm">Competitor Velocity Threat</span>
                  <span className="text-rose-400 font-extrabold font-mono text-xs">{health_forecast.competitor_site}</span>
                </div>
                <p className="text-slate-300 leading-snug">{health_forecast.competitor_text}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Crawl Graph */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-lg font-extrabold text-slate-100 tracking-tight">Crawl Velocity vs Rankings Alpha</h4>
            <p className="text-xs text-slate-400 font-medium">Crawl budget consumption precedes SERP #1 moats by exactly 3 weeks.</p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CRAWL_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="week" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" stroke="#10b981" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" reversed stroke="#f43f5e" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 12, color: '#f8fafc', fontSize: 12 }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1' }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="CrawlHits"
                  name="Crawl Frequency (Hits/Day)"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="AvgSerpRank"
                  name="Organic SERP Position (1 is best)"
                  stroke="#f43f5e"
                  strokeDasharray="4 4"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
