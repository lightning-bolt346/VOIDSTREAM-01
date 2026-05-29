import { tmdb } from '@/lib/tmdb';
import { MediaGrid } from '@/components/media/MediaGrid';

export default async function MoviesPage() {
  const [popular, topRated, trending] = await Promise.all([
    tmdb.getPopular('movie').catch(() => ({ results: [] })),
    tmdb.getTopRated('movie').catch(() => ({ results: [] })),
    tmdb.getTrending('movie').catch(() => ({ results: [] })),
  ]);

  return (
    <div className="flex flex-col pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 w-full mb-8">
        <h1 className="text-4xl font-display font-black">Movies</h1>
      </div>
      
      <MediaGrid title="Trending Movies" items={trending.results?.slice(0, 18) || []} />
      <MediaGrid title="Popular" items={popular.results?.slice(0, 18) || []} />
      <MediaGrid title="Top Rated" items={topRated.results?.slice(0, 18) || []} />
    </div>
  );
}
