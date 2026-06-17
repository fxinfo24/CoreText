import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { DollarSign, TrendingUp, Sparkles } from 'lucide-react';
import * as T from '../../types';

interface MonetizationTabProps {
  data: {
    site_id: string;
    revenue_attribution: T.RevenueAttribution[];
    recommendations: T.MonetizationRecommendation[];
    radar: T.MonetizationRadar[];
  } | null;
  onCaptureGap: (id: string) => void;
}

// Recharts simulated revenue attribution breakdowns
const REVENUE_BARS = [
  { channel: 'High-Ticket Affiliates', Pacing: 6400 },
  { channel: 'Direct Brand Partnerships', Pacing: 3200 },
  { channel: 'Digital Products / Software', Pacing: 2800 },
  { channel: 'Enterprise Booked Discovery', Pacing: 1850 },
];

export const MonetizationTab: React.FC<MonetizationTabProps> = ({ data, onCaptureGap }) => {
  if (!data) return <div className="p-8 text-slate-500 animate-pulse font-bold">Loading Monetization Intelligence...</div>;

  const { revenue_attribution, recommendations, radar, site_id } = data;

  let barData = REVENUE_BARS;
  if (site_id === 'site_biohack') {
    barData = [
      { channel: 'Recurring Supplements', Pacing: 4100 },
      { channel: 'Direct Brand Partnerships', Pacing: 2400 },
      { channel: 'Paid Fiduciary Newsletter', Pacing: 1900 },
      { channel: 'Deep Sleep Coaching', Pacing: 1420 },
    ];
  } else if (site_id === 'site_saas') {
    barData = [
      { channel: 'Annual B2B Referrals', Pacing: 9500 },
      { channel: 'High-Ticket B2B Leads', Pacing: 5400 },
      { channel: 'Autonomous Workflow JSONs', Pacing: 4200 },
      { channel: 'Implementation Retainers', Pacing: 2300 },
    ];
  }

  return (
    <div className="space-y-8 animate-fadeIn text-left">
      
      {/* Summary Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Monetization Intelligence Layer</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Connecting structural content performance directly to institutional financial run-rates. Actionable partner opportunity discovery guiding topical production.
          </p>
        </div>
        <span className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-mono shadow">
          Prime Conversions Webhook 100% Active
        </span>
      </div>

      {/* Top Overviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recharts Bar Chart Column (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-lg font-extrabold text-slate-100 tracking-tight">Monthly Revenue Pacing by Institutional Funnel</h4>
            <p className="text-xs text-slate-400 font-medium">Breakdown of high-ticket RevShare funnels, partner brand deals, and digital software products.</p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="channel" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 12, color: '#10b981', fontSize: 12, fontWeight: 700 }}
                  formatter={(value: any) => [`$${value.toLocaleString()} /mo`, 'Monthly Pacing Target']}
                />
                <Bar dataKey="Pacing" fill="#10b981" radius={[8, 8, 0, 0]} maxBarSize={56} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Niche Monetization Radar Card (1 Col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5">
          <div>
            <h4 className="text-lg font-extrabold text-slate-100 tracking-tight">Niche Monetization Radar</h4>
            <p className="text-xs text-slate-400 font-medium">New institutional external partner programs detected matching our RevShare posture.</p>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {radar.length === 0 ? (
              <p className="text-slate-500 text-xs italic">No completely new external partner models intercepted today.</p>
            ) : (
              radar.map((r) => (
                <div key={r.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 shadow-inner">
                  <div className="space-y-0.5">
                    <h6 className="text-slate-100 font-extrabold text-sm tracking-tight">{r.program}</h6>
                    <p className="text-xs text-indigo-300 font-medium">{r.update}</p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 text-xs font-bold font-mono shrink-0 shadow-inner">
                    Match: {r.match_score}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Per-Article Revenue Attribution Tables */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-x-auto space-y-5">
        <div>
          <h3 className="text-xl font-extrabold text-slate-100 tracking-tight">Per-Article Revenue Attribution Architecture</h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Identifying exactly which topical pillar posts drive commercial buyer conversions vs plain informational reach.
          </p>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase font-black">
              <th className="py-4 px-4">Pillar Master Asset Title</th>
              <th className="py-4 px-4">Monthly Reach</th>
              <th className="py-4 px-4">Current Monthly Return</th>
              <th className="py-4 px-4">RPM Alpha Multiple</th>
              <th className="py-4 px-4">Verified Audience Intent</th>
              <th className="py-4 px-4">Autonomous Remediation Gap Strategy</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-800/80 font-medium">
            {revenue_attribution.map((a) => (
              <tr key={a.id} className="hover:bg-slate-950/50 transition-colors">
                <td className="py-4 px-4 font-black text-slate-100 tracking-tight">{a.title}</td>
                <td className="py-4 px-4 text-slate-300">{a.visits}</td>
                <td className="py-4 px-4 text-emerald-400 font-black">{a.current_rev}</td>
                <td className="py-4 px-4 font-mono font-bold text-indigo-300">{a.rpm}</td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700/80">
                    {a.intent}
                  </span>
                </td>
                <td className="py-4 px-4 text-xs text-amber-300 font-bold leading-snug">{a.actionable_gap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Active Monetization Recommendation Engine */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-6">
        <div>
          <h3 className="text-xl font-extrabold text-emerald-400 tracking-tight">Active Monetization Recommendation Engine</h3>
          <p className="text-xs text-emerald-200 font-medium mt-0.5">
            Proactively matching high-traffic, unmonetized sitemap funnels with institutional RevShare partner vehicles and pure-margin digital product strategies.
          </p>
        </div>

        <div className="space-y-4">
          {recommendations.length === 0 ? (
            <p className="text-slate-400 text-xs italic font-semibold">
              All identified monetization opportunities have been successfully deployed across active web property funnels.
            </p>
          ) : (
            recommendations.map((r) => (
              <div
                key={r.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-emerald-500/50 transition-all"
              >
                <div className="space-y-2 flex-1">
                  <span className="inline-block px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                    {r.rec_type}
                  </span>
                  <h5 className="text-slate-100 font-extrabold text-lg tracking-tight">{r.target_article}</h5>
                  <p className="text-xs text-slate-400 font-medium">Reach Engine: {r.traffic} | Current Pacing: {r.current_revenue}</p>
                  <p className="text-sm text-slate-200 leading-relaxed font-semibold">
                    <strong className="text-indigo-400 font-black">Strategic Execution Action:</strong> {r.recommendation}
                  </p>
                  <div className="pt-1">
                    <span className="inline-flex items-center text-xs font-black text-teal-300 bg-teal-500/10 px-3.5 py-1 rounded-xl border border-teal-500/20">
                      <TrendingUp className="w-4 h-4 mr-1.5 text-teal-400" />
                      {r.value_creation}
                    </span>
                  </div>
                </div>

                {/* Pure CTB Action Button */}
                <button
                  onClick={() => onCaptureGap(r.id)}
                  className="w-full md:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs px-8 py-4 rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2.5 transition-all transform hover:-translate-y-0.5 shrink-0"
                >
                  <DollarSign className="w-5 h-5 text-emerald-100" />
                  <span className="text-sm">{r.ctb}</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
