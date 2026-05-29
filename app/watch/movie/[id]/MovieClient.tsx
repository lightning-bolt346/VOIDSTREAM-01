'use client';
import { useState } from 'react';
import { MediaDetails } from '@/types/tmdb';
import { VideoPlayer } from '@/components/media/VideoPlayer';
import { TrailerModal } from '@/components/media/TrailerModal';
import { CastSection } from '@/components/media/CastSection';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useFavorites } from '@/hooks/useFavorites';
import { Bookmark, Heart, Play, PlayCircle, Video } from 'lucide-react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/tmdb';
import { useWatchHistory } from '@/hooks/useWatchHistory';

export function MovieClient({ movie }: { movie: MediaDetails }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);

  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { history } = useWatchHistory();
  const idStr = movie.id.toString();
  const onWatchlist = isInWatchlist(idStr);
  const onFavorites = isFavorite(idStr);

  const watchItem = history.find(i => i.id === idStr);
  const progress = watchItem?.progress || 0;
  const isWatched = progress >= 95;
  const continueWatching = progress > 0 && !isWatched;

  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '';

  return (
    <div className="flex flex-col gap-12 w-full max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
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
                  <Image src={getImageUrl(movie.backdrop_path || movie.poster_path, 'original')} alt={movie.title || ''} fill className="object-cover opacity-60" priority />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/20 to-transparent pointer-events-none" />
              </div>
            )}
            <div className={`w-full h-full ${!isPlaying ? 'opacity-0 pointer-events-none absolute inset-0' : 'opacity-100 relative z-20'}`}>
               <VideoPlayer type="movie" id={movie.id.toString()} title={movie.title} poster={movie.poster_path} />
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between flex-wrap gap-6">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-display font-black leading-tight mb-2">
                  {movie.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-zinc-400">
                  <span className="text-green-500 font-bold">{(movie.vote_average * 10).toFixed(0)}% Match</span>
                  <span>{movie.release_date?.substring(0, 4)}</span>
                  <span>{runtime}</span>
                  <span className="border border-zinc-700 bg-void-900 px-1.5 py-0.5 rounded text-[10px] uppercase">HD</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {movie.genres?.map((g: { id: number, name: string }) => (
                    <span key={g.id} className="text-xs font-medium text-zinc-300 bg-void-900 border border-zinc-800 px-2 py-1 rounded-md">{g.name}</span>
                  ))}
                </div>
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
                    onClick={() => toggleWatchlist({ id: idStr, type: 'movie', title: movie.title, poster: movie.poster_path })}
                    className={`flex items-center justify-center gap-1.5 border px-3 py-2.5 rounded-xl transition-colors font-bold uppercase tracking-wider text-[10px] ${onWatchlist ? 'bg-crimson-500/10 border-crimson-500/20 text-crimson-500' : 'bg-void-900 border-zinc-800 hover:bg-void-800 text-zinc-300'}`}
                  >
                    <Bookmark size={14} className={onWatchlist ? 'fill-crimson-500' : ''} /> {onWatchlist ? 'Watchlisted' : 'Watchlist'}
                  </button>
                  <button
                    onClick={() => toggleFavorite({ id: idStr, type: 'movie', title: movie.title, poster: movie.poster_path })}
                    className={`flex items-center justify-center gap-1.5 border px-3 py-2.5 rounded-xl transition-colors font-bold uppercase tracking-wider text-[10px] ${onFavorites ? 'bg-pink-500/10 border-pink-500/20 text-pink-500' : 'bg-void-900 border-zinc-800 hover:bg-void-800 text-zinc-300'}`}
                  >
                    <Heart size={14} className={onFavorites ? 'fill-pink-500' : ''} /> {onFavorites ? 'Favorited' : 'Favorite'}
                  </button>
                </div>
              </div>
            </div>
            
            <p className="text-zinc-300 text-lg leading-relaxed max-w-4xl">{movie.overview}</p>
          </div>
        </div>
      </div>
      
      <div className="w-full">
        <CastSection cast={movie.credits?.cast} crew={movie.credits?.crew} />
      </div>

      <TrailerModal isOpen={trailerOpen} onClose={() => setTrailerOpen(false)} videoKey={trailer?.key || null} />
    </div>
  );
}
