
export type Language = 'en' | 'bn' | 'ar';

export interface NavigationItem {
  id: string;
  name: Record<Language, string>;
  path: string;
  isCustom: boolean;
}

export interface SiteConfig {
  siteName: string;
  logoUrl: string;
  fontFamily: 'Inter' | 'Orbitron' | 'Space Grotesk' | 'Roboto';
  baseFontSize: number;
  neonColor: string;
  navItems: NavigationItem[];
}

export interface Post {
  id: string;
  title: Record<Language, string>;
  content: Record<Language, string>;
  summary: Record<Language, string>;
  author: string;
  date: string;
  image: string;
  videoUrl?: string;
  category: string;
  priority: number;
  tags: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
    robots?: string; // index, follow, etc.
    ogImage?: string; // Custom Open Graph image
  };
  views: number;
  likes: number;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  language: Language;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface UserHistoryItem {
  postId: string;
  viewedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'editor' | 'user';
  bio?: string;
  interests: string[];
  history: UserHistoryItem[];
  subscriptions: string[];
}

export interface HelpItem {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  url: string;
  category: 'government' | 'utility' | 'shopping' | 'transport';
  simpleGuide: Record<Language, string>;
}

export interface AISuggestion {
  topic: string;
  reason: string;
  potentialTitle: string;
}
