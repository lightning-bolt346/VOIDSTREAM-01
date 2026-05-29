'use client';
import { useState, useEffect } from 'react';
import { VideoPlayer } from '@/components/media/VideoPlayer';
import { MediaDetails, Season } from '@/types/tmdb';
import { ChevronDown, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getImageUrl } from '@/lib/tmdb';
import Image from 'next/image';

interface TvPlayerProps {
  show: MediaDetails;
}

export function TvPlayer({ show }: TvPlayerProps) {
  const [season, setSeason] = useState(show.seasons?.find(s => s.season_number > 0)?.season_number || 1);
  const [episode, setEpisode] = useState(1);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    async function fetchSeason() {
      setLoading(true);
      try {
        const res = await fetch(`/api/tmdb/tv/${show.id}/season/${season}`);
        const data = await res.json();
        setEpisodes(data.episodes || []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    fetchSeason();
  }, [season, show.id]);

  const currentSeason = show.seasons?.find(s => s.season_number === season);
  
  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* Main Player Area */}
      <div className="flex-1 flex flex-col gap-6">
        <VideoPlayer type="tv" id={show.id.toString()} season={season} episode={episode} />
        
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black mb-2">{show.name}</h1>
          <p className="text-xl text-white/60 mb-4 font-medium">
            Season {season} • Episode {episode}
          </p>
          <p className="text-white/80 leading-relaxed max-w-4xl">
            {episodes.find(e => e.episode_number === episode)?.overview || show.overview}
          </p>
        </div>
      </div>
      
      {/* Episodes Sidebar */}
      <div className="w-full xl:w-96 flex flex-col gap-4">
        {/* Season Selector */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between bg-void-900 border border-white/10 rounded-xl px-4 py-3 font-semibold text-lg hover:bg-void-800 transition-colors"
          >
            <span>{currentSeason?.name || `Season ${season}`}</span>
            <ChevronDown size={20} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-void-900 border border-white/10 rounded-xl overflow-hidden z-50 max-h-96 overflow-y-auto custom-scrollbar shadow-2xl"
              >
                {show.seasons?.filter(s => s.season_number > 0).map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSeason(s.season_number);
                      setEpisode(1);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors ${
                      season === s.season_number ? 'bg-crimson-500/20 text-crimson-400 font-medium' : ''
                    }`}
                  >
                    {s.name} ({s.episode_count} Episodes)
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Episodes List */}
        <div className="bg-void-900 rounded-xl border border-white/5 overflow-hidden flex flex-col max-h-[600px]">
          <div className="p-4 border-b border-white/5 bg-void-950/50">
            <h3 className="font-semibold text-white/80">Episodes</h3>
          </div>
          
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {loading ? (
              <div className="p-8 text-center text-white/50 animate-pulse">Loading episodes...</div>
            ) : (
              <div className="flex flex-col">
                {episodes.map(ep => {
                  const isActive = ep.episode_number === episode;
                  return (
                    <button
                      key={ep.id}
                      onClick={() => setEpisode(ep.episode_number)}
                      className={`flex gap-3 p-3 text-left transition-colors border-b border-white/5 last:border-0 relative overflow-hidden group ${
                        isActive ? 'bg-white/10' : 'hover:bg-white/5'
                      }`}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="active-episode" 
                          className="absolute left-0 top-0 bottom-0 w-1 bg-crimson-500" 
                        />
                      )}
                      
                      <div className="relative w-32 aspect-video bg-void-950 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={getImageUrl(ep.still_path, 'w500')}
                          alt={ep.name}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          {isActive ? <Play size={20} className="text-crimson-500 fill-crimson-500" /> : <Play size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />}
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-center flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className={`text-sm font-semibold truncate ${isActive ? 'text-crimson-400' : 'text-white'}`}>
                            {ep.episode_number}. {ep.name}
                          </h4>
                        </div>
                        <p className="text-xs text-white/50 mt-1 line-clamp-2">
                          {ep.overview}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
