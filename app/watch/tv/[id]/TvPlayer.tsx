'use client';
import { useState, useEffect } from 'react';
import { MediaDetails } from '@/types/tmdb';
import { tmdb, getImageUrl } from '@/lib/tmdb';
import { VideoPlayer } from '@/components/media/VideoPlayer';
import { ChevronDown, Play } from 'lucide-react';
import Image from 'next/image';

export function TvPlayer({ show }: { show: MediaDetails }) {
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    tmdb.getSeasonDetails(show.id.toString(), season).then(data => {
      setEpisodes(data.episodes || []);
    });
  }, [show.id, season]);

  const currentSeason = show.seasons?.find(s => s.season_number === season);

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      <div className="flex-1 flex flex-col gap-6">
        <VideoPlayer type="tv" id={show.id.toString()} season={season} episode={episode} title={show.name} poster={show.poster_path} />
        <div>
          <h1 className="text-3xl md:text-5xl font-display font-black mb-4 leading-tight">{show.name}</h1>
          <p className="text-zinc-300 text-lg leading-relaxed max-w-3xl">{show.overview}</p>
        </div>
      </div>
      
      <div className="w-full xl:w-96 flex flex-col gap-4">
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between bg-void-950 border border-zinc-800 rounded-xl px-4 py-3 font-semibold text-sm hover:border-zinc-600 transition-colors shadow-lg active:scale-[0.98]"
          >
            <span>{currentSeason?.name || `Season ${season}`}</span>
            <ChevronDown size={16} className={`text-zinc-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-void-950 border border-zinc-800 rounded-xl overflow-hidden z-50 max-h-96 overflow-y-auto custom-scrollbar shadow-2xl">
                {show.seasons?.filter(s => s.season_number > 0).map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setSeason(s.season_number); setEpisode(1); setDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors ${
                      season === s.season_number ? 'text-crimson-500 font-semibold' : 'text-zinc-300'
                    }`}
                  >
                    {s.name} <span className="text-zinc-600 ml-2 text-xs font-normal">({s.episode_count} Episodes)</span>
                  </button>
                ))}
              </div>
          )}
        </div>
        
        <div className="bg-void-950 rounded-xl border border-zinc-800 overflow-hidden flex flex-col max-h-[600px] shadow-lg">
          <div className="p-4 border-b border-zinc-800">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Episodes</h3>
          </div>
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {episodes.map(ep => {
              const isActive = ep.episode_number === episode;
              return (
                <button
                  key={ep.id}
                  onClick={() => setEpisode(ep.episode_number)}
                  className={`w-full flex gap-3 p-3 text-left transition-colors border-b border-zinc-800/50 last:border-0 relative overflow-hidden group ${isActive ? 'bg-zinc-900/50' : 'hover:bg-zinc-900/30'}`}
                >
                  <div className="relative w-32 aspect-video bg-void-950 rounded overflow-hidden flex-shrink-0 border border-zinc-800">
                    <Image src={getImageUrl(ep.still_path, 'w500')} alt={ep.name} fill className="object-cover opacity-80" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <Play size={16} className={isActive ? "text-crimson-500 fill-crimson-500" : "text-white opacity-0 group-hover:opacity-100 transition-opacity"} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <h4 className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                      {ep.episode_number}. {ep.name}
                    </h4>
                    <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2">{ep.overview}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
