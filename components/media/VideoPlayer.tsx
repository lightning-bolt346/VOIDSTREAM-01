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

  useEffect(() => {
    const key = `${id}-${season || 'x'}-${episode || 'x'}`;
    if (title && id && hasAddedHistory.current !== key) {
      hasAddedHistory.current = key;
      addToHistory({ id, type, title, poster: poster || null, timestamp: Date.now(), season, episode });
    }
  }, [id, type, title, poster, season, episode, addToHistory]);

  const source = getSource(currentSourceId);
  const embedUrl = source.url(type, id, season, episode);

  return (
    <div className="relative w-full aspect-video bg-void-950 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl group">
      <div 
        className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 ${showSources ? 'opacity-100 bg-black/80 backdrop-blur-sm' : 'opacity-0'}`} 
      />
      <iframe
        src={embedUrl}
        className="w-full h-full border-0"
        allowFullScreen
        allow="autoplay; fullscreen"
        sandbox="allow-same-origin allow-scripts allow-presentation allow-forms"
      />
      
      <div className="absolute top-4 right-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setShowSources(!showSources)}
          className="bg-void-950/80 backdrop-blur text-zinc-300 p-2 rounded-lg hover:text-white hover:bg-void-800 transition-colors border border-zinc-800"
        >
          <Settings size={20} />
        </button>
      </div>

      {showSources && (
        <div className="absolute top-16 right-4 bg-void-950/90 border border-zinc-800 rounded-xl p-2 w-64 shadow-2xl z-50 backdrop-blur-xl">
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
  );
}
