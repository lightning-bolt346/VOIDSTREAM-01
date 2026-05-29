'use client';
import { useState, useEffect } from 'react';
import { getSource, sources } from '@/lib/sources';
import { Settings, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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

  useEffect(() => {
    if (title && id) {
      addToHistory({
        id,
        type,
        title,
        poster: poster || null,
        timestamp: Date.now(),
        season,
        episode
      });
    }
  }, [id, type, title, poster, season, episode, addToHistory]);

  const source = getSource(currentSourceId);
  const embedUrl = source.url(type, id, season, episode);

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group border border-white/5 shadow-2xl">
      <iframe
        src={embedUrl}
        className="w-full h-full border-0"
        allowFullScreen
        allow="autoplay; fullscreen"
        sandbox="allow-same-origin allow-scripts allow-presentation allow-forms"
      />
      
      {/* Overlay controls - shown on hover */}
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4"
        >
          <div className="flex justify-end pointer-events-auto">
            <button 
              onClick={() => setShowSources(!showSources)}
              className="bg-void-950/80 hover:bg-void-900 backdrop-blur text-white p-2 rounded-full border border-white/10 transition-colors"
            >
              <Settings size={20} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showSources && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-16 right-4 bg-void-950/90 border border-zinc-800 rounded-xl p-2 w-64 shadow-2xl z-50 backdrop-blur-xl"
          >
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 px-2 pt-1">
              Select Source
            </h4>
            <div className="flex flex-col gap-1">
              {sources.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setCurrentSourceId(s.id);
                    setShowSources(false);
                  }}
                  className={`px-3 py-2 text-sm text-left rounded-lg transition-colors ${
                    s.id === currentSourceId 
                      ? 'bg-crimson-500 text-white font-medium shadow-lg' 
                      : 'hover:bg-white/5 text-zinc-300 hover:text-white'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
