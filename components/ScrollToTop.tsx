
import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`fixed bottom-28 right-8 z-[90] transition-all duration-500 transform ${
      isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-50 pointer-events-none'
    }`}>
      <button
        onClick={scrollToTop}
        className="group relative w-12 h-12 flex items-center justify-center rounded-2xl glass-panel border border-cyan-500/30 text-cyan-400 hover:text-white hover:border-cyan-400 transition-all hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(0,243,255,0.2)] hover:shadow-[0_0_30px_rgba(0,243,255,0.4)]"
        aria-label="Scroll to top"
      >
        <div className="absolute inset-0 rounded-2xl bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors" />
        <ChevronUp className="w-6 h-6 relative z-10 group-hover:-translate-y-1 transition-transform duration-300" />
      </button>
    </div>
  );
};

export default ScrollToTop;
