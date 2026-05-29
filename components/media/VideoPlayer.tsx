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
  onPlayNext?: () => void;
  hasNextEpisode?: boolean;
}

export function VideoPlayer({ type, id, season, episode, title, poster, onProgress, onPlayNext, hasNextEpisode }: VideoPlayerProps) {
  const [currentSourceId, setCurrentSourceId] = useState(sources[0].id);
  const [showSources, setShowSources] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [quality, setQuality] = useState<'HD' | 'SD'>('HD');
  const [showNextOverlay, setShowNextOverlay] = useState(false);
  const [countdown, setCountdown] = useState(10);
  
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
      setShowNextOverlay(false); // Reset overlay
      setCountdown(10);
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
    let countInterval: NodeJS.Timeout;
    const interval = setInterval(() => {
      setProgress(p => {
        const nextP = Math.min(100, p + (100 / (45 * 60))); // Assume 45mins total
        if (title && id && Math.floor(nextP) > Math.floor(p)) {
           addToHistory({ id, type, title, poster: poster || null, timestamp: Date.now(), season, episode, progress: nextP });
        }
        if (onProgress && Math.floor(nextP) > Math.floor(p)) {
          onProgress(nextP);
        }
        
        // Show next overlay if near end and has next episode
        if (type === 'tv' && hasNextEpisode && nextP >= 95 && !showNextOverlay) {
           setShowNextOverlay(true);
        }
        
        return nextP;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [id, type, title, poster, season, episode, addToHistory, onProgress, type, hasNextEpisode, showNextOverlay]);

  useEffect(() => {
    let countInterval: NodeJS.Timeout;
    if (showNextOverlay && countdown > 0) {
      countInterval = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) {
             if (autoPlayNext && onPlayNext) onPlayNext();
             return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countInterval);
  }, [showNextOverlay, countdown, autoPlayNext, onPlayNext]);

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
      
      <div className="flex flex-wrap items-center justify-between gap-4 bg-void-950 border border-zinc-800 rounded-xl px-4 py-3">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Server:</span>
          <select 
            className="bg-void-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-crimson-500 text-zinc-300 font-medium"
            value={currentSourceId}
            onChange={(e) => setCurrentSourceId(e.target.value)}
          >
            {sources.map(s => (
              <option key={s.id} value={s.id} className="bg-void-950 text-zinc-300">{s.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-3">
          <button
             onClick={(e) => { e.stopPropagation(); toggleFavorite({ id, type, title: title || '', poster }); }}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 transition-colors ${isFav ? 'bg-pink-500/10 text-pink-500 border-pink-500/20' : 'bg-void-900 text-zinc-300 hover:text-white hover:bg-void-800'}`}
             title={isFav ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart size={16} className={isFav ? "fill-pink-500" : ""} />
            <span className="text-sm font-medium hidden sm:inline">{isFav ? 'Favorited' : 'Favorite'}</span>
          </button>
          
          <button 
            onClick={toggleAutoPlay}
            title="Toggle Auto-Play Next Episode"
            className={`text-xs uppercase font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${autoPlayNext ? 'bg-crimson-500/10 text-crimson-500 border-crimson-500/20' : 'bg-void-900 border-zinc-800 text-zinc-400 hover:bg-void-800'}`}
          >
            Auto-Play {autoPlayNext ? <Check size={14} /> : <X size={14} />}
          </button>
        </div>
      </div>

      <div className="relative w-full aspect-video md:aspect-[21/9] bg-black rounded-xl overflow-hidden border border-zinc-800 shadow-2xl group">
        <div className="absolute inset-y-0 left-0 w-1/6 z-30" {...handleTouchZone('left')} />
        <div className="absolute inset-y-0 right-0 w-1/6 z-30 flex items-start justify-end" {...handleTouchZone('right')} />

        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full border-0 pointer-events-auto"
          style={{ filter: `brightness(${brightness}%)` }}
          allowFullScreen
          allow="autoplay; fullscreen"
          sandbox="allow-same-origin allow-scripts allow-forms"
        />

        {showNextOverlay && hasNextEpisode && (
          <div className="absolute right-8 bottom-24 z-50 bg-black/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-right-8 pointer-events-auto text-white">
            <h4 className="text-xs uppercase tracking-widest font-bold text-zinc-400 mb-2">Up Next</h4>
            <p className="text-lg font-bold mb-4">Playing in {countdown}s...</p>
            <div className="flex gap-3 items-center">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowNextOverlay(false); }}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); if (onPlayNext) onPlayNext(); }}
                className="px-4 py-2 bg-crimson-500 hover:bg-crimson-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                Play Now
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
