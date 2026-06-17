import React from 'react';
import { X, Cpu, Send, CheckCircle } from 'lucide-react';
import * as T from '../types';

interface AtomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: T.AtomizationResponse | null;
  onDeploy: () => void;
}

export const AtomizeModal: React.FC<AtomizeModalProps> = ({ isOpen, onClose, data, onDeploy }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-left">
        
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-indigo-950 to-slate-900 border-b border-slate-800 px-6 py-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-0.5">
              Multi-Format Content Atomization Studio
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">{data.core_title}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mt-1.5">
              Topical Cluster: {data.cluster}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Studio Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          <p className="text-slate-300 leading-relaxed font-medium">
            Here are your 6 fully realized Multi-Format Content Atoms, autonomously structured from the core strategic brief. Review the channel variations below and distribute them directly to your live API sitemap webhooks.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Box 1: Newsletter */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex flex-col justify-between space-y-2 shadow-inner">
              <span className="block font-black text-emerald-400 uppercase tracking-wider flex items-center text-[10px]">
                <Cpu className="w-4 h-4 mr-1.5 text-emerald-400 shrink-0" />
                Newsletter Dedicated Framing
              </span>
              <pre className="whitespace-pre-wrap text-slate-200 font-sans leading-relaxed text-[11px] bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 flex-1">
                {data.newsletter}
              </pre>
            </div>

            {/* Box 2: LinkedIn */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex flex-col justify-between space-y-2 shadow-inner">
              <span className="block font-black text-blue-400 uppercase tracking-wider flex items-center text-[10px]">
                <Cpu className="w-4 h-4 mr-1.5 text-blue-400 shrink-0" />
                LinkedIn Professional Carousel Hook
              </span>
              <pre className="whitespace-pre-wrap text-slate-200 font-sans leading-relaxed text-[11px] bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 flex-1">
                {data.linkedin}
              </pre>
            </div>

            {/* Box 3: Twitter */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex flex-col justify-between space-y-2 shadow-inner">
              <span className="block font-black text-sky-400 uppercase tracking-wider flex items-center text-[10px]">
                <Cpu className="w-4 h-4 mr-1.5 text-sky-400 shrink-0" />
                Twitter / X Thread Structure
              </span>
              <pre className="whitespace-pre-wrap text-slate-200 font-sans leading-relaxed text-[11px] bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 flex-1">
                {data.twitter}
              </pre>
            </div>

            {/* Box 4: YouTube */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex flex-col justify-between space-y-2 shadow-inner">
              <span className="block font-black text-red-400 uppercase tracking-wider flex items-center text-[10px]">
                <Cpu className="w-4 h-4 mr-1.5 text-red-400 shrink-0" />
                YouTube Technical Video Script Outline
              </span>
              <pre className="whitespace-pre-wrap text-slate-200 font-sans leading-relaxed text-[11px] bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 flex-1">
                {data.youtube}
              </pre>
            </div>

            {/* Box 5: Podcast */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex flex-col justify-between space-y-2 md:col-span-2 shadow-inner">
              <span className="block font-black text-violet-400 uppercase tracking-wider flex items-center text-[10px]">
                <Cpu className="w-4 h-4 mr-1.5 text-violet-400 shrink-0" />
                Podcast Executive Talking Points Agenda
              </span>
              <pre className="whitespace-pre-wrap text-slate-200 font-sans leading-relaxed text-[11px] bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 flex-1">
                {data.podcast}
              </pre>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex flex-wrap justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs px-6 py-3.5 rounded-2xl transition-all"
          >
            <span>Close Window</span>
          </button>
          <button
            onClick={onDeploy}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            <Send className="w-4 h-4 text-indigo-100" />
            <span>Auto-Distribute Across All 6 Webhooks</span>
          </button>
        </div>

      </div>
    </div>
  );
};
