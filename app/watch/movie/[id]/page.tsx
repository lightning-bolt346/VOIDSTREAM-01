import { tmdb } from '@/lib/tmdb';
import { MovieClient } from './MovieClient';
import { MediaGrid } from '@/components/media/MediaGrid';

export const dynamic = 'force-dynamic';

export default async function WatchMovie({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await tmdb.getDetails('movie', id);
  const similar = movie.similar?.results?.slice(0, 6) || [];

  return (
    <div className="flex flex-col gap-8 w-full">
      <MovieClient movie={movie} />
      {similar.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 w-full">
           <MediaGrid title="Similar Movies" items={similar} />
        </div>
      )}
    </div>
  );
}
