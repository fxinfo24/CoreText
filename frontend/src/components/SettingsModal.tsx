import React, { useState } from 'react';
import { X, Shield, Key, Save } from 'lucide-react';
import * as T from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: T.UserSettings;
  onSave: (newSettings: T.UserSettings) => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [directorName, setDirectorName] = useState(settings.director_name);
  const [posture, setPosture] = useState(settings.shareholder_posture);
  const [openaiKey, setOpenaiKey] = useState(settings.openai_api_key || '');
  const [anthropicKey, setAnthropicKey] = useState(settings.anthropic_api_key || '');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    await onSave({
      ...settings,
      director_name: directorName,
      shareholder_posture: posture,
      openai_api_key: openaiKey,
      anthropic_api_key: anthropicKey,
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden flex flex-col shadow-2xl text-left">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 px-6 py-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-0.5">
              CoreText Authentication & Posture
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">Shareholder Command Preferences</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Shareholder Director Name</label>
            <input
              type="text"
              value={directorName}
              onChange={(e) => setDirectorName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-slate-100 font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Asset Compounding Posture</label>
            <select
              value={posture}
              onChange={(e) => setPosture(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-slate-100 font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="Aggressive Compounder">Aggressive Compounder (Maximize Asset Valuation Alpha)</option>
              <option value="Stable Dividend Fiduciary">Stable Dividend Fiduciary (Maximize Net Monthly Margin)</option>
              <option value="Topical Moat Defender">Topical Moat Defender (Strict Authority Dominance)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-indigo-300 mb-1.5 flex items-center">
              <Key className="w-4 h-4 mr-1.5 text-indigo-400" />
              OpenAI Base API Key (Optional Live Inference)
            </label>
            <input
              type="password"
              placeholder="sk-proj-..."
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            />
            <span className="block text-[10px] text-slate-500 mt-1.5 leading-snug">
              Supplying your key enables real-time dynamic brief generation and active structuring inside your browser.
            </span>
          </div>

          <div>
            <label className="block font-bold text-amber-300 mb-1.5 flex items-center">
              <Key className="w-4 h-4 mr-1.5 text-amber-400" />
              Anthropic Base API Key (Optional Live Inference)
            </label>
            <input
              type="password"
              placeholder="sk-ant-..."
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex justify-end space-x-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Compounding...' : 'Compound Command Preferences'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
