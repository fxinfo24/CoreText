import React, { useState, useEffect, useRef } from 'react';
import { Send, Brain, Sparkles, User, MessageSquare } from 'lucide-react';
import * as T from '../../types';

interface ChatTabProps {
  messages: T.ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  activeSite: T.Site | null;
}

export const ChatTab: React.FC<ChatTabProps> = ({ messages, onSendMessage, activeSite }) => {
  const [inputText, setInputText] = useState('');
  const [transmitting, setTransmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, transmitting]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || transmitting) return;

    setInputText('');
    setTransmitting(true);
    await onSendMessage(text);
    setTransmitting(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-left">
      
      {/* Summary Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Conversational Shareholder Co-Director AI</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Rather than clicking static operator panels or filling out brief forms, engage in real executive strategy dialogue. The AI formulates concrete, executable compounding roadmaps instantly.
          </p>
        </div>
        <span className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-indigo-500 text-white shadow font-mono uppercase tracking-wider">
          Frontier AI Reasoning Active
        </span>
      </div>

      {/* Quick Pre-Configured Strategic Conversational Starter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-black text-slate-400 mr-1.5 uppercase tracking-wider">Quick Shareholder Directives:</span>
        <button
          onClick={() => handleSend("I want to shift this site's focus more toward product reviews and less toward informational content — how should we transition over the next 6 months?")}
          className="bg-slate-900 hover:bg-indigo-950 text-indigo-300 hover:text-indigo-200 border border-slate-800 hover:border-indigo-500/50 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow transform hover:-translate-y-0.5"
        >
          <span>🚀 6-Month Product Review Transition Pivot</span>
        </button>
        <button
          onClick={() => handleSend("A competitor just published 40 articles in the last 2 weeks in our main topic cluster. What should we do?")}
          className="bg-slate-900 hover:bg-indigo-950 text-indigo-300 hover:text-indigo-200 border border-slate-800 hover:border-indigo-500/50 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow transform hover:-translate-y-0.5"
        >
          <span>⚡ Competitor Interception Counter-Offensive</span>
        </button>
        <button
          onClick={() => handleSend("I want to launch a digital product by October. What content should we be building now to support that?")}
          className="bg-slate-900 hover:bg-indigo-950 text-indigo-300 hover:text-indigo-200 border border-slate-800 hover:border-indigo-500/50 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow transform hover:-translate-y-0.5"
        >
          <span>📅 October Digital Product Pipeline</span>
        </button>
      </div>

      {/* Chat Stream Main Area */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col h-[560px] justify-between overflow-hidden shadow-inner">
        
        {/* Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3.5 max-w-3xl ${
                  isUser ? 'ml-auto flex-row-reverse space-x-reverse' : 'mr-auto'
                }`}
              >
                
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-extrabold text-sm shadow-md shrink-0 ${
                    isUser ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                  }`}
                >
                  {isUser ? 'AV' : <Brain className="w-5 h-5 text-white" />}
                </div>

                {/* Content Box */}
                <div
                  className={`${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none space-y-3'
                  } p-5 rounded-3xl text-sm shadow-xl`}
                >
                  {/* If AI returns HTML, render it securely */}
                  {isUser ? (
                    <p className="font-medium whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div className="prose prose-invert max-w-none text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.text }} />
                  )}
                  <span className={`block text-[10px] text-right pt-1 font-mono ${isUser ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {msg.timestamp}
                  </span>
                </div>

              </div>
            );
          })}

          {/* Typing Indicator */}
          {transmitting && (
            <div className="flex items-start space-x-3 max-w-md mr-auto animate-fadeIn">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow shrink-0">
                <Brain className="w-5 h-5 text-white animate-spin" />
              </div>
              <div className="bg-slate-900 border border-slate-800 text-slate-300 px-5 py-4 rounded-3xl rounded-tl-none text-xs font-bold flex items-center space-x-2 shadow-xl">
                <span>Synthesizing 3-Layer Frontier Knowledge Engine</span>
                <span className="inline-flex space-x-1 ml-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                </span>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900/95 border-t border-slate-800 flex items-center space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your Shareholder strategic directive or market scenario inquiry..."
            className="flex-1 bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm font-medium rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 shadow-inner"
          />
          <button
            onClick={() => handleSend()}
            disabled={transmitting || !inputText.trim()}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-extrabold px-8 py-4 rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 shrink-0"
          >
            <Send className="w-4 h-4 text-indigo-100" />
            <span className="text-sm">Transmit Directive</span>
          </button>
        </div>

      </div>

    </div>
  );
};
