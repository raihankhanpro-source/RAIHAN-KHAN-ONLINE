
import React from 'react';
import { Post, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Calendar, Eye, ThumbsUp, ArrowRight, Star, Clock } from 'lucide-react';

interface PostCardProps {
  post: Post;
  lang: Language;
  onClick: () => void;
  isRecommended?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, lang, onClick, isRecommended }) => {
  const t = TRANSLATIONS[lang];
  
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
        
        <div className="absolute top-5 right-5 z-10">
           <div className="glass-panel p-2 rounded-xl border border-white/10 text-white/80 group-hover:text-cyan-400 group-hover:border-cyan-500/50 transition-all duration-300">
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
            <span className="flex items-center gap-1.5 group-hover:text-magenta-500 transition-colors uppercase">
                <ThumbsUp className="w-3.5 h-3.5" /> {post.likes}
            </span>
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
