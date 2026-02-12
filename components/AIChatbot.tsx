
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, ExternalLink, Minimize2 } from 'lucide-react';
import { chatWithAI } from '../services/gemini';
import QuantumSpinner from './QuantumSpinner';

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string, sources?: any[] }[]>([
    { role: 'ai', text: 'Quantum Core Online. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await chatWithAI(userMsg);
    setMessages(prev => [...prev, { role: 'ai', text: response.text || '', sources: response.sources }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-inter">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-magenta-500 flex items-center justify-center shadow-[0_0_30px_rgba(0,243,255,0.4)] hover:scale-110 transition-all group animate-bounce"
        >
          <Bot className="w-8 h-8 text-black group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black" />
        </button>
      ) : (
        <div className="w-[90vw] sm:w-[400px] h-[500px] glass-panel rounded-[2.5rem] border border-cyan-500/30 flex flex-col overflow-hidden shadow-2xl animate-reveal">
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-orbitron font-black text-xs tracking-widest uppercase">Quantum Assistant</h3>
                <p className="text-[8px] text-cyan-500 font-bold uppercase tracking-tighter flex items-center gap-1">
                  <Sparkles className="w-2 h-2" /> Powered by Gemini 3 Pro
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-cyan-500 text-black font-bold' 
                  : 'bg-white/5 border border-white/10 text-slate-300'
                }`}>
                  {m.text}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
                      <p className="text-[8px] font-orbitron font-black text-cyan-400 uppercase">Sources</p>
                      {m.sources.map((s, si) => (
                        <a key={si} href={s.uri} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[9px] text-slate-500 hover:text-cyan-400 truncate">
                          <ExternalLink className="w-2 h-2" /> {s.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <QuantumSpinner size="sm" color="cyan" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/10">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-cyan-500/50"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cyan-400 hover:text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
