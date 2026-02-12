
import React from 'react';
import { Language, User, SiteConfig } from '../types';
import { TRANSLATIONS } from '../constants';
import { Globe, Menu, X, LogOut, HeartHandshake } from 'lucide-react';

interface NavbarProps {
  lang: Language;
  setLang: (l: Language) => void;
  user: User | null;
  currentPath: string;
  setPath: (p: string) => void;
  onLogout: () => void;
  config: SiteConfig;
}

const Navbar: React.FC<NavbarProps> = ({ lang, setLang, user, currentPath, setPath, onLogout, config }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setPath('home')}
        >
          {config.logoUrl ? (
            <img src={config.logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
          ) : (
            <div className="w-10 h-10 rounded bg-gradient-to-tr from-cyan-500 to-magenta-500 flex items-center justify-center font-orbitron font-black text-xl shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all group-hover:scale-110">
              RK
            </div>
          )}
          <span className="font-orbitron font-bold text-lg hidden sm:block tracking-tighter">
            {config.siteName.split(' ')[0]} <span className="neon-text-cyan">{config.siteName.split(' ').slice(1).join(' ')}</span>
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          {config.navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setPath(item.path)}
              className={`font-orbitron text-[10px] uppercase tracking-[0.15em] transition-all relative py-1 ${
                currentPath === item.path ? 'neon-text-cyan' : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.name[lang] || item.name['en']}
              {currentPath === item.path && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-500 shadow-[0_0_8px_#00f3ff]" />
              )}
            </button>
          ))}
          {user && (user.role === 'admin' || user.role === 'editor') && (
            <button
              onClick={() => setPath('admin')}
              className={`font-orbitron text-[10px] uppercase tracking-[0.15em] transition-all relative py-1 ${
                currentPath === 'admin' ? 'neon-text-cyan' : 'text-slate-400 hover:text-white font-bold'
              }`}
            >
              ADMIN
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors flex items-center gap-1 border border-white/10">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-bold uppercase">{lang}</span>
            </button>
            <div className="absolute right-0 top-full mt-2 hidden group-hover:block glass-panel rounded-xl shadow-2xl p-2 w-32 border border-white/10">
              {(['en', 'bn', 'ar'] as Language[]).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`w-full text-left px-3 py-2 text-[10px] uppercase hover:bg-white/10 rounded-lg transition-colors ${lang === l ? 'text-cyan-400 font-bold' : ''}`}
                >
                  {l === 'en' ? 'English' : l === 'bn' ? 'বাংলা' : 'العربية'}
                </button>
              ))}
            </div>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setPath('profile')}
                className="w-8 h-8 rounded-full border border-cyan-500/50 overflow-hidden hover:scale-105 transition-transform"
              >
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </button>
              <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setPath('login')}
              className="px-4 py-1.5 rounded-full border border-cyan-500/50 text-cyan-400 font-orbitron text-[10px] hover:bg-cyan-500 hover:text-black transition-all"
            >
              LOGIN
            </button>
          )}

          <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden glass-panel border-t border-white/10 p-4 absolute w-full top-16 left-0">
          <div className="flex flex-col gap-4">
            {config.navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setPath(item.path); setIsOpen(false); }}
                className={`font-orbitron text-left text-xs uppercase tracking-widest ${
                  currentPath === item.path ? 'neon-text-cyan' : 'text-slate-400'
                }`}
              >
                {item.name[lang] || item.name['en']}
              </button>
            ))}
            {user && (user.role === 'admin' || user.role === 'editor') && (
               <button onClick={() => { setPath('admin'); setIsOpen(false); }} className="font-orbitron text-left text-xs uppercase tracking-widest text-cyan-400">ADMIN</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
