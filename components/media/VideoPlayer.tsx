'use client';
import { useState } from 'react';
import { getSource, sources } from '@/lib/sources';
import { Settings, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VideoPlayerProps {
  type: 'movie' | 'tv';
  id: string;
  season?: number;
  episode?: number;
}

export function VideoPlayer({ type, id, season, episode }: VideoPlayerProps) {
  const [currentSourceId, setCurrentSourceId] = useState(sources[0].id);
  const [showSources, setShowSources] = useState(false);

  const source = getSource(currentSourceId);
  const embedUrl = source.url(type, id, season, episode);

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group border border-white/5 shadow-2xl">
      <iframe
        src={embedUrl}
        className="w-full h-full border-0"
        allowFullScreen
        allow="autoplay; fullscreen"
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
            className="absolute top-16 right-4 bg-void-900 border border-white/10 rounded-xl p-2 w-64 shadow-xl z-50 backdrop-blur-xl"
          >
            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 px-2 pt-1">
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
                      ? 'bg-crimson-500 text-white font-medium' 
                      : 'hover:bg-white/10 text-white/80'
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
