import React from 'react';
import { Share2, Network, ShieldCheck, Zap } from 'lucide-react';
import * as T from '../../types';

interface HiveTabProps {
  learnings: T.HiveLearning[];
  onTransfer: (id: string) => void;
}

export const HiveTab: React.FC<HiveTabProps> = ({ learnings, onTransfer }) => {
  return (
    <div className="space-y-8 animate-fadeIn text-left">
      
      {/* Summary Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Collective Hive Learning Network</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Privacy-safe institutional cross-pollination. When an interactive or monetization strategy proves victorious on one web property asset, it is autonomously transferred and adapted to all others.
          </p>
        </div>
        <span className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 font-mono flex items-center shadow">
          <ShieldCheck className="w-4 h-4 mr-1.5 text-indigo-400" />
          SHA-256 Multi-Site Compartmentalization
        </span>
      </div>

      {/* Hive Network Insights */}
      <div className="space-y-6">
        {learnings.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-3">
            <Network className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-lg font-extrabold text-slate-100 tracking-tight">All Collective Learnings Perfectly Synchronized</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed font-medium">
              Your entire portfolio of digital properties operates in perfect architectural harmony. All cross-site conversion widgets and voiceover strategies have been fully operationalized across active funnels.
            </p>
          </div>
        ) : (
          learnings.map((h) => (
            <div
              key={h.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col justify-between gap-6 hover:border-indigo-500/40 transition-all"
            >
              
              <div className="space-y-5">
                
                {/* Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <span className="px-3.5 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                    Privacy-Safe Collective Cross-Pollination
                  </span>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-xl border border-emerald-500/20 flex items-center">
                    <Zap className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    Projected Return Lift: {h.projected_lift}
                  </span>
                </div>

                {/* Compare Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                  
                  {/* Origin */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/90 space-y-1.5 shadow-inner">
                    <span className="block font-black text-slate-400 uppercase tracking-wider text-[10px]">
                      Origin Verified Alpha Learning ({h.origin_site})
                    </span>
                    <p className="text-slate-200 leading-relaxed font-medium text-sm">{h.learning_summary}</p>
                  </div>

                  {/* Target */}
                  <div className="bg-slate-950 p-5 rounded-2xl border-2 border-indigo-500/25 space-y-1.5 shadow-inner">
                    <span className="block font-black text-indigo-400 uppercase tracking-wider text-[10px]">
                      Autonomous Adaptation Plan ({h.target_site})
                    </span>
                    <p className="text-indigo-100 leading-relaxed font-bold text-sm">{h.adaptation_plan}</p>
                  </div>

                </div>

              </div>

              {/* Pure CTB Transfer Execution */}
              <button
                onClick={() => onTransfer(h.id)}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center space-x-2.5 transition-all transform hover:-translate-y-0.5"
              >
                <Share2 className="w-5 h-5 text-emerald-100" />
                <span>{h.ctb} Across All Portfolio Sites</span>
              </button>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
