'use client';
import { useState } from 'react';
import { MediaDetails } from '@/types/tmdb';
import { VideoPlayer } from '@/components/media/VideoPlayer';
import { TrailerModal } from '@/components/media/TrailerModal';
import { CastSection } from '@/components/media/CastSection';
import { Play, PlayCircle, Video } from 'lucide-react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/tmdb';

export function MovieClient({ movie }: { movie: MediaDetails }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);

  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '';

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-4 py-8">
      <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden border border-zinc-800 bg-void-950 group">
        {!isPlaying && (
          <div className="absolute inset-0 z-10 cursor-pointer" onClick={() => setIsPlaying(true)}>
            <Image src={getImageUrl(movie.backdrop_path || movie.poster_path, 'original')} alt={movie.title || ''} fill className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-700" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-crimson-500 text-white rounded-full p-6 shadow-2xl shadow-crimson-500/20 group-hover:scale-110 transition-transform duration-500">
                <Play className="w-12 h-12 fill-current ml-2" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 right-6">
              <h1 className="text-4xl md:text-6xl font-display font-black leading-tight drop-shadow-xl">{movie.title}</h1>
              <p className="mt-2 text-zinc-300 max-w-2xl line-clamp-2 md:line-clamp-3 text-lg drop-shadow-md">{movie.overview}</p>
            </div>
          </div>
        )}
        <div className={`w-full h-full ${!isPlaying ? 'opacity-0 pointer-events-none absolute inset-0' : 'opacity-100 relative'}`}>
           <VideoPlayer type="movie" id={movie.id.toString()} title={movie.title} poster={movie.poster_path} />
        </div>
      </div>
      
      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-3 space-y-8">
          {isPlaying && (
            <div>
              <h1 className="text-3xl md:text-5xl font-display font-black leading-tight">
                {movie.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-zinc-400 mt-4">
                <span className="text-green-500 font-bold">{(movie.vote_average * 10).toFixed(0)}% Match</span>
                <span>{movie.release_date?.substring(0, 4)}</span>
                <span>{runtime}</span>
                <span className="border border-zinc-700 px-1.5 py-0.5 rounded text-[10px] uppercase">HD</span>
              </div>
              <p className="text-zinc-300 text-lg leading-relaxed max-w-3xl mt-4">
                {movie.overview}
              </p>
            </div>
          )}
          
          <CastSection cast={movie.credits?.cast} />
        </div>
        
        <div className="space-y-6">
          {trailer && (
            <button
              onClick={() => setTrailerOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-void-900 hover:bg-void-800 border border-zinc-800 text-white px-4 py-3 rounded-xl transition-colors font-bold uppercase tracking-wider text-sm"
            >
              <Video size={18} /> Watch Trailer
            </button>
          )}

          <div>
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Genres</h4>
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((g: { id: number, name: string }) => (
                <span key={g.id} className="text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-md">{g.name}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <TrailerModal isOpen={trailerOpen} onClose={() => setTrailerOpen(false)} videoKey={trailer?.key || null} />
    </div>
  );
}
