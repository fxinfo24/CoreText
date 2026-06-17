import React, { useState } from 'react';
import { X, Plus, Globe, Tag, Link2, DollarSign, TrendingUp } from 'lucide-react';

interface AddSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    niche: string;
    url: string;
    asset_value: string;
    monthly_revenue: string;
    revenue_growth: string;
  }) => void;
}

export const AddSuiteModal: React.FC<AddSuiteModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [niche, setNiche] = useState('');
  const [url, setUrl] = useState('');
  const [assetValue, setAssetValue] = useState('$0');
  const [monthlyRevenue, setMonthlyRevenue] = useState('$0');
  const [revenueGrowth, setRevenueGrowth] = useState('+0%');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !niche.trim() || !url.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        niche: niche.trim(),
        url: url.trim(),
        asset_value: assetValue,
        monthly_revenue: monthlyRevenue,
        revenue_growth: revenueGrowth,
      });
      // Reset form
      setName('');
      setNiche('');
      setUrl('');
      setAssetValue('$0');
      setMonthlyRevenue('$0');
      setRevenueGrowth('+0%');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 rounded-3xl shadow-2xl shadow-indigo-500/10 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header Gradient Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

        <div className="p-6 md:p-8">
          {/* Title */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-white">Add Shareholder Suite</h2>
                <p className="text-xs text-slate-400">Onboard a new asset into the compounding engine</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>Suite Name *</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. CryptoVault Intelligence"
                className={inputClass}
                required
                autoFocus
              />
            </div>

            {/* Niche */}
            <div>
              <label className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>Niche / Vertical *</span>
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. Cryptocurrency & DeFi"
                className={inputClass}
                required
              />
            </div>

            {/* URL */}
            <div>
              <label className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                <Link2 className="w-3.5 h-3.5" />
                <span>Website URL *</span>
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://cryptovault.io"
                className={inputClass}
                required
              />
            </div>

            {/* Financial Row */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  <DollarSign className="w-3 h-3" />
                  <span>Asset Value</span>
                </label>
                <input
                  type="text"
                  value={assetValue}
                  onChange={(e) => setAssetValue(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  <DollarSign className="w-3 h-3" />
                  <span>Monthly Rev</span>
                </label>
                <input
                  type="text"
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>Growth</span>
                </label>
                <input
                  type="text"
                  value={revenueGrowth}
                  onChange={(e) => setRevenueGrowth(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !niche.trim() || !url.trim()}
              className="w-full mt-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 hover:from-indigo-500 hover:via-indigo-400 hover:to-violet-400 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Onboarding Suite...' : 'Deploy New Shareholder Suite'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
