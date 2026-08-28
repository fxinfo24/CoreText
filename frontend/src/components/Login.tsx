import React, { useState } from 'react';
import * as api from '../api';
import * as T from '../types';

interface LoginProps {
  onAuthenticated: (user: T.User) => void;
}

export const Login: React.FC<LoginProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // 2FA second step
  const [totpTempToken, setTotpTempToken] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState('');

  const finishLogin = async (token: string) => {
    api.setToken(token);
    const user = await api.getCurrentUser();
    onAuthenticated(user);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.totp_required && res.temp_token) {
        setTotpTempToken(res.temp_token);
        setLoading(false);
        return; // wait for 2FA code
      }
      if (res.access_token) {
        await finishLogin(res.access_token);
      } else {
        setError('Unexpected login response.');
      }
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setError(detail || 'Login failed. Check your credentials.');
    } finally {
      if (!totpTempToken) setLoading(false);
    }
  };

  const handleTotpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!totpTempToken) return;
    setError(null);
    setLoading(true);
    try {
      const res = await api.verifyTwoFactor(totpTempToken, totpCode);
      if (res.access_token) {
        await finishLogin(res.access_token);
      } else {
        setError('Unexpected 2FA response.');
      }
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setError(detail || 'Two-factor verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await api.register({
        email,
        password,
        full_name: fullName,
        role: 'viewer',
        invite_code: inviteCode,
      });
      // Auto sign-in after successful registration.
      const token = await api.login({ email, password });
      if (!token.access_token) {
        // Shouldn't happen for a brand-new (2FA-off) account, but guard anyway.
        setError('Registration succeeded but auto sign-in failed. Please sign in manually.');
        setMode('signin');
        return;
      }
      await finishLogin(token.access_token);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setError(detail || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 px-8 py-7">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">
            CoreText Executive OS
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {mode === 'signin' ? 'Shareholder Command Access' : 'Request Command Access'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'signin'
              ? 'Authenticate to enter the compounding engine.'
              : 'Self-registration requires a valid invite code.'}
          </p>
        </div>

        {mode === 'signin' ? (
          <form onSubmit={handleSignIn} className="p-8 space-y-5">
            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">
                Email
              </label>
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>

            {totpTempToken && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">
                  Two-Factor Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-indigo-700 px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 tracking-widest"
                  placeholder="123456"
                />
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Enter the 6-digit code from your authenticator app.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2.5 font-semibold text-white transition-colors"
            >
              {loading ? 'Authenticating…' : (totpTempToken ? 'Verify & Enter' : 'Enter Command Center')}
            </button>

            <p className="text-[11px] text-slate-600 text-center leading-relaxed">
              Protected asset. Access is restricted to authorized Shareholders.
            </p>

            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode('signup');
              }}
              className="w-full text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Need access? Request an account with an invite code
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="p-8 space-y-5">
            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Jane Shareholder"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">
                Email
              </label>
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <input
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">
                Invite Code
              </label>
              <input
                type="text"
                required
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Provided by your admin"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2.5 font-semibold text-white transition-colors"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>

            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode('signin');
              }}
              className="w-full text-xs text-slate-400 hover:text-slate-300 transition-colors"
            >
              ← Back to sign in
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
