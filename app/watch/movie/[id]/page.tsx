import { tmdb } from '@/lib/tmdb';
import { VideoPlayer } from '@/components/media/VideoPlayer';
import { MediaGrid } from '@/components/media/MediaGrid';

export const dynamic = 'force-dynamic';

export default async function WatchMovie({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await tmdb.getDetails('movie', id);
  const similar = movie.similar?.results?.slice(0, 6) || [];
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8 w-full">
      <VideoPlayer type="movie" id={id} title={movie.title} poster={movie.poster_path} />
      
      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-3 space-y-6">
          <h1 className="text-3xl md:text-5xl font-display font-black leading-tight">
            {movie.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-zinc-400">
            <span className="text-green-500 font-bold">{(movie.vote_average * 10).toFixed(0)}% Match</span>
            <span>{movie.release_date?.substring(0, 4)}</span>
            <span>{runtime}</span>
            <span className="border border-zinc-700 px-1.5 py-0.5 rounded text-[10px] uppercase">HD</span>
          </div>
          <p className="text-zinc-300 text-lg leading-relaxed max-w-3xl">
            {movie.overview}
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-1">Genres</h4>
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map(g => (
                <span key={g.id} className="text-xs font-medium text-zinc-300">{g.name}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {similar.length > 0 && <MediaGrid title="Similar Movies" items={similar} />}
    </div>
  );
}
