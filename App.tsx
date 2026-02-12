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
import { auth, initializeAnalytics } from './services/firebase';
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

  useEffect(() => {
    initializeAnalytics();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const matchedUser = users.find(u => u.email === firebaseUser.email);
        if (matchedUser) {
          setCurrentUser({
            ...matchedUser,
            id: firebaseUser.uid,
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('post');
    if (postId && posts.length > 0) {
      const post = posts.find(p => p.id === postId);
      if (post) {
        handlePostClick(post);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [posts]);

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
      }

      document.title = title;
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
    } finally {
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
              <a href={item.url} target="_blank" rel="noreferrer" className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-emerald-500 hover:text-black transition-all">
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
    const shareUrl = window.location.origin + '?post=' + selectedPost.id;
    const shareTitle = selectedPost.title[lang];
    const isLiked = (currentUser?.likedPosts || []).includes(selectedPost.id);

    return (
      <article className="max-w-4xl mx-auto px-[5vw] py-24">
        <nav className="mb-12">
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
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight text-white">{selectedPost.title[lang]}</h1>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-6 border-y border-white/5">
            <div className="flex items-center gap-4 text-slate-500 font-orbitron text-[10px] uppercase">
              <span>By {selectedPost.author}</span>
              <span>•</span>
              <span>{selectedPost.views} Views</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => toggleLike(selectedPost.id)}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all border ${isLiked ? 'bg-magenta-500/20 text-magenta-500 border-magenta-500/40' : 'bg-white/5 text-slate-400 border-white/10'}`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </header>
        
        <div className="prose prose-invert max-w-none text-slate-300 text-lg md:text-xl leading-loose space-y-8 mb-20">
          {selectedPost.content[lang]}
        </div>

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
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-orbitron font-black mb-6 leading-none tracking-tighter">
            {siteConfig.siteName.split(' ')[0]} <span className="neon-brand-highlight">{siteConfig.siteName.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-slate-400 max-w-xl text-lg md:text-xl font-medium leading-relaxed">
            Navigating the neon frontiers of AI, Design, and Future Tech.
          </p>
        </div>
        <div className="relative group w-full md:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder={t.search}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="glass-panel rounded-2xl pl-12 pr-6 py-5 text-sm focus:outline-none focus:border-cyan-500/50 w-full md:min-w-[450px]"
          />
        </div>
      </header>

      {!searchQuery && (
        <section className="mb-24 reveal-item">
            <h2 className="text-2xl md:text-3xl font-orbitron font-black mb-10 flex items-center gap-4">
                <Sparkles className="text-magenta-500" /> {t.recommended}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {recommendedPosts.map((post) => (
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

      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
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
                    <article key={tool.name} className="glass-panel p-8 rounded-3xl border border-white/5 reveal-item" style={{ animationDelay: `${i * 0.05}s` }}>
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-400" /> {tool.name}</h3>
                        <p className="text-slate-400 text-sm mb-6">{tool.uses}</p>
                        <a href={tool.url} target="_blank" rel="noreferrer" className="text-cyan-400 text-[10px] font-black uppercase flex items-center gap-2">Visit {tool.name} <ArrowRight className="w-3 h-3"/></a>
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
      case 'post-detail': return renderPostDetail();
      case 'login': return (
        <div className="min-h-[80vh] flex items-center justify-center px-[5vw]">
            <div className="w-full max-w-md glass-panel p-10 rounded-[3rem] border border-white/10 reveal-item">
                <header className="text-center mb-10">
                    {isSignUp ? <UserPlus className="w-12 h-12 text-magenta-400 mx-auto mb-6" /> : <Key className="w-12 h-12 text-cyan-400 mx-auto mb-6" />}
                    <h2 className="text-2xl font-orbitron font-bold tracking-tight">{isSignUp ? 'New Protocol' : 'Terminal Access'}</h2>
                </header>
                <form onSubmit={handleAuthAction} className="space-y-6">
                    {isSignUp && (
                      <input type="text" placeholder="Name" required value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full bg-black/40 p-4 rounded-2xl border border-white/10" />
                    )}
                    <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black/40 p-4 rounded-2xl border border-white/10" />
                    <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/40 p-4 rounded-2xl border border-white/10" />
                    {authError && <p className="text-xs text-red-500 text-center">{authError}</p>}
                    <button className="w-full py-5 rounded-2xl bg-cyan-500 text-black font-orbitron font-black uppercase tracking-widest">{isSignUp ? 'Register' : 'Login'}</button>
                    <div className="text-center">
                      <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-[10px] font-orbitron text-slate-500 uppercase">
                        {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
                      </button>
                    </div>
                </form>
            </div>
        </div>
      );
      default: return renderHome();
    }
  };

  return (
    <div className={`min-h-screen text-slate-100 ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      <Navbar lang={lang} setLang={setLang} user={currentUser} currentPath={path} setPath={setPath} onLogout={handleLogout} config={siteConfig} />
      <main className="relative z-10 pt-16 min-h-screen">{renderContent()}</main>
      <AIChatbot /><ScrollToTop />
      <footer className="relative z-10 border-t border-white/10 py-24 glass-panel mt-24">
        <div className="max-w-[1600px] mx-auto px-[5vw] text-center">
            <div className="font-orbitron font-black text-3xl md:text-5xl mb-8 tracking-tighter">
              RAIHAN KHAN <span className="neon-brand-highlight">ONLINE</span>
            </div>
            <p className="text-[10px] text-slate-600 font-orbitron tracking-[0.4em] uppercase">© 2025 ALL RIGHTS RESERVED • ENGINEERED BY RAIHAN KHAN</p>
        </div>
      </footer>
    </div>
  );
};

export default App;