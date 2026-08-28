import React from 'react';
import { Brain, TrendingUp, ShieldAlert, Zap, Award, CheckCircle2, Globe, Lock, Cpu, ArrowRight, Sparkles } from 'lucide-react';

interface LandingProps {
  onEnterApp: () => void;
}

/**
 * Public marketing / landing page for unauthenticated visitors.
 * Explains what CoreText is, what it does, and what it offers, then routes
 * the visitor into the authenticated app (login / sign-up).
 */
export const Landing: React.FC<LandingProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl tracking-tight">CoreText</span>
            <span className="text-[10px] uppercase tracking-widest text-indigo-400 hidden sm:block mt-1">Executive OS</span>
          </div>
          <button
            onClick={onEnterApp}
            className="bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg shadow-indigo-500/20"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300">Autonomous AI for digital asset shareholders</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6">
            Compound your websites like a
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-emerald-400 to-indigo-400"> private equity fund</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            CoreText is an Executive OS that turns each shareholder website into a compounding asset — with an
            autonomous Co-Director that plans, atomizes, and deploys content strategy across every channel while you sleep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={onEnterApp}
              className="bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all transform hover:-translate-y-0.5 shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              Enter the Executive OS <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#what"
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-lg px-8 py-4 rounded-2xl transition-colors border border-slate-800"
            >
              See what it does
            </a>
          </div>

          {/* Social proof stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { v: '3', l: 'Live shareholder assets' },
              { v: '6', l: 'Atomized channels' },
              { v: '24/7', l: 'Autonomous execution' },
              { v: '100+', l: 'LLM models via OpenRouter' },
            ].map((s) => (
              <div key={s.l} className="bg-slate-900/60 border border-slate-800 rounded-2xl py-5">
                <div className="font-black text-2xl md:text-3xl text-emerald-300 mb-1">{s.v}</div>
                <div className="text-slate-500 text-xs">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What it does */}
      <section id="what" className="py-20 px-6 bg-slate-950/50 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">What CoreText actually does</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              One control room for every website you own — strategy, execution, and surveillance in real time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <TrendingUp className="w-6 h-6 text-indigo-400" />,
                title: 'Compounding Command Deck',
                body: 'A unified dashboard across all shareholder sites: asset value, monthly revenue, authority scores, and predictive health — updated continuously.',
              },
              {
                icon: <Brain className="w-6 h-6 text-emerald-400" />,
                title: 'Autonomous Co-Director',
                body: 'Chat with an AI strategist that knows every asset, niche signal, and monetization webhook. It drafts decisions, then executes the safe ones autonomously.',
              },
              {
                icon: <Zap className="w-6 h-6 text-amber-400" />,
                title: 'Content Atomization Studio',
                body: 'One article becomes a newsletter, LinkedIn post, tweet thread, YouTube script, and podcast outline — ready to deploy in one click.',
              },
              {
                icon: <Globe className="w-6 h-6 text-sky-400" />,
                title: 'GEO / AI Search Visibility',
                body: 'Track how ChatGPT, Perplexity, and Claude cite each asset. Deploy answer-bait and fix citation defects before competitors do.',
              },
              {
                icon: <ShieldAlert className="w-6 h-6 text-rose-400" />,
                title: 'Preemptive Decay Shields',
                body: 'CoreText predicts when a page will decay in rankings and auto-deploys a refresh shield before the traffic drops.',
              },
              {
                icon: <Award className="w-6 h-6 text-fuchsia-400" />,
                title: 'Hive Learning Mesh',
                body: 'Winning strategies from one asset are automatically transferred to the others — the whole portfolio gets smarter over time.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-lg text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / security strip */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 bg-slate-900/60 border border-slate-800 rounded-3xl p-8">
          <div className="flex-1">
            <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
              <Lock className="w-6 h-6 text-emerald-400" /> Invite-only. Secure by design.
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Access is gated by admin-issued single-use invitation codes. Temp-mail signups are blocked, brute-force
              registration is rate-limited, and every account is protected with bcrypt password hashing and JWT sessions.
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4">
                <Cpu className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                <div className="text-xs text-slate-400">OpenRouter-ready</div>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <div className="text-xs text-slate-400">Owner-controlled RBAC</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 border border-slate-800 rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to compound your portfolio?</h2>
          <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
            Sign in with your invitation to enter the Executive OS. New here? Ask the owner for an invite code.
          </p>
          <button
            onClick={onEnterApp}
            className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-lg px-8 py-4 rounded-2xl transition-all transform hover:-translate-y-0.5 shadow-xl flex items-center justify-center gap-2 mx-auto"
          >
            Enter CoreText <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-300">CoreText Executive OS</span>
          </div>
          <span>© 2026 CoreText. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};
