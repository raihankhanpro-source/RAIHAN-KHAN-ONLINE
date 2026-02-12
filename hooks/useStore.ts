
import { useState, useEffect, useCallback } from 'react';
import { Post, Comment, User, Language, UserHistoryItem, SiteConfig, NavigationItem } from '../types';

const DEFAULT_CONFIG: SiteConfig = {
  siteName: 'RAIHAN KHAN ONLINE',
  logoUrl: '',
  fontFamily: 'Inter',
  baseFontSize: 16,
  neonColor: '#00f3ff',
  navItems: [
    { id: '1', name: { en: 'Home', bn: 'হোম', ar: 'الرئيسية' }, path: 'home', isCustom: false },
    { id: '2', name: { en: 'Saudi Helper', bn: 'সৌদি হেল্পার', ar: 'مساعد السعودية' }, path: 'saudi-helper', isCustom: false },
    { id: '3', name: { en: 'AI Tools', bn: 'সেরা এআই টুলস', ar: 'أدوات الذكاء الاصطناعي' }, path: 'ai-tools', isCustom: false },
    { id: '4', name: { en: 'AI News', bn: 'এআই নিউজ', ar: 'أخبار الذكاء الاصطناعي' }, path: 'news', isCustom: false }
  ]
};

const INITIAL_USER: User = {
  id: 'super-admin',
  name: 'Raihan Khan',
  email: 'raihankhanpro@gmail.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raihan',
  role: 'admin',
  interests: ['AI', 'Tech'],
  history: [],
  subscriptions: []
};

export function useStore() {
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('rk_posts');
    return saved ? JSON.parse(saved) : [];
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('rk_comments');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('rk_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('rk_all_users');
    return saved ? JSON.parse(saved) : [INITIAL_USER];
  });

  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('rk_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('rk_lang') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('rk_posts', JSON.stringify(posts));
    localStorage.setItem('rk_comments', JSON.stringify(comments));
    localStorage.setItem('rk_user', JSON.stringify(currentUser));
    localStorage.setItem('rk_all_users', JSON.stringify(users));
    localStorage.setItem('rk_config', JSON.stringify(siteConfig));
    localStorage.setItem('rk_lang', lang);
  }, [posts, comments, currentUser, users, siteConfig, lang]);

  const updateConfig = (newConfig: Partial<SiteConfig>) => setSiteConfig(prev => ({ ...prev, ...newConfig }));
  
  const addPost = (post: Post) => setPosts(prev => [post, ...prev]);
  const deletePost = (id: string) => setPosts(prev => prev.filter(p => p.id !== id));
  
  const addUser = (user: User) => setUsers(prev => [...prev, user]);
  const deleteUser = (id: string) => setUsers(prev => prev.filter(u => u.id !== id));

  const incrementView = useCallback((postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, views: p.views + 1 } : p));
  }, []);

  return {
    posts, addPost, deletePost,
    comments, setComments,
    currentUser, setCurrentUser,
    users, addUser, deleteUser,
    siteConfig, updateConfig,
    lang, setLang,
    incrementView
  };
}
