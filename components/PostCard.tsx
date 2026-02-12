import React, { useState } from 'react';
import { Post, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { 
  Calendar, Eye, ThumbsUp, ArrowRight, Star, Clock, 
  Share2, Facebook, Twitter, Linkedin, MessageCircle, 
  Link as LinkIcon, Check, X 
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  lang: Language;
  onClick: () => void;
  onLike?: () => void;
  isLiked?: boolean;
  isRecommended?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, lang, onClick, onLike, isLiked, isRecommended }) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = TRANSLATIONS[lang];

  // Construct sharing URLs
  const shareUrl = `${window.location.origin}?post=${post.id}`;
  const shareTitle = post.title[lang];
  
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`
  };

  const handleShareToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShareOpen(!isShareOpen);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stopProp = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <article 
      onClick={onClick}
      className={`group cursor-pointer relative overflow-hidden rounded-[2rem] border glass-card-hover hologram-sweep ${
        isRecommended 
        ? 'border-magenta-500/30 shadow-[0_0_30px_rgba(255,0,255,0.1)] bg-white/5' 
        : 'border-white/5 bg-white/3'
      } transition-all duration-500`}
    >
      {isRecommended && (
        <div className="absolute top-5 left-5 z-20 bg-magenta-600 text-[10px] font-orbitron font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xl border border-white/20 animate-pulse">
          <Star className="w-3 h-3 fill-white" />
          RECOMMENDED
        </div>
      )}
      
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={post.image} 
          alt={`Thumbnail for ${post.title[lang]}`} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
        
        {/* Share Overlay */}
        <div className={`absolute inset-0 z-30 bg-black/80 backdrop-blur-sm transition-all duration-300 flex flex-col items-center justify-center gap-6 ${isShareOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'}`}>
          <button onClick={handleShareToggle} className="absolute top-4 right-4 text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
          <p className="text-[10px] font-orbitron font-black text-cyan-400 uppercase tracking-[0.3em]">Broadcast Transmission</p>
          <div className="flex gap-4">
            <a href={shareLinks.facebook} target="_blank" rel="noreferrer" onClick={stopProp} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-[#1877F2] hover:border-[#1877F2]/40 hover:scale-110 transition-all">
              <Facebook className="w-5 h-5" />
            </a>
            <a href={shareLinks.twitter} target="_blank" rel="noreferrer" onClick={stopProp} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-black hover:border-white/40 hover:scale-110 transition-all">
              <Twitter className="w-5 h-5" />
            </a>
            <a href={shareLinks.linkedin} target="_blank" rel="noreferrer" onClick={stopProp} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-[#0077B5] hover:border-[#0077B5]/40 hover:scale-110 transition-all">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href={shareLinks.whatsapp} target="_blank" rel="noreferrer" onClick={stopProp} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-[#25D366] hover:border-[#25D366]/40 hover:scale-110 transition-all">
              <MessageCircle className="w-5 h-5" />
            </a>
            <button onClick={handleCopy} className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all hover:scale-110 ${copied ? 'bg-green-500/20 text-green-400 border-green-500/40' : 'bg-white/5 text-slate-300 border-white/10 hover:text-cyan-400 hover:border-cyan-500/40'}`}>
              {copied ? <Check className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="absolute top-5 right-5 z-10 flex gap-2">
           <button 
             onClick={handleShareToggle}
             className="glass-panel p-2 rounded-xl border border-white/10 text-white/80 hover:text-cyan-400 hover:border-cyan-500/50 transition-all duration-300"
           >
              <Share2 className="w-4 h-4" />
           </button>
           <div className="glass-panel p-2 rounded-xl border border-white/10 text-white/80 transition-all duration-300">
              <Eye className="w-4 h-4" />
           </div>
        </div>
        
        <div className="absolute bottom-5 left-5 z-10">
          <span className="px-4 py-1.5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[9px] font-black font-orbitron uppercase tracking-widest shadow-2xl group-hover:bg-cyan-500 group-hover:text-black transition-all">
            {post.category}
          </span>
        </div>
      </div>

      <div className="p-7 relative z-10">
        <div className="flex items-center gap-2 mb-4 text-[10px] font-orbitron text-slate-500 font-bold uppercase tracking-[0.2em]">
            <Clock className="w-3 h-3 text-cyan-500/50" />
            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
        </div>

        <h3 className="text-xl md:text-2xl font-bold mb-4 group-hover:text-white transition-colors line-clamp-2 leading-tight tracking-tight min-h-[3rem]">
          {post.title[lang]}
        </h3>
        
        <p className="text-sm text-slate-400 mb-6 line-clamp-3 leading-relaxed font-medium min-h-[4.5rem]">
          {post.summary[lang]}
        </p>

        <footer className="flex items-center justify-between pt-6 border-t border-white/5">
          <div className="flex items-center gap-5 text-[10px] font-orbitron font-bold text-slate-500 tracking-widest">
            <span className="flex items-center gap-1.5 group-hover:text-cyan-400 transition-colors uppercase">
                <Eye className="w-3.5 h-3.5" /> {post.views}
            </span>
            <button 
              onClick={(e) => { e.stopPropagation(); onLike?.(); }}
              className={`flex items-center gap-1.5 transition-colors uppercase ${isLiked ? 'text-magenta-500' : 'hover:text-magenta-500'}`}
            >
                <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} /> {post.likes}
            </button>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-500 group-hover:border-cyan-500 group-hover:text-cyan-400 transition-all group-hover:translate-x-1">
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </div>
        </footer>
      </div>
    </article>
  );
};

export default PostCard;