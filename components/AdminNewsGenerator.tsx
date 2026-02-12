
import React, { useState } from 'react';
import { fetchViralNews } from '../services/gemini';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Zap, Link, ExternalLink, PlusCircle } from 'lucide-react';
import QuantumSpinner from './QuantumSpinner';

interface NewsGenProps {
  lang: Language;
  onAddNewsAsPost: (news: any) => void;
}

const AdminNewsGenerator: React.FC<NewsGenProps> = ({ lang, onAddNewsAsPost }) => {
  const [loading, setLoading] = useState(false);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const t = TRANSLATIONS[lang];

  const handleGenerate = async () => {
    setLoading(true);
    const { data, sources } = await fetchViralNews(lang);
    setNewsList(data);
    setSources(sources);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-orbitron font-bold flex items-center gap-2">
          <Zap className="text-yellow-400" />
          {t.latestNews}
        </h2>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="relative flex items-center gap-2 px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-orbitron font-bold rounded-lg transition-all disabled:opacity-50 min-w-[200px] justify-center"
        >
          {loading ? (
            <QuantumSpinner size="sm" color="white" className="mr-2" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          GENERATE TRENDING NEWS
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {newsList.map((item, i) => (
          <div key={i} className="p-4 rounded-xl glass-panel border border-yellow-500/20 group hover:border-yellow-500/50 transition-all">
            <h4 className="font-bold text-lg mb-2 text-yellow-100">{item.headline}</h4>
            <p className="text-sm text-slate-400 mb-4">{item.summary}</p>
            <div className="flex items-center justify-between border-t border-white/5 pt-3">
              <a 
                href={item.url} 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs text-cyan-400 flex items-center gap-1 hover:underline"
              >
                <Link className="w-3 h-3" /> Original Source
              </a>
              <button
                onClick={() => onAddNewsAsPost(item)}
                className="flex items-center gap-1 text-[10px] font-orbitron font-bold text-green-400 hover:text-green-300"
              >
                <PlusCircle className="w-3 h-3" /> CREATE POST
              </button>
            </div>
          </div>
        ))}
      </div>

      {sources.length > 0 && (
        <div className="mt-8 p-4 rounded-xl bg-zinc-900/50 border border-white/10">
          <h4 className="text-xs font-orbitron font-bold text-slate-500 mb-3 tracking-widest">VERIFIED SOURCES (GEMINI GROUNDING)</h4>
          <div className="flex flex-wrap gap-2">
            {sources.map((s, i) => (
              <a 
                key={i} 
                href={s.uri} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-zinc-800 text-[10px] text-slate-400 hover:text-cyan-400 transition-colors"
              >
                {s.title} <ExternalLink className="w-2.5 h-2.5" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNewsGenerator;
