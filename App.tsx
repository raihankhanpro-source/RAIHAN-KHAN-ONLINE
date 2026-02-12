
import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from './hooks/useStore';
import { Post, Comment, User, Language, AISuggestion } from './types';
import { TRANSLATIONS, AI_TOOLS, SOCIAL_HANDLES, SAUDI_HELP_ITEMS, CATEGORIES } from './constants';
import Navbar from './components/Navbar';
import PostCard from './components/PostCard';
import CommentSection from './components/CommentSection';
import AdminAnalytics from './components/AdminAnalytics';
import AdminNewsGenerator from './components/AdminNewsGenerator';
import AIChatbot from './components/AIChatbot';
import AIImageGenerator from './components/AIImageGenerator';
import ScrollToTop from './components/ScrollToTop';
import QuantumSpinner from './components/QuantumSpinner';
import PostEditor from './components/PostEditor';
import { analyzeCommentSentiment, getAIContentSuggestions } from './services/gemini';
import { auth } from './services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { 
  Plus, Edit3, Trash2, ChevronUp, ChevronDown, 
  BarChart3, Settings, List, BrainCircuit, User as UserIcon,
  Search, Heart, Share2, Sparkles, LayoutDashboard, Clock, Eye,
  ExternalLink, Facebook, Instagram, Send, Bot, Info, Globe, ArrowRight,
  HeartHandshake, BookOpen, ShieldCheck, MapPin, Key, UserPlus, MessageSquare,
  CheckCircle, XCircle, History, Zap, Bell, Check, Lightbulb, Loader2,
  Twitter, Linkedin, MessageCircle, Link as LinkIcon, FilePlus, UserCircle
} from 'lucide-react';

const App: React.FC = () => {
  const { 
    posts, addPost, deletePost,
    comments, setComments,
    currentUser, setCurrentUser,
    users, addUser, deleteUser,
    siteConfig,
    lang, setLang,
    incrementView, toggleLike
  } = useStore();

  const [path, setPath] = useState('home');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authError, setAuthError] = useState('');

  const t = TRANSLATIONS[lang];

  // --- FIREBASE AUTH SYNC ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Sync firebase user with our internal user model
        const matchedUser = users.find(u => u.email === firebaseUser.email);
        if (matchedUser) {
          setCurrentUser({
            ...matchedUser,
            id: firebaseUser.uid, // Ensure ID syncs
            avatar: firebaseUser.photoURL || matchedUser.avatar
          });
        } else {
          const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Unknown User',
            email: firebaseUser.email || '',
            avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
            role: firebaseUser.email === 'raihankhanpro@gmail.com' ? 'admin' : 'user',
            interests: [],
            history: [],
            subscriptions: [],
            likedPosts: []
          };
          setCurrentUser(newUser);
        }
      } else {
        setCurrentUser(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, [users, setCurrentUser]);

  // --- ENHANCED SEO & METADATA MANAGEMENT ---
  useEffect(() => {
    const updateMetadata = () => {
      let title = siteConfig.siteName;
      let description = "Futuristic AI blogging platform and Saudi Arabia expat guide.";
      let keywords = "AI, Saudi Arabia, Expat Guide, Tech, Design, Raihan Khan";
      let image = "/logo.png"; 
      let robots = "index, follow";

      if (path === 'post-detail' && selectedPost) {
        title = `${selectedPost.title[lang]} | ${siteConfig.siteName}`;
        description = selectedPost.seo?.description || selectedPost.summary[lang];
        keywords = selectedPost.seo?.keywords?.join(', ') || keywords;
        image = selectedPost.seo?.ogImage || selectedPost.image;
        robots = selectedPost.seo?.robots || robots;

        const schema = {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": selectedPost.title[lang],
          "image": [selectedPost.image],
          "datePublished": selectedPost.date,
          "author": [{
              "@type": "Person",
              "name": selectedPost.author,
              "url": window.location.origin
            }],
          "description": description,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": window.location.href
          }
        };

        const existingScript = document.getElementById('json-ld-schema');
        if (existingScript) existingScript.remove();

        const script = document.createElement('script');
        script.id = 'json-ld-schema';
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);
      }

      document.title = title;
      
      const metas = [
        { name: "description", content: description },
        { name: "keywords", content: keywords },
        { name: "robots", content: robots },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: image },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image }
      ];

      metas.forEach(m => {
        const selector = m.name ? `meta[name="${m.name}"]` : `meta[property="${m.property}"]`;
        let element = document.querySelector(selector);
        if (!element) {
          element = document.createElement('meta');
          if (m.name) element.setAttribute('name', m.name);
          if (m.property) element.setAttribute('property', m.property);
          document.head.appendChild(element);
        }
        element.setAttribute('content', m.content);
      });
    };

    updateMetadata();
  }, [path, selectedPost, lang, siteConfig.siteName]);

  const recommendedPosts = useMemo(() => {
    if (!currentUser || !currentUser.history || currentUser.history.length === 0) return posts.slice(0, 4);
    const categoriesCount: Record<string, number> = {};
    currentUser.history.forEach(h => {
        const post = posts.find(p => p.id === h.postId);
        if (post) categoriesCount[post.category] = (categoriesCount[post.category] || 0) + 1;
    });
    const topCategory = Object.entries(categoriesCount).sort((a, b) => b[1] - a[1])[0]?.[0];
    return posts
      .filter(p => p.category === topCategory)
      .concat(posts.filter(p => p.category !== topCategory))
      .slice(0, 4);
  }, [posts, currentUser]);

  const handleFetchSuggestions = async () => {
    setLoadingSuggestions(true);
    const ideas = await getAIContentSuggestions(posts.map(p => p.title['en']));
    setAiSuggestions(ideas);
    setLoadingSuggestions(false);
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthLoading(true);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
          await updateProfile(userCredential.user, { displayName });
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setPath('home');
      setEmail('');
      setPassword('');
      setDisplayName('');
    } catch (error: any) {
      console.error("Auth Error:", error);
      setAuthError(error.message || 'Authentication failed. Please try again.');
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setPath('home');
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleModeration = (commentId: string, status: 'approved' | 'rejected' | 'delete') => {
    if (status === 'delete') {
      setComments(comments.filter(c => c.id !== commentId));
    } else {
      setComments(comments.map(c => c.id === commentId ? { ...c, status } : c));
    }
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setPath('post-detail');
    incrementView(post.id);
    if (currentUser) {
      const historyItem = { postId: post.id, viewedAt: new Date().toISOString() };
      const filteredHistory = (currentUser.history || []).filter(h => h.postId !== post.id);
      const newHistory = [historyItem, ...filteredHistory].slice(0, 12); 
      setCurrentUser({ ...currentUser, history: newHistory });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderSaudiHelper = () => (
    <div className="max-w-[1600px] mx-auto px-[5vw] py-24">
      <header className="mb-16 text-center reveal-item">
        <h1 className="text-4xl md:text-6xl font-orbitron font-black mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent flex flex-col md:flex-row items-center justify-center gap-4">
          <HeartHandshake className="w-12 h-12 text-emerald-400" /> {t.saudiHelper}
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
          Essential services and daily guides for expatriates in Saudi Arabia. Verified links and instructions.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {SAUDI_HELP_ITEMS.map((item, i) => (
          <section key={item.id} className="glass-panel rounded-[2.5rem] p-8 border border-white/5 relative group transition-all duration-500 hover:border-emerald-500/30 reveal-item" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)] group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1 tracking-tight">{item.title[lang]}</h3>
                  <span className="text-[10px] font-orbitron font-black text-emerald-500 uppercase tracking-[0.2em]">{item.category}</span>
                </div>
              </div>
              <a href={item.url} target="_blank" rel="noreferrer" className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-emerald-500 hover:text-black transition-all" aria-label={`Visit ${item.title[lang]} official site`}>
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">{item.description[lang]}</p>
            <div className="p-6 rounded-3xl bg-black/40 border border-white/5">
                <h4 className="text-[10px] font-orbitron font-black text-emerald-400 uppercase tracking-widest mb-2">Expert Guide</h4>
                <p className="text-sm text-slate-400 italic leading-relaxed">{item.simpleGuide[lang]}</p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );

  const renderPostDetail = () => {
    if (!selectedPost) return renderHome();
    const shareUrl = window.location.href;
    const shareTitle = selectedPost.title[lang];
    const isLiked = (currentUser?.likedPosts || []).includes(selectedPost.id);

    const shareLinks = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`
    };

    return (
      <article className="max-w-4xl mx-auto px-[5vw] py-24">
        <nav aria-label="Breadcrumb" className="mb-12">
          <button 
            onClick={() => setPath('home')}
            className="flex items-center gap-2 text-cyan-400 font-orbitron text-xs hover:translate-x-[-4px] transition-transform"
          >
            <ArrowRight className="w-4 h-4 rotate-180" /> BACK TO TERMINAL
          </button>
        </nav>
        
        <header className="space-y-8 mb-12">
          <div className="relative group overflow-hidden rounded-[3rem] border border-white/10 shadow-2xl">
            <img 
              src={selectedPost.image} 
              alt={selectedPost.title[lang]} 
              className="w-full h-[400px] object-cover transition-transform duration-1000 group-hover:scale-105" 
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-500 text-[10px] font-orbitron font-black uppercase tracking-widest border border-cyan-500/20">
              {selectedPost.category}
            </span>
            <time dateTime={selectedPost.date} className="text-slate-500 text-[10px] font-orbitron font-bold uppercase tracking-widest">
              {new Date(selectedPost.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight text-white">{selectedPost.title[lang]}</h1>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-6 border-y border-white/5">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-orbitron text-slate-500 uppercase tracking-widest">By {selectedPost.author}</span>
              <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
              <span className="text-[10px] font-orbitron text-slate-500 uppercase tracking-widest">{selectedPost.views} Views</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-orbitron text-slate-400 uppercase tracking-[0.2em] font-black mr-2">INTERACT:</span>
              <button 
                onClick={() => toggleLike(selectedPost.id)}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all hover:-translate-y-1 shadow-lg border ${isLiked ? 'bg-magenta-500/20 text-magenta-500 border-magenta-500/40' : 'bg-white/5 text-slate-400 border-white/10 hover:border-magenta-500/30'}`}
                aria-label="Like Post"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <a href={shareLinks.facebook} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#1877F2] hover:border-[#1877F2]/40 hover:bg-[#1877F2]/10 transition-all hover:-translate-y-1 shadow-lg"><Facebook className="w-5 h-5" /></a>
              <a href={shareLinks.twitter} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-black hover:border-white/40 transition-all hover:-translate-y-1 shadow-lg"><Twitter className="w-5 h-5" /></a>
              <a href={shareLinks.linkedin} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#0077B5] hover:border-[#0077B5]/40 hover:bg-[#0077B5]/10 transition-all hover:-translate-y-1 shadow-lg"><Linkedin className="w-5 h-5" /></a>
              <a href={shareLinks.whatsapp} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#25D366] hover:border-[#25D366]/40 hover:bg-[#25D366]/10 transition-all hover:-translate-y-1 shadow-lg"><MessageCircle className="w-5 h-5" /></a>
              <button onClick={copyToClipboard} className={`w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:-translate-y-1 shadow-lg ${copied ? 'text-green-400 border-green-500/50 bg-green-500/10' : 'text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-cyan-500/10'}`}>{copied ? <Check className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}</button>
            </div>
          </div>
        </header>
        
        <div className="prose prose-invert max-w-none text-slate-300 text-lg md:text-xl leading-loose space-y-8 mb-20 font-inter">
          {selectedPost.content[lang]}
        </div>

        <section id="comments" aria-label="Comments Section">
          <CommentSection 
            postId={selectedPost.id}
            comments={comments}
            lang={lang}
            user={currentUser}
            onAddComment={async (text) => {
              const status = await analyzeCommentSentiment(text);
              const newComment: Comment = {
                id: Math.random().toString(),
                postId: selectedPost.id,
                userId: currentUser?.id || 'guest',
                userName: currentUser?.name || 'Guest User',
                userAvatar: currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
                text,
                language: lang,
                date: new Date().toISOString(),
                status
              };
              setComments(prev => [...prev, newComment]);
            }}
          />
        </section>
      </article>
    );
  };

  const renderHome = () => (
    <div className="max-w-[1600px] mx-auto px-[5vw] py-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-20 reveal-item">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-[1px] bg-cyan-500" />
            <span className="text-[10px] font-orbitron font-black text-cyan-500 uppercase tracking-[0.5em]">Future Terminal</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-orbitron font-black mb-6 bg-gradient-to-r from-cyan-400 via-white to-magenta-400 bg-clip-text text-transparent leading-none tracking-tighter">
            {siteConfig.siteName.split(' ')[0]} <span className="text-white">{siteConfig.siteName.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-slate-400 max-w-xl text-lg md:text-xl font-medium leading-relaxed">
            Navigating the neon frontiers of AI, Design, and Future Tech with high-end curation.
          </p>
        </div>
        <div className="relative group w-full md:w-auto">
          <div className="absolute inset-0 bg-cyan-500/10 blur-2xl group-focus-within:bg-cyan-500/20 transition-all opacity-50" />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
          <input 
            type="text" 
            placeholder={t.search}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="relative glass-panel rounded-2xl pl-12 pr-6 py-5 text-sm focus:outline-none focus:border-cyan-500/50 w-full md:min-w-[450px] shadow-2xl transition-all"
            aria-label="Search posts"
          />
        </div>
      </header>

      {!searchQuery && (
        <section className="mb-24 reveal-item" aria-labelledby="recommended-heading">
            <h2 id="recommended-heading" className="text-2xl md:text-3xl font-orbitron font-black mb-10 flex items-center gap-4">
                <Sparkles className="text-magenta-500" /> {t.recommended}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {recommendedPosts.map((post, i) => (
                    <PostCard 
                      key={`rec-${post.id}`} 
                      post={post} 
                      lang={lang} 
                      onClick={() => handlePostClick(post)} 
                      onLike={() => toggleLike(post.id)}
                      isLiked={(currentUser?.likedPosts || []).includes(post.id)}
                      isRecommended={true} 
                    />
                ))}
            </div>
        </section>
      )}

      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12" aria-label="Latest posts grid">
        {posts
          .filter(p => p.title[lang].toLowerCase().includes(searchQuery.toLowerCase()))
          .map((post, i) => (
          <div key={post.id} className="reveal-item" style={{ animationDelay: `${i * 0.08}s` }}>
              <PostCard 
                post={post} 
                lang={lang} 
                onClick={() => handlePostClick(post)} 
                onLike={() => toggleLike(post.id)}
                isLiked={(currentUser?.likedPosts || []).includes(post.id)}
              />
          </div>
        ))}
      </main>
    </div>
  );

  const renderContent = () => {
    switch (path) {
      case 'home': return renderHome();
      case 'saudi-helper': return renderSaudiHelper();
      case 'ai-tools':
        return (
          <div className="max-w-[1400px] mx-auto px-[5vw] py-24">
            <h1 className="text-5xl md:text-7xl font-orbitron font-black mb-12 text-center neon-text-cyan reveal-item">AI TOOLBOX</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {AI_TOOLS.map((tool, i) => (
                    <article key={tool.name} className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-cyan-500/30 transition-all reveal-item" style={{ animationDelay: `${i * 0.05}s` }}>
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-400" /> {tool.name}</h3>
                        <p className="text-slate-400 text-sm mb-6">{tool.uses}</p>
                        <a href={tool.url} target="_blank" rel="noreferrer" className="text-cyan-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group">Visit {tool.name} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform"/></a>
                    </article>
                ))}
            </div>
          </div>
        );
      case 'news':
        return (
          <div className="max-w-[1400px] mx-auto px-[5vw] py-24">
            <h1 className="text-5xl md:text-7xl font-orbitron font-black mb-12 reveal-item">VIRAL <span className="neon-text-cyan">NEWS</span></h1>
            <AdminNewsGenerator lang={lang} onAddNewsAsPost={(news) => {
                const newPost: Post = {
                    id: Math.random().toString(),
                    title: { en: news.headline, bn: news.headline, ar: news.headline },
                    summary: { en: news.summary, bn: news.summary, ar: news.summary },
                    content: { en: news.summary, bn: news.summary, ar: news.summary },
                    author: 'AI Reporter',
                    date: new Date().toISOString(),
                    image: `https://picsum.photos/seed/${Math.random()}/1200/600`,
                    category: 'AI',
                    priority: 5,
                    tags: ['AI', 'News'],
                    views: 0,
                    likes: 0,
                    seo: { title: news.headline, description: news.summary, keywords: [], robots: 'index, follow' }
                };
                addPost(newPost);
                setPath('home');
            }} />
          </div>
        );
      case 'admin':
        if (currentUser?.role !== 'admin') return <div className="p-24 text-center text-red-500 font-orbitron">MISSION CRITICAL: ACCESS DENIED</div>;
        return (
            <div className="max-w-[1400px] mx-auto px-[5vw] py-24 space-y-16">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div>
                      <h1 className="text-4xl md:text-6xl font-orbitron font-black neon-text-magenta reveal-item">MISSION CONTROL</h1>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-2 reveal-item">Dashboard Alpha V5</p>
                    </div>
                    <button onClick={() => { setEditingPost(null); setIsEditorOpen(true); }} className="px-8 py-3 rounded-2xl bg-cyan-500 text-black font-orbitron font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)] flex items-center gap-3 reveal-item"><FilePlus className="w-5 h-5" /> INITIALIZE TRANSMISSION</button>
                </header>
                <AdminAnalytics posts={posts} comments={comments} lang={lang} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <AIImageGenerator onGenerated={(url) => {}} />
                    <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 reveal-item">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-orbitron font-bold flex items-center gap-3"><Lightbulb className="text-yellow-400" /> AI IDEA ENGINE</h3>
                            <button onClick={handleFetchSuggestions} disabled={loadingSuggestions} className="relative px-4 py-2 rounded-xl bg-yellow-500/10 text-yellow-500 font-orbitron font-bold text-[10px] border border-yellow-500/30 hover:bg-yellow-500 hover:text-black transition-all flex items-center gap-2 min-w-[150px] justify-center">{loadingSuggestions ? <QuantumSpinner size="sm" color="white" /> : "GENERATE IDEAS"}</button>
                        </div>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {aiSuggestions.length === 0 ? <p className="text-center py-12 text-slate-500 text-xs font-orbitron uppercase">NO IDEAS SYNTHESIZED</p> : aiSuggestions.map((idea, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-yellow-500/30 transition-all">
                                    <h4 className="font-bold text-sm text-yellow-100 mb-1">{idea.potentialTitle}</h4>
                                    <p className="text-[10px] text-slate-500 mb-3">{idea.reason}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="px-2 py-0.5 rounded-lg bg-yellow-500/10 text-[8px] font-orbitron font-black text-yellow-500 uppercase">{idea.topic}</span>
                                        <button onClick={() => { setEditingPost({ title: { en: idea.potentialTitle, bn: '', ar: '' }, summary: { en: idea.reason, bn: '', ar: '' }, content: { en: '', bn: '', ar: '' }, category: idea.topic, seo: { title: idea.potentialTitle, description: idea.reason, keywords: [], robots: 'index, follow' } } as any); setIsEditorOpen(true); }} className="text-[8px] font-orbitron font-black text-cyan-400 hover:text-white uppercase flex items-center gap-1">DRAFT POST <ArrowRight className="w-2 h-2" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {isEditorOpen && <PostEditor lang={lang} initialPost={editingPost || undefined} onSave={(post) => { if (editingPost) { deletePost(editingPost.id); addPost(post); } else { addPost(post); } setIsEditorOpen(false); setEditingPost(null); }} onCancel={() => { setIsEditorOpen(false); setEditingPost(null); }} />}
            </div>
        );
      case 'profile':
        if (!currentUser) return null;
        return (
            <div className="max-w-[1200px] mx-auto px-[5vw] py-24">
                <header className="glass-panel p-12 rounded-[3rem] text-center mb-12 reveal-item">
                    <img src={currentUser.avatar} className="w-32 h-32 md:w-48 md:h-48 rounded-full mx-auto mb-8 border-4 border-cyan-500 shadow-2xl" alt={currentUser.name} />
                    <h1 className="text-4xl md:text-6xl font-orbitron font-black mb-2">{currentUser.name}</h1>
                    <p className="text-cyan-400 font-orbitron text-xs md:text-sm uppercase tracking-widest mb-8">{currentUser.role}</p>
                </header>
                <section className="glass-panel p-8 rounded-[2.5rem] mb-12 reveal-item">
                    <h2 className="text-xl font-orbitron font-bold flex items-center gap-3 mb-6"><Bell className="text-cyan-400" /> SUBSCRIPTION HUB</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {['Daily Digest', 'AI Trends', 'New Comments'].map(topic => (
                            <div key={topic} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-sm font-bold">{topic}</span>
                                <button onClick={() => { const currentSubs = currentUser.subscriptions || []; const newSubs = currentSubs.includes(topic) ? currentSubs.filter(s => s !== topic) : [...currentSubs, topic]; setCurrentUser({...currentUser, subscriptions: newSubs}); }} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${(currentUser.subscriptions || []).includes(topic) ? 'bg-cyan-500 text-black shadow-[0_0_10px_#00f3ff]' : 'bg-white/5 text-slate-500'}`}>{ (currentUser.subscriptions || []).includes(topic) ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" /> }</button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        );
      case 'post-detail': return renderPostDetail();
      case 'login': return (
        <div className="min-h-[80vh] flex items-center justify-center px-[5vw]">
            <div className="w-full max-w-md glass-panel p-10 rounded-[3rem] border border-white/10 reveal-item">
                <header className="text-center mb-10">
                    {isSignUp ? <UserPlus className="w-12 h-12 text-magenta-400 mx-auto mb-6" /> : <Key className="w-12 h-12 text-cyan-400 mx-auto mb-6" />}
                    <h2 className="text-2xl font-orbitron font-bold tracking-tight">{isSignUp ? 'New Account Protocol' : 'Secure Access'}</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Firebase Auth Protocol Active</p>
                </header>
                {isAuthLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-6">
                    <QuantumSpinner size="lg" color={isSignUp ? "magenta" : "cyan"} />
                    <p className="text-[10px] font-orbitron font-black text-cyan-500 animate-pulse tracking-[0.2em] uppercase">Synchronizing...</p>
                  </div>
                ) : (
                  <form onSubmit={handleAuthAction} className="space-y-6">
                      {isSignUp && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-orbitron font-black text-slate-500 uppercase tracking-widest px-2">Display Name</label>
                          <input type="text" placeholder="Quantum Explorer" required value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full bg-black/40 p-4 rounded-2xl border border-white/10 focus:border-magenta-500/50 focus:outline-none transition-colors text-white" />
                        </div>
                      )}
                      <div className="space-y-2">
                        <label className="text-[10px] font-orbitron font-black text-slate-500 uppercase tracking-widest px-2">Email Address</label>
                        <input type="email" placeholder="raihankhanpro@gmail.com" required value={email} onChange={e => setEmail(e.target.value)} className={`w-full bg-black/40 p-4 rounded-2xl border border-white/10 ${isSignUp ? 'focus:border-magenta-500/50' : 'focus:border-cyan-500/50'} focus:outline-none transition-colors text-white`} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-orbitron font-black text-slate-500 uppercase tracking-widest px-2">Security Key</label>
                        <input type="password" placeholder="••••••••" required value={password} onChange={e => setPassword(e.target.value)} className={`w-full bg-black/40 p-4 rounded-2xl border border-white/10 ${isSignUp ? 'focus:border-magenta-500/50' : 'focus:border-cyan-500/50'} focus:outline-none transition-colors text-white`} />
                      </div>
                      {authError && <p className="text-xs text-red-500 text-center font-bold uppercase tracking-tighter bg-red-500/10 p-3 rounded-xl border border-red-500/20">{authError}</p>}
                      <button className={`w-full py-5 rounded-2xl ${isSignUp ? 'bg-magenta-500 shadow-[0_0_20px_rgba(255,0,255,0.4)]' : 'bg-cyan-500 shadow-[0_0_20px_rgba(0,243,255,0.4)]'} text-black font-orbitron font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95`}>{isSignUp ? 'REGISTER ID' : 'INITIALIZE ACCESS'}</button>
                      <div className="pt-4 text-center">
                        <button type="button" onClick={() => { setIsSignUp(!isSignUp); setAuthError(''); }} className="text-[10px] font-orbitron font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                          {isSignUp ? 'Already have credentials? Access Terminal' : 'No account? Register New Identity'}
                        </button>
                      </div>
                  </form>
                )}
            </div>
        </div>
      );
      default: return renderHome();
    }
  };

  return (
    <div className={`min-h-screen text-slate-100 selection:bg-cyan-500 selection:text-black ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      <Navbar lang={lang} setLang={setLang} user={currentUser} currentPath={path} setPath={setPath} onLogout={handleLogout} config={siteConfig} />
      <main id="main-content" className="relative z-10 pt-16 overflow-x-hidden min-h-screen">{renderContent()}</main>
      <AIChatbot /><ScrollToTop />
      <footer className="relative z-10 border-t border-white/10 py-24 glass-panel mt-24">
        <div className="max-w-[1600px] mx-auto px-[5vw] text-center">
            <div className="font-orbitron font-black text-3xl md:text-5xl mb-8 tracking-tighter reveal-item">RAIHAN KHAN <span className="neon-text-cyan">ONLINE</span></div>
            <nav className="flex justify-center flex-wrap gap-8 mb-16 reveal-item">{SOCIAL_HANDLES.map(s => (<a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors uppercase font-orbitron text-[10px] md:text-xs font-bold tracking-[0.2em]">{s.name}</a>))}</nav>
            <p className="text-[10px] text-slate-600 font-orbitron tracking-[0.4em] uppercase reveal-item">© 2025 ALL RIGHTS RESERVED • ENGINEERED BY RAIHAN KHAN • V5.0 GEMINI INTELLIGENCE</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
