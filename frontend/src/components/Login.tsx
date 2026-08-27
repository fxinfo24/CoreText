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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const token = await api.login({ email, password });
      api.setToken(token.access_token);
      const user = await api.getCurrentUser();
      onAuthenticated(user);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setError(detail || 'Login failed. Check your credentials.');
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
      api.setToken(token.access_token);
      const user = await api.getCurrentUser();
      onAuthenticated(user);
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

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2.5 font-semibold text-white transition-colors"
            >
              {loading ? 'Authenticating…' : 'Enter Command Center'}
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
