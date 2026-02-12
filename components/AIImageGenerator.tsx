
import React, { useState } from 'react';
import { generateAIImage } from '../services/gemini';
import { Sparkles, Download, Image as ImageIcon, Layout, ArrowRight, Key, PlusCircle } from 'lucide-react';
import QuantumSpinner from './QuantumSpinner';

const ASPECT_RATIOS = ["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"];

const AIImageGenerator: React.FC<{ onGenerated: (url: string) => void }> = ({ onGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [ratio, setRatio] = useState('16:9');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    if (!(await (window as any).aistudio?.hasSelectedApiKey?.())) {
        try {
            await (window as any).aistudio?.openSelectKey?.();
        } catch (e) {
            setError("Billing setup required: ai.google.dev/gemini-api/docs/billing");
            return;
        }
    }

    setLoading(true);
    setError(null);
    try {
      const url = await generateAIImage(prompt, ratio);
      setPreview(url);
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found")) {
        setError("API Key Error. Please re-select a paid project key.");
        await (window as any).aistudio?.openSelectKey?.();
      } else {
        setError("Quantum engine failure. Verify your paid billing status.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-orbitron font-bold flex items-center gap-3">
            <Sparkles className="text-magenta-400" /> CREATIVE STUDIO
          </h3>
          <p className="text-[10px] text-slate-500 font-orbitron uppercase tracking-widest mt-1">PRO-GRADE IMAGE SYNTHESIS</p>
        </div>
        <div className="flex gap-2">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-500" title="Billing Info">
                <Key className="w-4 h-4" />
            </a>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-[10px] font-orbitron font-black text-slate-400 uppercase tracking-widest mb-3 block">Neural Prompt</label>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe your vision (e.g., 'A cyberpunk street in futuristic Riyadh at night, 4k, neon lights')..."
            className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-magenta-500/50 min-h-[120px] resize-none"
          />
        </div>

        <div>
          <label className="text-[10px] font-orbitron font-black text-slate-400 uppercase tracking-widest mb-3 block">Aspect Ratio</label>
          <div className="flex flex-wrap gap-2">
            {ASPECT_RATIOS.map(r => (
              <button
                key={r}
                onClick={() => setRatio(r)}
                className={`px-4 py-2 rounded-xl text-[10px] font-orbitron font-bold transition-all ${
                  ratio === r ? 'bg-magenta-500 text-black shadow-[0_0_15px_rgba(255,0,255,0.4)]' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">
                {error}
            </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full py-4 rounded-2xl bg-magenta-500 text-black font-orbitron font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(255,0,255,0.3)] disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading ? (
            <QuantumSpinner size="sm" color="white" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          Initialize Synthesis
        </button>

        {preview && (
          <div className="pt-8 border-t border-white/5 animate-reveal">
            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group">
                <img src={preview} className="w-full h-auto" alt="Generated" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                        onClick={() => onGenerated(preview)}
                        className="px-6 py-3 bg-green-500 text-black font-orbitron font-black text-[10px] rounded-xl hover:scale-110 transition-all flex items-center gap-2"
                    >
                        <PlusCircle className="w-4 h-4" /> USE IN POST
                    </button>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIImageGenerator;
