import { tmdb, getImageUrl } from '@/lib/tmdb';
import { VideoPlayer } from '@/components/media/VideoPlayer';
import { MediaGrid } from '@/components/media/MediaGrid';
import { Star, Clock, Calendar } from 'lucide-react';
import Image from 'next/image';

export default async function MovieWatchPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const movie = await tmdb.getDetails('movie', params.id);
  const similar = movie.similar?.results?.slice(0, 6) || [];
  
  const title = movie.title || movie.name;
  const year = movie.release_date?.slice(0, 4);
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-24 flex flex-col gap-8">
      <VideoPlayer type="movie" id={params.id} />
      
      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-3 space-y-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-black mb-2">{title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 font-medium">
              {year && <span className="flex items-center gap-1"><Calendar size={14} /> {year}</span>}
              {runtime && <span className="flex items-center gap-1"><Clock size={14} /> {runtime}</span>}
              <span className="flex items-center gap-1 text-yellow-500 fill-yellow-500"><Star size={14} className="fill-current" /> {movie.vote_average?.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {movie.genres?.map(g => (
              <span key={g.id} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm">
                {g.name}
              </span>
            ))}
          </div>
          
          <p className="text-lg text-white/80 leading-relaxed max-w-4xl">
            {movie.overview}
          </p>
        </div>
        
        <div className="hidden md:block">
          <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <Image
              src={getImageUrl(movie.poster_path, 'w500')}
              alt={title || ''}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
      
      {similar.length > 0 && (
        <div className="pt-8 border-t border-white/10">
          <MediaGrid title="Similar Movies" items={similar} />
        </div>
      )}
    </div>
  );
}
