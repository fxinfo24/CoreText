import React from 'react';
import { ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';
import * as T from '../../types';

interface DecayTabProps {
  items: T.DecayItem[];
  onDeployShield: (id: string) => void;
}

export const DecayTab: React.FC<DecayTabProps> = ({ items, onDeployShield }) => {
  return (
    <div className="space-y-8 animate-fadeIn text-left">
      
      {/* Summary Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Proactive Content Decay Intelligence</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Detecting content decay exact algorithms 30 days <em className="text-indigo-300 font-semibold">before</em> your rankings dip. Fully autonomous refresh briefs executed overnight.
          </p>
        </div>
        <span className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
          24-Hr Background Shield Active
        </span>
      </div>

      {/* Preemptive Shield List */}
      <div className="space-y-5">
        {items.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-3">
            <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-lg font-extrabold text-slate-100 tracking-tight">Zero Content Decay Projected</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed font-medium">
              Your entire XML sitemap has been successfully scanned against market volatility models. All pillar assets retain maximum organic moats and AI discovery trust.
            </p>
          </div>
        ) : (
          items.map((item) => {
            let badgeStyle = '';
            if (item.action_type === 'Quick Refresh') badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
            else if (item.action_type === 'Full Rebuild') badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/25';
            else badgeStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/25';

            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-slate-700 transition-all"
              >
                <div className="space-y-3 flex-1">
                  
                  {/* Pills */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${badgeStyle}`}>
                      {item.action_type}
                    </span>
                    <span className="text-xs bg-slate-800/90 text-slate-300 px-3 py-1 rounded-xl border border-slate-700 font-medium">
                      Last Refreshed: {item.last_updated}
                    </span>
                    <span className="text-xs bg-rose-500/20 text-rose-300 font-extrabold font-mono px-3 py-1 rounded-xl border border-rose-500/30">
                      Decay Risk Warning: {item.decay_prob_score}
                    </span>
                    <span className="text-xs text-indigo-300 font-bold bg-indigo-500/10 px-3 py-1 rounded-xl border border-indigo-500/20">
                      Projected Onset: {item.projected_decay_date}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-slate-100 font-black text-xl tracking-tight">{item.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    <strong className="text-slate-400 font-bold">Volatility Trigger Warning:</strong> {item.reason}
                  </p>

                  {/* Structured Brief Box */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 text-xs text-indigo-200 font-mono space-y-1 shadow-inner">
                    <strong className="text-indigo-400 block uppercase tracking-wider text-[10px] font-bold">Autonomous Refresh Directive Brief:</strong>
                    <p className="leading-relaxed">{item.auto_refresh_brief}</p>
                  </div>
                </div>

                {/* CTB Action Trigger Button */}
                <div className="shrink-0 w-full md:w-auto">
                  <button
                    onClick={() => onDeployShield(item.id)}
                    className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-xs px-8 py-4 rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2.5 transition-all transform hover:-translate-y-0.5"
                  >
                    <ShieldCheck className="w-5 h-5 text-indigo-200" />
                    <span className="text-sm">Deploy Preemptive Decay Shield</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
