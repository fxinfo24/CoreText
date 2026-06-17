import React from 'react';
import { RefreshCw, Cpu, Award } from 'lucide-react';
import * as T from '../../types';

interface PortfolioTabProps {
  portfolios: T.ContentPortfolio[];
  onRecalculate: () => void;
  onAtomize: (id: string) => void;
}

export const PortfolioTab: React.FC<PortfolioTabProps> = ({ portfolios, onRecalculate, onAtomize }) => {
  return (
    <div className="space-y-8 animate-fadeIn text-left">
      
      {/* Summary Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Content Opportunity Investment Portfolios</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Prioritized multi-dimensional topic investment assets projected for maximum equity ROI and fully automated multi-channel distribution.
          </p>
        </div>
        <button
          onClick={onRecalculate}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs px-5 py-3 rounded-2xl shadow flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
        >
          <RefreshCw className="w-4 h-4 text-emerald-100" />
          <span>Re-Index Portfolio Opportunity Scores</span>
        </button>
      </div>

      {/* The Content Investment Tables */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase font-black">
              <th className="py-4 px-4">Core Structural Asset Title</th>
              <th className="py-4 px-4 text-center">Opportunity Score</th>
              <th className="py-4 px-4 text-center">Projected Return</th>
              <th className="py-4 px-4">Monetization Engine Moat</th>
              <th className="py-4 px-4">Autonomous Distribution Channels</th>
              <th className="py-4 px-4 text-right">Shareholder Execution Trigger</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-800/80 font-medium">
            {portfolios.map((item) => (
              <tr key={item.id} className="hover:bg-slate-950/50 transition-colors">
                
                {/* Title & Cluster */}
                <td className="py-4 px-4 max-w-xs">
                  <span className="block text-base font-extrabold text-slate-100 mb-1 leading-snug tracking-tight">
                    {item.title}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700/80">
                    {item.cluster}
                  </span>
                </td>

                {/* Score */}
                <td className="py-4 px-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/35 shadow-inner">
                    {item.opp_score} / 100
                  </span>
                </td>

                {/* Revenue */}
                <td className="py-4 px-4 text-center">
                  <span className="text-sm font-black text-emerald-400">{item.proj_revenue}</span>
                </td>

                {/* Monetization */}
                <td className="py-4 px-4">
                  <span className="block text-xs text-slate-200 font-semibold">{item.monetization_type}</span>
                </td>

                {/* Atomized Channels */}
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {item.atomized_channels.map((c, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700/80">
                        {c}
                      </span>
                    ))}
                  </div>
                </td>

                {/* CTB Action Button */}
                <td className="py-4 px-4 text-right">
                  <button
                    onClick={() => onAtomize(item.id)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs px-4 py-3.5 rounded-2xl shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
                  >
                    <Cpu className="w-4 h-4 text-indigo-200 shrink-0" />
                    <span>Reclaim 4 Hours of Channel Atomization</span>
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
