import React from 'react';
import { CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';
import * as T from '../../types';

interface RoutingTabProps {
  decisions: {
    tier1: T.DecisionItem[];
    tier2: T.DecisionItem[];
    tier3: T.DecisionItem[];
    tier4: T.DecisionItem[];
  } | null;
  onApproveDecision: (id: string) => void;
  onInitiateDialogue: (promptText: string) => void;
}

export const RoutingTab: React.FC<RoutingTabProps> = ({ decisions, onApproveDecision, onInitiateDialogue }) => {
  if (!decisions) return <div className="p-8 text-slate-500 animate-pulse font-bold">Loading Decision Significance Queue...</div>;

  const { tier1, tier2, tier3, tier4 } = decisions;

  const renderItems = (items: T.DecisionItem[], tierType: string) => {
    if (items.length === 0) {
      return <p className="text-slate-500 text-xs italic p-2">All items in this action tier have been successfully executed and resolved.</p>;
    }

    return items.map((item) => (
      <div
        key={item.id}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-700 transition-all shadow-lg"
      >
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <h5 className="text-slate-100 font-extrabold text-base tracking-tight">{item.action}</h5>
            {item.confidence && (
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono font-bold">
                Conf: {item.confidence}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">{item.detail}</p>
          
          <div className="flex flex-wrap gap-2 pt-1 text-xs">
            {item.return_est && (
              <span className="font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                Return Est: {item.return_est}
              </span>
            )}
            {item.cost_est && (
              <span className="font-medium text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                Cost Profile: {item.cost_est}
              </span>
            )}
            {item.strategic_risk && (
              <span className="font-extrabold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                Risk Profile: {item.strategic_risk}
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0 w-full md:w-auto self-end md:self-center">
          {tierType === 'tier1' || tierType === 'tier2' ? (
            <span className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" />
              {item.status}
            </span>
          ) : tierType === 'tier3' ? (
            <button
              onClick={() => onApproveDecision(item.id)}
              className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs px-6 py-3.5 rounded-2xl shadow flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Deploy Strategic Blueprint</span>
              <ArrowRight className="w-4 h-4 text-indigo-200" />
            </button>
          ) : (
            <button
              onClick={() => onInitiateDialogue(item.discussion_prompt || item.action)}
              className="w-full md:w-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-xs px-6 py-3.5 rounded-2xl shadow flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <MessageSquare className="w-4 h-4 text-amber-200" />
              <span>Initiate Shareholder Dialogue</span>
            </button>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-8 animate-fadeIn text-left">
      
      {/* Top Summary */}
      <div className="border-b border-slate-800 pb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Intelligent Decision Routing System</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Eliminating the uniform approval bottleneck. Operational friction is strictly proportional to decision significance.
          </p>
        </div>
        <span className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase tracking-wider font-mono">
          4-Tier Active Routing Engine
        </span>
      </div>

      {/* Tier 1 */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-3">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
              T1
            </span>
            <h3 className="text-lg font-extrabold text-slate-100 tracking-tight">Tier 1: Fully Autonomous Execution</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Low-Risk, High-Confidence (&gt;99%) — Executed Silently Overnight</span>
        </div>
        <div className="space-y-3">{renderItems(tier1, 'tier1')}</div>
      </div>

      {/* Tier 2 */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-3">
            <span className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs font-mono">
              T2
            </span>
            <h3 className="text-lg font-extrabold text-slate-100 tracking-tight">Tier 2: Notify & Execute</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Medium-Confidence — Executed & Logged in Daily Digest</span>
        </div>
        <div className="space-y-3">{renderItems(tier2, 'tier2')}</div>
      </div>

      {/* Tier 3: Strategic Action */}
      <div className="bg-gradient-to-br from-indigo-950/30 to-slate-900 border-2 border-indigo-500/35 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-500/20 pb-3">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-black text-sm shadow">
              T3
            </span>
            <div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">Tier 3: Recommend & Wait (Strategic Investment)</h3>
              <p className="text-xs text-indigo-200 font-medium">Strategic asset blueprints requiring your one-click Shareholder authorization.</p>
            </div>
          </div>
          <span className="px-3.5 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono animate-pulse">
            Action Ready for Shareholder
          </span>
        </div>
        <div className="space-y-3">{renderItems(tier3, 'tier3')}</div>
      </div>

      {/* Tier 4: High-Stakes Focus */}
      <div className="bg-gradient-to-br from-amber-950/25 to-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shadow">
              T4
            </span>
            <div>
              <h3 className="text-xl font-extrabold text-amber-400 tracking-tight">Tier 4: Discuss & Decide (High-Stakes Decisions)</h3>
              <p className="text-xs text-amber-200/80 font-medium">Major structural pivots or authority directions flagged for co-director conversation.</p>
            </div>
          </div>
        </div>
        <div className="space-y-3">{renderItems(tier4, 'tier4')}</div>
      </div>

    </div>
  );
};
