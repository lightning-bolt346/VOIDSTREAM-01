'use client';
import { useState, useEffect, useRef } from 'react';
import { getSource, sources } from '@/lib/sources';
import { Settings, Maximize2 } from 'lucide-react';
import { useWatchHistory } from '@/hooks/useWatchHistory';

interface VideoPlayerProps {
  type: 'movie' | 'tv';
  id: string;
  season?: number;
  episode?: number;
  title?: string;
  poster?: string | null;
}

export function VideoPlayer({ type, id, season, episode, title, poster }: VideoPlayerProps) {
  const [currentSourceId, setCurrentSourceId] = useState(sources[0].id);
  const [showSources, setShowSources] = useState(false);
  const { addToHistory } = useWatchHistory();

  const hasAddedHistory = useRef<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const key = `${id}-${season || 'x'}-${episode || 'x'}`;
    if (title && id && hasAddedHistory.current !== key) {
      hasAddedHistory.current = key;
      addToHistory({ id, type, title, poster: poster || null, timestamp: Date.now(), season, episode, progress: 0 });
      setProgress(0);
    }
  }, [id, type, title, poster, season, episode, addToHistory]);

  useEffect(() => {
    // Cannot track real progress of external iframe. Simulate progress for UI if active.
    const interval = setInterval(() => {
      setProgress(p => {
        const nextP = Math.min(100, p + (100 / (45 * 60))); // Assume 45mins total
        if (title && id && Math.floor(nextP) > Math.floor(p)) {
           addToHistory({ id, type, title, poster: poster || null, timestamp: Date.now(), season, episode, progress: nextP });
        }
        return nextP;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [id, type, title, poster, season, episode, addToHistory]);

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

  const source = getSource(currentSourceId);
  const embedUrl = source.url(type, id, season, episode);

  return (
    <div className="flex flex-col gap-4 relative">
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
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 px-2 pt-1 border-b border-zinc-800 pb-2">Select Source</h4>
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
          </div>
        )}
      </div>
    </div>
  );
}
