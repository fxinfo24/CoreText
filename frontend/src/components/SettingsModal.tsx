import React, { useState } from 'react';
import { X, Shield, Key, Save } from 'lucide-react';
import * as T from '../types';
import * as api from '../api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: T.UserSettings;
  currentUser: T.User | null;
  onSave: (newSettings: T.UserSettings) => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, currentUser, onSave }) => {
  const [directorName, setDirectorName] = useState(settings.director_name);
  const [posture, setPosture] = useState(settings.shareholder_posture);
  const [openaiKey, setOpenaiKey] = useState(settings.openai_api_key || '');
  const [anthropicKey, setAnthropicKey] = useState(settings.anthropic_api_key || '');
  const [openrouterKey, setOpenrouterKey] = useState(settings.openrouter_api_key || '');
  const [llmModel, setLlmModel] = useState(settings.llm_model || 'openai/gpt-4o-mini');
  const [saving, setSaving] = useState(false);

  // --- 2FA (TOTP) state ---
  const [tfaBusy, setTfaBusy] = useState(false);
  const [tfaError, setTfaError] = useState<string | null>(null);
  const [tfaSetup, setTfaSetup] = useState<{ secret: string; otpauth_uri: string; issuer: string } | null>(null);
  const [tfaCode, setTfaCode] = useState('');
  // One-time backup / recovery codes, shown EXACTLY ONCE by the backend.
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [codesCopied, setCodesCopied] = useState(false);

  const totpEnabled = !!currentUser?.totp_enabled;

  const startSetup = async () => {
    setTfaError(null);
    setTfaBusy(true);
    try {
      const s = await api.setupTwoFactor();
      setTfaSetup(s);
    } catch (e: any) {
      setTfaError(e?.response?.data?.detail || 'Failed to start 2FA setup');
    } finally {
      setTfaBusy(false);
    }
  };

  const confirmEnable = async () => {
    setTfaError(null);
    setTfaBusy(true);
    try {
      const res = await api.enableTwoFactor(tfaCode);
      setTfaSetup(null);
      setTfaCode('');
      // The backend returns the one-time recovery codes ONLY here — show them
      // once so the owner can save them before the page refreshes.
      setBackupCodes(res.backup_codes || []);
      setCodesCopied(false);
    } catch (e: any) {
      setTfaError(e?.response?.data?.detail || 'Invalid code');
    } finally {
      setTfaBusy(false);
    }
  };

  const regenBackupCodes = async () => {
    setTfaError(null);
    setTfaBusy(true);
    try {
      const res = await api.regenerateBackupCodes();
      setBackupCodes(res.backup_codes || []);
      setCodesCopied(false);
    } catch (e: any) {
      setTfaError(e?.response?.data?.detail || 'Failed to regenerate backup codes');
    } finally {
      setTfaBusy(false);
    }
  };

  const copyBackupCodes = async () => {
    if (!backupCodes) return;
    try {
      await navigator.clipboard.writeText(backupCodes.join('\n'));
      setCodesCopied(true);
    } catch {
      setCodesCopied(false);
    }
  };

  const ackBackupCodes = () => {
    // Codes are saved by the owner; refresh so the UI reflects the enabled state.
    setBackupCodes(null);
    setCodesCopied(false);
    window.location.reload();
  };

  const disable2FA = async () => {
    setTfaError(null);
    setTfaBusy(true);
    try {
      await api.disableTwoFactor();
      setBackupCodes(null);
      setCodesCopied(false);
      window.location.reload();
    } catch (e: any) {
      setTfaError(e?.response?.data?.detail || 'Failed to disable 2FA');
    } finally {
      setTfaBusy(false);
    }
  };

  // Popular OpenRouter model slugs (https://openrouter.ai/models). The field
  // also accepts any custom slug typed by the owner.
  const MODEL_OPTIONS = [
    'openai/gpt-4o-mini',
    'openai/gpt-4o',
    'anthropic/claude-3.5-haiku',
    'anthropic/claude-3.5-sonnet',
    'google/gemini-flash-1.5',
    'meta-llama/llama-3.1-70b-instruct',
    'mistralai/mistral-large',
    'deepseek/deepseek-chat',
  ];

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    await onSave({
      ...settings,
      director_name: directorName,
      shareholder_posture: posture,
      openai_api_key: openaiKey,
      anthropic_api_key: anthropicKey,
      openrouter_api_key: openrouterKey,
      llm_model: llmModel,
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

          <div className="pt-2 border-t border-slate-800">
            <label className="block font-bold text-emerald-300 mb-1.5 flex items-center">
              <Key className="w-4 h-4 mr-1.5 text-emerald-400" />
              OpenRouter API Key (Preferred)
            </label>
            <input
              type="password"
              placeholder="sk-or-..."
              value={openrouterKey}
              onChange={(e) => setOpenrouterKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
            />
            <span className="block text-[10px] text-slate-500 mt-1.5 leading-snug">
              OpenRouter routes to 100+ models with one key. If set, it is used for live chat & content atomization.
            </span>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Active LLM Model</label>
            <input
              list="coretext-model-list"
              value={llmModel}
              onChange={(e) => setLlmModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
              placeholder="openai/gpt-4o-mini"
            />
            <datalist id="coretext-model-list">
              {MODEL_OPTIONS.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
            <span className="block text-[10px] text-slate-500 mt-1.5 leading-snug">
              Used when an OpenRouter key is set. Pick a preset or type any OpenRouter model slug.
            </span>
          </div>

          {/* --- Two-Factor Authentication (TOTP) --- */}
          <div className="pt-4 border-t border-slate-800">
            <label className="block font-bold text-emerald-300 mb-1.5 flex items-center">
              <Shield className="w-4 h-4 mr-1.5 text-emerald-400" />
              Two-Factor Authentication (Authenticator App)
            </label>
            {tfaError && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300 mb-2">
                {tfaError}
              </div>
            )}
            {backupCodes && backupCodes.length > 0 ? (
              <div className="bg-slate-950 border border-amber-600/50 rounded-2xl p-4 space-y-3">
                <p className="text-[11px] text-amber-200 font-semibold">
                  ⚠ SAVE THESE RECOVERY CODES NOW — they are shown only once.
                  If you lose your authenticator app, one of these codes is the only way back in.
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {backupCodes.map((c) => (
                    <code key={c} className="text-[11px] font-mono text-amber-100 bg-slate-900 rounded-lg px-2 py-1.5">
                      {c}
                    </code>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={copyBackupCodes}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2 rounded-xl"
                  >
                    {codesCopied ? '✓ Copied' : 'Copy all'}
                  </button>
                  <button
                    onClick={ackBackupCodes}
                    className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs py-2 rounded-xl"
                  >
                    I saved them — done
                  </button>
                </div>
              </div>
            ) : totpEnabled ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-slate-950 border border-emerald-800/60 rounded-2xl px-4 py-3">
                  <span className="text-xs text-emerald-300 font-semibold">
                    ✓ Enabled — your account is protected by a TOTP code.
                    {typeof currentUser?.backup_codes_remaining === 'number' && (
                      <span className="block text-[10px] text-slate-400 mt-0.5">
                        {currentUser.backup_codes_remaining} unused recovery code{currentUser.backup_codes_remaining === 1 ? '' : 's'} remaining.
                      </span>
                    )}
                  </span>
                  <div className="flex space-x-2 shrink-0">
                    <button
                      onClick={regenBackupCodes}
                      disabled={tfaBusy}
                      className="text-xs text-amber-300 hover:text-amber-200 border border-amber-800/60 rounded-xl px-3 py-1.5 disabled:opacity-50"
                    >
                      New recovery codes
                    </button>
                    <button
                      onClick={disable2FA}
                      disabled={tfaBusy}
                      className="text-xs text-red-300 hover:text-red-200 border border-red-800/60 rounded-xl px-3 py-1.5 disabled:opacity-50"
                    >
                      Disable
                    </button>
                  </div>
                </div>
              </div>
            ) : tfaSetup ? (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <p className="text-[11px] text-slate-400">
                  Scan this QR with Google Authenticator / 1Password / Authy, then enter the 6-digit code to confirm.
                </p>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(tfaSetup.otpauth_uri)}`}
                  alt="2FA QR code"
                  className="w-40 h-40 rounded-xl bg-white mx-auto"
                />
                <div className="text-center">
                  <span className="text-[10px] text-slate-500">Manual key:</span>
                  <code className="block text-xs text-indigo-300 font-mono break-all mt-0.5">{tfaSetup.secret}</code>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="123456"
                  value={tfaCode}
                  onChange={(e) => setTfaCode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-slate-100 font-mono tracking-widest focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={confirmEnable}
                  disabled={tfaBusy || tfaCode.length < 6}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3 rounded-2xl disabled:opacity-50"
                >
                  {tfaBusy ? 'Verifying…' : 'Confirm & Enable 2FA'}
                </button>
              </div>
            ) : (
              <button
                onClick={startSetup}
                disabled={tfaBusy}
                className="w-full bg-slate-950 border border-slate-800 hover:border-emerald-700 text-emerald-300 font-bold text-sm py-3 rounded-2xl disabled:opacity-50 transition-colors"
              >
                {tfaBusy ? 'Preparing…' : 'Enable Two-Factor Authentication'}
              </button>
            )}
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
