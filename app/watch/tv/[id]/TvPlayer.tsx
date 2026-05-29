'use client';
import { useState, useEffect, Suspense, useCallback } from 'react';
import { MediaDetails } from '@/types/tmdb';
import { getImageUrl } from '@/lib/tmdb';
import { getSeasonDetailsAction } from '@/app/actions';
import { VideoPlayer } from '@/components/media/VideoPlayer';
import { ChevronDown, Play, Star, CheckCircle2, Circle } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useWatchHistory } from '@/hooks/useWatchHistory';
import { storage } from '@/lib/storage';

import { TrailerModal } from '@/components/media/TrailerModal';
import { CastSection } from '@/components/media/CastSection';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useFavorites } from '@/hooks/useFavorites';
import { Bookmark, Heart, Video } from 'lucide-react';

function TvPlayerContent({ show }: { show: MediaDetails }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [season, setSeason] = useState(parseInt(searchParams.get('season') || '1'));
  const [episode, setEpisode] = useState(parseInt(searchParams.get('episode') || '1'));
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { history, addToHistory } = useWatchHistory();
  const [isPlaying, setIsPlaying] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);

  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const idStr = show.id.toString();
  const onWatchlist = isInWatchlist(idStr);
  const onFavorites = isFavorite(idStr);

  useEffect(() => {
    getSeasonDetailsAction(show.id.toString(), season).then(data => {
      setEpisodes(data.episodes || []);
    });
  }, [show.id, season]);

  // If URL params change via back/forward, resync
  useEffect(() => {
    const s = searchParams.get('season');
    const e = searchParams.get('episode');
    if (s) setSeason(parseInt(s));
    if (e) setEpisode(parseInt(e));
  }, [searchParams]);

  const goToEpisode = useCallback((s: number, e: number) => {
    setSeason(s);
    setEpisode(e);
    setIsPlaying(true); // Auto-play when explicitly selecting episode
    router.replace(`/watch/tv/${show.id}?season=${s}&episode=${e}`, { scroll: false });
  }, [router, show.id]);

  const playNextEpisode = useCallback(() => {
    const currentEpIndex = episodes.findIndex(ep => ep.episode_number === episode);
    if (currentEpIndex >= 0 && currentEpIndex < episodes.length - 1) {
      const nextEp = episodes[currentEpIndex + 1];
      goToEpisode(season, nextEp.episode_number);
    } else if (currentEpIndex === episodes.length - 1) {
      const currentSeasonIndex = show.seasons?.findIndex(s => s.season_number === season) ?? -1;
      if (currentSeasonIndex >= 0 && currentSeasonIndex < (show.seasons?.length || 0) - 1) {
         const nextSeasonIndex = show.seasons![currentSeasonIndex + 1];
         if (nextSeasonIndex.season_number > 0) {
             goToEpisode(nextSeasonIndex.season_number, 1);
         }
      }
    }
  }, [episodes, episode, season, goToEpisode, show.seasons]);

  const handleProgress = useCallback((progress: number) => {
     // Nothing needed here if VideoPlayer handles autoPlay
  }, []);

  const hasNextEpisode = () => {
    const currentEpIndex = episodes.findIndex(ep => ep.episode_number === episode);
    if (currentEpIndex >= 0 && currentEpIndex < episodes.length - 1) return true;
    if (currentEpIndex === episodes.length - 1) {
      const currentSeasonIndex = show.seasons?.findIndex(s => s.season_number === season) ?? -1;
      if (currentSeasonIndex >= 0 && currentSeasonIndex < (show.seasons?.length || 0) - 1) {
         const nextSeasonIndex = show.seasons![currentSeasonIndex + 1];
         if (nextSeasonIndex.season_number > 0) return true;
      }
    }
    return false;
  };

  const toggleWatched = (ep: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const isWatched = history.some(i => i.id === show.id.toString() && i.season === season && i.episode === ep.episode_number && (i.progress || 0) >= 95);
    
    addToHistory({
      id: show.id.toString(),
      type: 'tv',
      title: show.name,
      poster: show.poster_path,
      timestamp: Date.now(),
      season,
      episode: ep.episode_number,
      progress: isWatched ? 0 : 100 // Toggle 100% vs 0%
    });
  };

  const currentSeason = show.seasons?.find(s => s.season_number === season);
  const trailer = show.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

  const watchItem = history.find(i => i.id === show.id.toString() && i.season === season && i.episode === episode);
  const progress = watchItem?.progress || 0;
  const isWatched = progress >= 95;
  const continueWatching = progress > 0 && !isWatched;

  return (
    <div className="flex flex-col gap-12 w-full max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-6">
          <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden border border-zinc-800 bg-void-950 group">
            {!isPlaying && (
              <div className="absolute inset-0 z-10">
                {trailer ? (
                  <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none opacity-60">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.key}&modestbranding=1&rel=0&playsinline=1`}
                      className="w-[300%] h-[300%] -translate-x-1/3 -translate-y-1/3 absolute top-1/2 left-1/2"
                      allow="autoplay"
                      frameBorder="0"
                    />
                  </div>
                ) : (
                  <Image src={getImageUrl(show.backdrop_path || show.poster_path, 'original')} alt={show.name || ''} fill className="object-cover opacity-60" priority />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/20 to-transparent pointer-events-none" />
              </div>
            )}
            <div className={`w-full h-full ${!isPlaying ? 'opacity-0 pointer-events-none absolute inset-0' : 'opacity-100 relative z-20'}`}>
               <VideoPlayer 
                  type="tv" 
                  id={show.id.toString()} 
                  season={season} 
                  episode={episode} 
                  title={show.name} 
                  poster={show.poster_path} 
                  onProgress={handleProgress} 
                  onPlayNext={playNextEpisode}
                  hasNextEpisode={hasNextEpisode()}
               />
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between flex-wrap gap-6">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-display font-black leading-tight mb-2">
                  {show.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-zinc-400">
                  <span className="text-green-500 font-bold">{(show.vote_average * 10).toFixed(0)}% Match</span>
                  <span>{show.first_air_date?.substring(0, 4)}</span>
                  <span>{show.number_of_seasons} Seasons</span>
                  <span className="border border-zinc-700 bg-void-900 px-1.5 py-0.5 rounded text-[10px] uppercase">HD</span>
                  {show.episode_run_time?.[0] ? <span>~{show.episode_run_time[0]}m per EP</span> : null}
                  {show.status && <span className="border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 rounded text-[10px] uppercase">{show.status}</span>}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {show.genres?.map((g: any) => (
                    <span key={g.id} className="text-xs font-medium text-zinc-300 bg-void-900 border border-zinc-800 px-2 py-1 rounded-md">{g.name}</span>
                  ))}
                </div>

                {show.created_by && show.created_by.length > 0 && (
                  <div className="mt-4 text-sm">
                    <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] block mb-1">Created By</span>
                    <div className="text-zinc-300 flex gap-2 flex-wrap">
                      {show.created_by.map((c: any) => c.name).join(', ')}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-3 min-w-[200px] shrink-0">
                {!isPlaying && (
                  <button 
                    onClick={() => setIsPlaying(true)}
                    className="w-full flex items-center justify-center gap-2 bg-crimson-500 hover:bg-crimson-600 text-white px-6 py-3 rounded-xl transition-colors font-bold uppercase tracking-wider text-sm shadow-xl shadow-crimson-500/20"
                  >
                    <Play fill="currentColor" size={20} />
                    {continueWatching ? 'Continue Watching' : 'Play'}
                  </button>
                )}
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {trailer && (
                    <button
                      onClick={() => setTrailerOpen(true)}
                      className="col-span-2 flex items-center justify-center gap-2 bg-void-900 hover:bg-void-800 border border-zinc-800 text-white px-4 py-2.5 rounded-xl transition-colors font-bold uppercase tracking-wider text-xs"
                    >
                      <Video size={16} /> Watch Trailer
                    </button>
                  )}
                  <button
                    onClick={() => toggleWatchlist({ id: idStr, type: 'tv', title: show.name, poster: show.poster_path })}
                    className={`flex items-center justify-center gap-1.5 border px-3 py-2.5 rounded-xl transition-colors font-bold uppercase tracking-wider text-[10px] ${onWatchlist ? 'bg-crimson-500/10 border-crimson-500/20 text-crimson-500' : 'bg-void-900 border-zinc-800 hover:bg-void-800 text-zinc-300'}`}
                  >
                    <Bookmark size={14} className={onWatchlist ? 'fill-crimson-500' : ''} /> {onWatchlist ? 'Watchlisted' : 'Watchlist'}
                  </button>
                  <button
                    onClick={() => toggleFavorite({ id: idStr, type: 'tv', title: show.name, poster: show.poster_path })}
                    className={`flex items-center justify-center gap-1.5 border px-3 py-2.5 rounded-xl transition-colors font-bold uppercase tracking-wider text-[10px] ${onFavorites ? 'bg-pink-500/10 border-pink-500/20 text-pink-500' : 'bg-void-900 border-zinc-800 hover:bg-void-800 text-zinc-300'}`}
                  >
                    <Heart size={14} className={onFavorites ? 'fill-pink-500' : ''} /> {onFavorites ? 'Favorited' : 'Favorite'}
                  </button>
                </div>
              </div>
            </div>
            
            <p className="text-zinc-300 text-lg leading-relaxed max-w-4xl">{show.overview}</p>
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
                const isWatched = history.some(i => i.id === show.id.toString() && i.season === season && i.episode === ep.episode_number && (i.progress || 0) >= 95);
                return (
                  <div
                    key={ep.id}
                    onClick={() => goToEpisode(season, ep.episode_number)}
                    role="button"
                    tabIndex={0}
                    className={`w-full flex gap-3 p-3 text-left transition-colors border-b border-zinc-800/50 last:border-0 relative overflow-hidden group cursor-pointer ${isActive ? 'bg-zinc-900/50' : 'hover:bg-zinc-900/30'}`}
                  >
                    <div className="relative w-32 aspect-video bg-void-950 rounded overflow-hidden flex-shrink-0 border border-zinc-800">
                      <Image src={getImageUrl(ep.still_path, 'w500')} alt={ep.name} fill className="object-cover opacity-80" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Play size={16} className={isActive ? "text-crimson-500 fill-crimson-500" : "text-white opacity-0 group-hover:opacity-100 transition-opacity"} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 py-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <h4 className={`text-xs font-semibold truncate pr-2 ${isActive ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                          {ep.episode_number}. {ep.name}
                        </h4>
                        <button onClick={(e) => toggleWatched(ep, e)} className="text-zinc-500 hover:text-white transition-colors" title={isWatched ? "Mark Unwatched" : "Mark Watched"}>
                          {isWatched ? <CheckCircle2 size={16} className="text-crimson-500" /> : <Circle size={16} />}
                        </button>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2 flex-1">{ep.overview}</p>
                      {ep.vote_average > 0 && (
                        <div className="flex items-center gap-1 mt-1 text-[10px] font-medium text-zinc-400">
                          <Star size={10} className="text-yellow-500 fill-yellow-500" /> {ep.vote_average.toFixed(1)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full">
        <CastSection cast={show.credits?.cast} crew={show.credits?.crew} />
      </div>

      <TrailerModal isOpen={trailerOpen} onClose={() => setTrailerOpen(false)} videoKey={trailer?.key || null} />
    </div>
  );
}

export function TvPlayer({ show }: { show: MediaDetails }) {
  return (
    <Suspense fallback={<div className="h-96 w-full max-w-3xl mx-auto rounded-3xl bg-void-900 animate-pulse border border-zinc-800" />}>
      <TvPlayerContent show={show} />
    </Suspense>
  )
}
