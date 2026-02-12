
import React, { useState } from 'react';
import { Post, Language } from '../types';
import { CATEGORIES } from '../constants';
import { Save, X, Globe, Shield, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import QuantumSpinner from './QuantumSpinner';

interface PostEditorProps {
  onSave: (post: Post) => void;
  onCancel: () => void;
  initialPost?: Partial<Post>;
  lang: Language;
}

const PostEditor: React.FC<PostEditorProps> = ({ onSave, onCancel, initialPost, lang }) => {
  const [title, setTitle] = useState(initialPost?.title || { en: '', bn: '', ar: '' });
  const [content, setContent] = useState(initialPost?.content || { en: '', bn: '', ar: '' });
  const [summary, setSummary] = useState(initialPost?.summary || { en: '', bn: '', ar: '' });
  const [category, setCategory] = useState(initialPost?.category || CATEGORIES[0]);
  const [image, setImage] = useState(initialPost?.image || '');
  const [seo, setSeo] = useState(initialPost?.seo || { 
    title: '', 
    description: '', 
    keywords: [], 
    robots: 'index, follow',
    ogImage: ''
  });
  
  const [activeLangTab, setActiveLangTab] = useState<Language>(lang);
  const [activeSection, setActiveSection] = useState<'content' | 'seo'>('content');

  const handleSave = () => {
    const newPost: Post = {
      id: initialPost?.id || Math.random().toString(36).substr(2, 9),
      title,
      content,
      summary,
      author: 'Raihan Khan',
      date: initialPost?.date || new Date().toISOString(),
      image,
      category,
      priority: initialPost?.priority || 5,
      tags: initialPost?.tags || [],
      seo,
      views: initialPost?.views || 0,
      likes: initialPost?.likes || 0
    };
    onSave(newPost);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl h-full bg-zinc-900 border border-white/10 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-reveal">
        {/* Header */}
        <header className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <Sparkles className="text-cyan-400 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-orbitron font-black uppercase tracking-widest">Post Terminal</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Drafting Quantum Transmission</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={onCancel}
              className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 font-orbitron text-[10px] font-bold hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <X className="w-4 h-4" /> ABORT
            </button>
            <button 
              onClick={handleSave}
              className="px-8 py-2 rounded-xl bg-cyan-500 text-black font-orbitron text-[10px] font-black hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)] flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> COMMIT POST
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Tabs */}
          <aside className="w-20 md:w-64 border-r border-white/5 flex flex-col p-4 gap-2">
            <button 
              onClick={() => setActiveSection('content')}
              className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${activeSection === 'content' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-500 hover:text-white'}`}
            >
              <Globe className="w-5 h-5" />
              <span className="hidden md:block font-orbitron text-[10px] font-bold uppercase">Main Content</span>
            </button>
            <button 
              onClick={() => setActiveSection('seo')}
              className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${activeSection === 'seo' ? 'bg-magenta-500/10 text-magenta-400 border border-magenta-500/20' : 'text-slate-500 hover:text-white'}`}
            >
              <Shield className="w-5 h-5" />
              <span className="hidden md:block font-orbitron text-[10px] font-bold uppercase">SEO Optimization</span>
            </button>
          </aside>

          {/* Main Area */}
          <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {activeSection === 'content' ? (
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Language Toggler */}
                <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
                  {(['en', 'bn', 'ar'] as Language[]).map(l => (
                    <button
                      key={l}
                      onClick={() => setActiveLangTab(l)}
                      className={`px-6 py-2 rounded-lg font-orbitron text-[10px] font-black uppercase transition-all ${activeLangTab === l ? 'bg-cyan-500 text-black' : 'text-slate-500 hover:text-white'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>

                <div className="space-y-6 animate-reveal" key={activeLangTab}>
                  <div>
                    <label className="text-[10px] font-orbitron font-black text-slate-500 uppercase tracking-widest mb-2 block">Post Title ({activeLangTab})</label>
                    <input 
                      type="text"
                      value={title[activeLangTab]}
                      onChange={e => setTitle({ ...title, [activeLangTab]: e.target.value })}
                      placeholder="Enter a captivating headline..."
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-lg font-bold focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-orbitron font-black text-slate-500 uppercase tracking-widest mb-2 block">Executive Summary ({activeLangTab})</label>
                    <textarea 
                      value={summary[activeLangTab]}
                      onChange={e => setSummary({ ...summary, [activeLangTab]: e.target.value })}
                      placeholder="Brief overview for the card feed..."
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm h-24 resize-none focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-orbitron font-black text-slate-500 uppercase tracking-widest mb-2 block">Full Content ({activeLangTab})</label>
                    <textarea 
                      value={content[activeLangTab]}
                      onChange={e => setContent({ ...content, [activeLangTab]: e.target.value })}
                      placeholder="Detailed transmission data... Markdown supported."
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-base h-[400px] focus:outline-none focus:border-cyan-500/50 font-inter leading-loose"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                  <div>
                    <label className="text-[10px] font-orbitron font-black text-slate-500 uppercase tracking-widest mb-2 block">Category</label>
                    <select 
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-cyan-500/50 text-white"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-orbitron font-black text-slate-500 uppercase tracking-widest mb-2 block">Cover Image URL</label>
                    <div className="relative">
                      <input 
                        type="text"
                        value={image}
                        onChange={e => setImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 pl-12 text-sm focus:outline-none focus:border-cyan-500/50"
                      />
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-8 animate-reveal">
                <div className="grid grid-cols-1 gap-8">
                  <div>
                    <label className="text-[10px] font-orbitron font-black text-magenta-500 uppercase tracking-widest mb-2 block">Meta Title</label>
                    <input 
                      type="text"
                      value={seo.title}
                      onChange={e => setSeo({ ...seo, title: e.target.value })}
                      placeholder="Best for search results..."
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-magenta-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-orbitron font-black text-magenta-500 uppercase tracking-widest mb-2 block">Meta Description</label>
                    <textarea 
                      value={seo.description}
                      onChange={e => setSeo({ ...seo, description: e.target.value })}
                      placeholder="Search engine snippet..."
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm h-24 resize-none focus:outline-none focus:border-magenta-500/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-[10px] font-orbitron font-black text-magenta-500 uppercase tracking-widest mb-2 block">Robots Directives</label>
                      <select 
                        value={seo.robots}
                        onChange={e => setSeo({ ...seo, robots: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-magenta-500/50 text-white"
                      >
                        <option value="index, follow">Index, Follow (Standard)</option>
                        <option value="noindex, follow">No-Index, Follow</option>
                        <option value="index, nofollow">Index, No-Follow</option>
                        <option value="noindex, nofollow">No-Index, No-Follow</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-orbitron font-black text-magenta-500 uppercase tracking-widest mb-2 block">OG Image URL</label>
                      <input 
                        type="text"
                        value={seo.ogImage}
                        onChange={e => setSeo({ ...seo, ogImage: e.target.value })}
                        placeholder="Specific image for social shares..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-magenta-500/50"
                      />
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-magenta-500/5 border border-magenta-500/20 flex gap-4">
                    <AlertCircle className="text-magenta-500 w-6 h-6 shrink-0" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-magenta-200">SEO Checkpoint</p>
                      <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-tighter">
                        Ensure metadata aligns with primary keywords to optimize indexing within the Google neural network.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
