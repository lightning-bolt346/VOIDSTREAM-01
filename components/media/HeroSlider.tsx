'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Plus } from 'lucide-react';
import { Media } from '@/types/tmdb';
import { getImageUrl } from '@/lib/tmdb';

export function HeroSlider({ items }: { items: Media[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((p) => (p + 1) % items.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;

  const current = items[currentIndex];
  const title = current.title || current.name;
  const isMovie = current.media_type === 'movie' || !current.name;

  return (
    <div className="relative w-full h-[80vh] min-h-[600px] max-h-[900px] bg-void-950 overflow-hidden flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={getImageUrl(current.backdrop_path, 'original')}
            alt={title || ''}
            fill
            className="object-cover opacity-60"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to right, #0a0a0a 10%, rgba(10,10,10,0.4) 50%, #0a0a0a 90%), linear-gradient(to top, #0a0a0a 10%, transparent 40%)" }} />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex flex-col justify-end px-4 md:px-12 pb-16 h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={`info-${current.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-0.5 bg-zinc-800 text-[10px] font-bold tracking-widest uppercase rounded">
                {current.media_type || 'Media'}
              </span>
              <span className="text-crimson-500 text-[10px] font-bold tracking-widest uppercase">
                Trending Now
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 leading-[0.9]">
              {title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-zinc-400 font-medium">
              <span className="flex items-center gap-1 text-green-500 font-bold italic">{(current.vote_average * 10).toFixed(0)}% Match</span>
              <span>{current.release_date?.slice(0, 4) || current.first_air_date?.slice(0, 4)}</span>
              <span className="border border-zinc-700 px-1.5 py-0.5 rounded text-[10px]">HD</span>
            </div>
            
            <p className="text-zinc-300 text-base md:text-lg leading-relaxed mb-8 max-w-lg line-clamp-3">
              {current.overview}
            </p>
            
            <div className="flex items-center gap-4">
              <Link 
                href={`/watch/${isMovie ? 'movie' : 'tv'}/${current.id}`}
                className="bg-crimson-500 text-white px-8 py-3.5 rounded flex items-center gap-3 font-bold hover:bg-[#b90812] transition-colors"
              >
                <Play size={20} className="fill-current" />
                Play Now
              </Link>
              <button
                className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-8 py-3.5 rounded flex items-center gap-3 font-bold hover:bg-white/20 transition-colors"
              >
                <Plus size={20} />
                My List
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Slider Indicators */}
      <div className="absolute bottom-6 right-8 md:right-12 flex gap-2 z-20">
        {items.slice(0, 5).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? 'w-8 bg-crimson-500' : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
