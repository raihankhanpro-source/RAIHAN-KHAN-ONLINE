
import React, { useState } from 'react';
import { Post, Language } from '../types';
import { CATEGORIES } from '../constants';
import { Save, X, Globe, Shield, Image as ImageIcon, Sparkles, AlertCircle, Eye, EyeOff, Layout } from 'lucide-react';
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
    // Ensure the post has all necessary fields
    const newPost: Post = {
      id: initialPost?.id || Math.random().toString(36).substr(2, 9),
      title,
      content,
      summary,
      author: initialPost?.author || 'Raihan Khan',
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

  const isNoIndex = seo.robots?.includes('noindex');

  const toggleRobots = () => {
    setSeo({
      ...seo,
      robots: isNoIndex ? 'index, follow' : 'noindex, nofollow'
    });
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl h-[90vh] bg-zinc-900 border border-white/10 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-reveal">
        {/* Header */}
        <header className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5 shrink-0">
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
          <aside className="w-20 md:w-64 border-r border-white/5 flex flex-col p-4 gap-2 bg-black/20 shrink-0">
            <button 
              onClick={() => setActiveSection('content')}
              className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${activeSection === 'content' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-500 hover:text-white'}`}
            >
              <Layout className="w-5 h-5" />
              <span className="hidden md:block font-orbitron text-[10px] font-bold uppercase">Main Content</span>
            </button>
            <button 
              onClick={() => setActiveSection('seo')}
              className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${activeSection === 'seo' ? 'bg-magenta-500/10 text-magenta-400 border border-magenta-500/20' : 'text-slate-500 hover:text-white'}`}
            >
              <Shield className="w-5 h-5" />
              <span className="hidden md:block font-orbitron text-[10px] font-bold uppercase">SEO & Visibility</span>
            </button>
          </aside>

          {/* Main Area */}
          <main className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gradient-to-b from-transparent to-black/30">
            {activeSection === 'content' ? (
              <div className="max-w-4xl mx-auto space-y-8 pb-12">
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
                  <div className="group">
                    <label className="text-[10px] font-orbitron font-black text-slate-500 uppercase tracking-widest mb-2 block group-focus-within:text-cyan-500 transition-colors">Post Title ({activeLangTab})</label>
                    <input 
                      type="text"
                      value={title[activeLangTab]}
                      onChange={e => setTitle({ ...title, [activeLangTab]: e.target.value })}
                      placeholder="Enter a captivating headline..."
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-lg font-bold focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                  </div>

                  <div className="group">
                    <label className="text-[10px] font-orbitron font-black text-slate-500 uppercase tracking-widest mb-2 block group-focus-within:text-cyan-500 transition-colors">Executive Summary ({activeLangTab})</label>
                    <textarea 
                      value={summary[activeLangTab]}
                      onChange={e => setSummary({ ...summary, [activeLangTab]: e.target.value })}
                      placeholder="Brief overview for the card feed..."
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm h-24 resize-none focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                  </div>

                  <div className="group">
                    <label className="text-[10px] font-orbitron font-black text-slate-500 uppercase tracking-widest mb-2 block group-focus-within:text-cyan-500 transition-colors">Full Content ({activeLangTab})</label>
                    <textarea 
                      value={content[activeLangTab]}
                      onChange={e => setContent({ ...content, [activeLangTab]: e.target.value })}
                      placeholder="Detailed transmission data... Markdown supported."
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-base h-[400px] focus:outline-none focus:border-cyan-500/50 font-inter leading-loose transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                  <div className="group">
                    <label className="text-[10px] font-orbitron font-black text-slate-500 uppercase tracking-widest mb-2 block group-focus-within:text-cyan-500 transition-colors">Category</label>
                    <select 
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-cyan-500/50 text-white appearance-none cursor-pointer"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c} className="bg-zinc-900">{c}</option>)}
                    </select>
                  </div>
                  <div className="group">
                    <label className="text-[10px] font-orbitron font-black text-slate-500 uppercase tracking-widest mb-2 block group-focus-within:text-cyan-500 transition-colors">Cover Image URL</label>
                    <div className="relative">
                      <input 
                        type="text"
                        value={image}
                        onChange={e => setImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 pl-12 text-sm focus:outline-none focus:border-cyan-500/50 transition-all"
                      />
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-8 animate-reveal pb-12">
                <header className="pb-4 border-b border-white/5">
                  <h3 className="text-xl font-orbitron font-black text-magenta-500 uppercase tracking-widest flex items-center gap-3">
                    <Shield className="w-5 h-5" /> Meta Protocol Optimization
                  </h3>
                  <p className="text-xs text-slate-500 mt-2">Configure how search engines and social platforms perceive this transmission.</p>
                </header>

                <div className="grid grid-cols-1 gap-8">
                  <div className="group">
                    <label className="text-[10px] font-orbitron font-black text-magenta-500 uppercase tracking-widest mb-2 block group-focus-within:text-white transition-colors">Meta Title</label>
                    <input 
                      type="text"
                      value={seo.title}
                      onChange={e => setSeo({ ...seo, title: e.target.value })}
                      placeholder="Best for search results..."
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-magenta-500/50 transition-all"
                    />
                  </div>

                  <div className="group">
                    <label className="text-[10px] font-orbitron font-black text-magenta-500 uppercase tracking-widest mb-2 block group-focus-within:text-white transition-colors">Meta Description</label>
                    <textarea 
                      value={seo.description}
                      onChange={e => setSeo({ ...seo, description: e.target.value })}
                      placeholder="Search engine snippet..."
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm h-24 resize-none focus:outline-none focus:border-magenta-500/50 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                      <label className="text-[10px] font-orbitron font-black text-magenta-500 uppercase tracking-widest mb-2 block">Search Engine Visibility</label>
                      <button 
                        onClick={toggleRobots}
                        className={`w-full p-5 rounded-3xl border transition-all flex items-center justify-between group-button ${isNoIndex ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-green-500/10 border-green-500/30 text-green-400'}`}
                      >
                        <div className="flex items-center gap-4">
                          {isNoIndex ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                          <div className="text-left">
                            <p className="text-sm font-bold font-orbitron uppercase leading-none mb-1">{isNoIndex ? 'Noindex, Nofollow' : 'Index, Follow'}</p>
                            <p className="text-[9px] opacity-60 uppercase tracking-tighter font-medium">{isNoIndex ? 'Transmission Hidden from Crawlers' : 'Broadcast Visible to Global Search'}</p>
                          </div>
                        </div>
                        <div className={`w-12 h-7 rounded-full relative transition-all duration-300 ${isNoIndex ? 'bg-red-500/40' : 'bg-green-500/40'}`}>
                          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 ${isNoIndex ? 'right-1 scale-110' : 'left-1'}`} />
                        </div>
                      </button>
                      <div className="px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-slate-500 leading-relaxed italic">
                          Simplified control for your privacy. Currently generating: <code className="text-magenta-400 font-mono font-bold ml-1">{seo.robots}</code>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-orbitron font-black text-magenta-500 uppercase tracking-widest mb-2 block">Open Graph Image (Social Share)</label>
                      <div className="relative">
                        <input 
                          type="text"
                          value={seo.ogImage}
                          onChange={e => setSeo({ ...seo, ogImage: e.target.value })}
                          placeholder="Image URL for Facebook/Twitter..."
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-magenta-500/50 transition-all"
                        />
                      </div>
                      
                      {/* OG Image Preview */}
                      <div className="mt-4 rounded-[2.5rem] border border-white/5 overflow-hidden bg-black/60 aspect-[1.91/1] flex items-center justify-center relative group-preview">
                        {seo.ogImage ? (
                          <>
                            <img 
                              src={seo.ogImage} 
                              alt="Social Preview" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              onError={(e) => { (e.target as any).src = 'https://placehold.co/1200x630/111/444?text=Invalid+Image+URL'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute bottom-4 left-6 right-6">
                                <p className="text-[10px] font-orbitron font-black text-white/40 uppercase tracking-[0.3em] mb-1">Visual Preview</p>
                                <p className="text-xs font-bold text-white truncate">{seo.title || "Untitled Post"}</p>
                            </div>
                            <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[8px] font-orbitron font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                                <ImageIcon className="w-2.5 h-2.5" /> Social OG Card
                            </div>
                          </>
                        ) : (
                          <div className="text-center space-y-3 opacity-30">
                            <ImageIcon className="w-10 h-10 mx-auto text-slate-500" />
                            <p className="text-[9px] font-orbitron font-black uppercase tracking-widest">Awaiting Visual Signature</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-8 rounded-[2rem] bg-magenta-500/5 border border-magenta-500/10 flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-magenta-500/10 flex items-center justify-center shrink-0 border border-magenta-500/20">
                      <AlertCircle className="text-magenta-500 w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-magenta-200 font-orbitron uppercase tracking-widest">SEO Core Validation</p>
                      <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-tighter">
                        Ensure metadata aligns with primary keywords to optimize indexing within global neural networks. Open Graph images should be <span className="text-magenta-400 font-bold">1200x630px</span> for optimal cross-platform presentation.
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
