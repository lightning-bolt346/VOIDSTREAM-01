import { tmdb } from '@/lib/tmdb';
import { MediaGrid } from '@/components/media/MediaGrid';

export const dynamic = 'force-dynamic';

export default async function MoviesPage() {
  const popMovies = await tmdb.getPopular('movie');
  const topMovies = await tmdb.getTopRated('movie');
  return (
    <div className="flex flex-col min-h-screen pb-20 pt-8">
      <div className="px-4 md:px-12 mb-8">
        <h1 className="text-4xl font-display font-black">Movies</h1>
      </div>
      <MediaGrid title="Popular" items={popMovies.results} />
      <MediaGrid title="Top Rated" items={topMovies.results} />
    </div>
  );
}
