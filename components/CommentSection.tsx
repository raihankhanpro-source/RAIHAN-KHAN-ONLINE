
import React, { useState } from 'react';
import { Comment, Language, User } from '../types';
import { TRANSLATIONS } from '../constants';
import { Send, Clock, ShieldCheck, Flag, ShieldX, CheckCircle } from 'lucide-react';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  lang: Language;
  user: User | null;
  onAddComment: (text: string) => Promise<void>;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, comments, lang, user, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = TRANSLATIONS[lang];

  // Filtering Logic: 
  // 1. Regular Users: See approved comments + their own pending/rejected ones.
  // 2. Admins: See everything for this post.
  const postComments = comments.filter(c => {
    if (c.postId !== postId) return false;
    if (user?.role === 'admin') return true;
    return c.status === 'approved' || c.userId === user?.id;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    await onAddComment(newComment);
    setNewComment('');
    setIsSubmitting(false);
  };

  return (
    <div className="mt-12 border-t border-white/10 pt-8">
      <h3 className="text-2xl font-bold font-orbitron mb-8 flex items-center gap-3">
        {t.comments}
        <span className="text-sm px-2 py-0.5 rounded bg-zinc-800 text-slate-400">{postComments.length}</span>
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isSubmitting}
              placeholder={t.leaveComment}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-cyan-500/50 min-h-[100px] resize-none transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="absolute bottom-4 right-4 p-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-all shadow-lg disabled:opacity-50 disabled:scale-90"
            >
              {isSubmitting ? <Clock className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </form>
      ) : (
        <div className="p-6 rounded-xl border border-dashed border-white/20 text-center text-slate-400 mb-10 font-orbitron text-xs uppercase tracking-widest">
          Please login to join the conversation.
        </div>
      )}

      <div className="space-y-6">
        {postComments.map(comment => (
          <div key={comment.id} className={`flex gap-4 group p-4 rounded-2xl transition-all ${comment.status === 'rejected' ? 'opacity-50 grayscale bg-red-500/5' : 'hover:bg-white/3'}`}>
            <img 
              src={comment.userAvatar} 
              alt={comment.userName} 
              className="w-10 h-10 rounded-full border border-white/10 shadow-lg"
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-sm ${comment.userId === user?.id ? 'text-cyan-400' : 'text-white'}`}>
                    {comment.userName}
                  </span>
                  
                  {/* Status Badges for Admin or Owner */}
                  {(user?.role === 'admin' || user?.id === comment.userId) && (
                    <>
                      {comment.status === 'pending' && (
                        <span className="text-[8px] uppercase font-black font-orbitron text-yellow-500 flex items-center gap-1 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                          <Clock className="w-2.5 h-2.5" /> {t.pending}
                        </span>
                      )}
                      {comment.status === 'rejected' && (
                        <span className="text-[8px] uppercase font-black font-orbitron text-red-500 flex items-center gap-1 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                          <ShieldX className="w-2.5 h-2.5" /> REJECTED
                        </span>
                      )}
                      {user?.role === 'admin' && comment.status === 'approved' && (
                        <span className="text-[8px] uppercase font-black font-orbitron text-green-500 flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                          <CheckCircle className="w-2.5 h-2.5" /> MODERATED
                        </span>
                      )}
                    </>
                  )}
                </div>
                <span className="text-[10px] text-slate-600 font-mono">{new Date(comment.date).toLocaleDateString()}</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                {comment.text}
              </p>
              <div className="flex items-center gap-4 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-[10px] font-orbitron font-black text-slate-500 hover:text-cyan-400 flex items-center gap-1 uppercase tracking-widest transition-colors">
                  Reply
                </button>
                <button className="text-[10px] font-orbitron font-black text-slate-500 hover:text-red-400 flex items-center gap-1 uppercase tracking-widest transition-colors">
                  <Flag className="w-3 h-3" /> Report
                </button>
              </div>
            </div>
          </div>
        ))}

        {postComments.length === 0 && (
          <div className="py-20 text-center text-slate-600 text-xs font-orbitron uppercase tracking-[0.2em] italic">
            0 TRANSMISSIONS RECORDED
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
