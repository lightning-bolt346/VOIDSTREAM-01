'use client';
import { useState, useEffect, useRef } from 'react';
import { getSource, sources } from '@/lib/sources';
import { Settings, HelpCircle, Check, X, Heart, Copy, Monitor } from 'lucide-react';
import { useWatchHistory } from '@/hooks/useWatchHistory';
import { storage } from '@/lib/storage';
import { useFavorites } from '@/hooks/useFavorites';
import { motion } from 'motion/react';

interface VideoPlayerProps {
  type: 'movie' | 'tv';
  id: string;
  season?: number;
  episode?: number;
  title?: string;
  poster?: string | null;
  onProgress?: (progress: number) => void;
}

export function VideoPlayer({ type, id, season, episode, title, poster, onProgress }: VideoPlayerProps) {
  const [currentSourceId, setCurrentSourceId] = useState(sources[0].id);
  const [showSources, setShowSources] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [quality, setQuality] = useState<'HD' | 'SD'>('HD');
  
  const { addToHistory, history } = useWatchHistory();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(id);

  const hasAddedHistory = useRef<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setAutoPlayNext(storage.get().settings?.autoPlayNext ?? true);
  }, []);

  const toggleAutoPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newAutoPlay = !autoPlayNext;
    setAutoPlayNext(newAutoPlay);
    storage.set({ settings: { ...storage.get().settings, autoPlayNext: newAutoPlay } });
  };

  useEffect(() => {
    const key = `${id}-${season || 'x'}-${episode || 'x'}`;
    if (title && id && hasAddedHistory.current !== key) {
      hasAddedHistory.current = key;
      const existingHistory = storage.get().history || [];
      const item = existingHistory.find(h => h.id === id && h.season === season && h.episode === episode);
      const startProgress = item?.progress || 0;
      
      addToHistory({ id, type, title, poster: poster || null, timestamp: Date.now(), season, episode, progress: startProgress });
      setProgress(startProgress);
    }
  }, [id, type, title, poster, season, episode, addToHistory]);

  const progressRef = useRef(progress);
  useEffect(() => { progressRef.current = progress; }, [progress]);

  useEffect(() => {
    const saveProgress = () => {
       if (title && id) {
           addToHistory({ id, type, title, poster: poster || null, timestamp: Date.now(), season, episode, progress: progressRef.current });
       }
    };
    window.addEventListener('beforeunload', saveProgress);
    return () => {
       window.removeEventListener('beforeunload', saveProgress);
       saveProgress();
    };
  }, [id, type, title, poster, season, episode, addToHistory]);

  useEffect(() => {
    // Cannot track real progress of external iframe. Simulate progress for UI if active.
    const interval = setInterval(() => {
      setProgress(p => {
        const nextP = Math.min(100, p + (100 / (45 * 60))); // Assume 45mins total
        if (title && id && Math.floor(nextP) > Math.floor(p)) {
           addToHistory({ id, type, title, poster: poster || null, timestamp: Date.now(), season, episode, progress: nextP });
        }
        if (onProgress && Math.floor(nextP) > Math.floor(p)) {
          onProgress(nextP);
        }
        return nextP;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [id, type, title, poster, season, episode, addToHistory, onProgress]);

  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(100);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering when typing in inputs
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      
      switch(e.key.toLowerCase()) {
        case '?':
          e.preventDefault();
          setShowHelp(true);
          break;
        case 'Escape':
          if (showHelp) setShowHelp(false);
          break;
        case ' ':
        case 'k':
          e.preventDefault();
          showToast("Play/Pause (External players may not support this)");
          break;
        case 'arrowright':
        case 'l':
          e.preventDefault();
          showToast("+10 Seconds");
          break;
        case 'arrowleft':
        case 'j':
          e.preventDefault();
          showToast("-10 Seconds");
          break;
        case 'arrowup':
          e.preventDefault();
          setVolume(v => { const nv = Math.min(100, v + 10); showToast(`Volume: ${nv}%`); return nv; });
          break;
        case 'arrowdown':
          e.preventDefault();
          setVolume(v => { const nv = Math.max(0, v - 10); showToast(`Volume: ${nv}%`); return nv; });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTouchZone = (side: 'left' | 'right') => {
    let lastTap = 0;
    let startY = 0;
    return {
      onTouchStart: (e: React.TouchEvent) => {
        const now = Date.now();
        if (now - lastTap < 300) {
          showToast(side === 'left' ? "-10 Seconds" : "+10 Seconds");
        }
        lastTap = now;
        startY = e.touches[0].clientY;
      },
      onTouchMove: (e: React.TouchEvent) => {
        const deltaY = startY - e.touches[0].clientY;
        if (Math.abs(deltaY) > 5) { // Threshold
          startY = e.touches[0].clientY; // Reset for continuous drag
          if (side === 'right') {
            setVolume(v => { const nv = Math.max(0, Math.min(100, v + (deltaY > 0 ? 2 : -2))); showToast(`Volume: ${Math.round(nv)}%`); return nv; });
          } else {
            setBrightness(b => { const nb = Math.max(20, Math.min(150, b + (deltaY > 0 ? 2 : -2))); showToast(`Brightness: ${Math.round(nb)}%`); return nb; });
          }
        }
      }
    };
  };

  const copyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard!");
      setShowSources(false);
    }
  };

  const source = getSource(currentSourceId);
  const embedUrl = source.url(type, id, season, episode);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col gap-4 relative"
    >
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-black/80 text-white px-6 py-3 rounded-full font-bold tracking-widest text-sm backdrop-blur-md animate-in fade-in slide-in-from-top-4 pointer-events-none">
          {toastMessage}
        </div>
      )}
      <div className="flex md:hidden items-center justify-between bg-void-950 border border-zinc-800 rounded-xl px-4 py-3 pb-3">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Server:</span>
        <select 
          className="bg-transparent border-none text-sm text-zinc-300 font-medium focus:ring-0 cursor-pointer text-right appearance-none custom-select pl-4 outline-none"
          value={currentSourceId}
          onChange={(e) => setCurrentSourceId(e.target.value)}
        >
          {sources.map(s => (
            <option key={s.id} value={s.id} className="bg-void-950 text-zinc-300">{s.name}</option>
          ))}
        </select>
      </div>

      <div className="relative w-full aspect-video bg-void-950 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl group">
        <div className="absolute inset-y-0 left-0 w-1/6 z-30" {...handleTouchZone('left')} />
        <div className="absolute inset-y-0 right-0 w-1/6 z-30 flex items-start justify-end" {...handleTouchZone('right')}>
          <div className="hidden md:flex gap-2 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
               onClick={(e) => { e.stopPropagation(); toggleFavorite({ id, type, title: title || '', poster }); }}
               className={`bg-void-950/80 backdrop-blur p-2 rounded-lg transition-colors border border-zinc-800 pointer-events-auto ${isFav ? 'text-pink-500 hover:text-pink-400' : 'text-zinc-300 hover:text-white hover:bg-void-800'}`}
               title="Toggle Favorite"
            >
              <Heart size={20} className={isFav ? "fill-pink-500" : ""} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowSources(!showSources); }}
              className="bg-void-950/80 backdrop-blur text-zinc-300 p-2 rounded-lg hover:text-white hover:bg-void-800 transition-colors border border-zinc-800 pointer-events-auto"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        <div 
          className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 ${showSources ? 'opacity-100 bg-black/80 backdrop-blur-sm' : 'opacity-0'}`} 
        />
        <iframe
          src={embedUrl}
          className="w-full h-full border-0 transition-all duration-300 pointer-events-auto"
          style={{ filter: `brightness(${brightness}%)` }}
          allowFullScreen
          allow="autoplay; fullscreen"
        />
        
        {showSources && (
          <div className="hidden md:block absolute top-16 right-4 bg-void-950/90 border border-zinc-800 rounded-xl p-2 w-64 shadow-2xl z-50 backdrop-blur-xl">
            <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-zinc-800 mb-2">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Select Source</h4>
              <button 
                onClick={toggleAutoPlay}
                title="Toggle Auto-Play Next Episode"
                className={`text-[10px] uppercase font-bold flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${autoPlayNext ? 'bg-crimson-500/20 text-crimson-500' : 'bg-zinc-800 text-zinc-400'}`}
              >
                Auto-Play {autoPlayNext ? <Check size={12} /> : <X size={12} />}
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {sources.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setCurrentSourceId(s.id); setShowSources(false); }}
                  className={`px-3 py-2 text-sm text-left rounded-lg transition-colors ${
                    s.id === currentSourceId ? 'bg-crimson-500 text-white font-medium shadow-lg' : 'hover:bg-white/5 text-zinc-300 hover:text-white'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-zinc-800 flex flex-col gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); setQuality(q => q === 'HD' ? 'SD' : 'HD'); }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-left rounded-lg hover:bg-white/5 text-zinc-300 hover:text-white transition-colors"
                title="Toggle Quality"
              >
                <Monitor size={16} className="text-zinc-400" /> Quality: <span className="text-white font-bold ml-auto">{quality}</span>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); copyShareLink(); }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-left rounded-lg hover:bg-white/5 text-zinc-300 hover:text-white transition-colors"
                title="Copy Share Link"
              >
                <Copy size={16} className="text-zinc-400" /> Copy Share Link
              </button>
            </div>
          </div>
        )}

        {showHelp && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in" onClick={() => setShowHelp(false)}>
            <div className="bg-void-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2"><HelpCircle size={20} className="text-crimson-500" /> Keyboard Shortcuts</h3>
                <button onClick={() => setShowHelp(false)} className="text-zinc-500 hover:text-white p-1"><X size={20} /></button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center"><span className="text-zinc-400">Play/Pause</span><kbd className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs">Space / K</kbd></div>
                <div className="flex justify-between items-center"><span className="text-zinc-400">Seek +10s</span><kbd className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs">→ / L</kbd></div>
                <div className="flex justify-between items-center"><span className="text-zinc-400">Seek -10s</span><kbd className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs">← / J</kbd></div>
                <div className="flex justify-between items-center"><span className="text-zinc-400">Volume Up</span><kbd className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs">↑</kbd></div>
                <div className="flex justify-between items-center"><span className="text-zinc-400">Volume Down</span><kbd className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs">↓</kbd></div>
                <div className="flex justify-between items-center"><span className="text-zinc-400">Toggle Help</span><kbd className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs">?</kbd></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
