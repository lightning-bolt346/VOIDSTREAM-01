import { tmdb } from '@/lib/tmdb';
import { MediaGrid } from '@/components/media/MediaGrid';

export default async function TVPage() {
  const [popular, topRated, trending] = await Promise.all([
    tmdb.getPopular('tv').catch(() => ({ results: [] })),
    tmdb.getTopRated('tv').catch(() => ({ results: [] })),
    tmdb.getTrending('tv').catch(() => ({ results: [] })),
  ]);

  return (
    <div className="flex flex-col pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 w-full mb-8">
        <h1 className="text-4xl font-display font-black">TV Shows</h1>
      </div>
      
      <MediaGrid title="Trending Shows" items={trending.results?.slice(0, 18) || []} />
      <MediaGrid title="Popular" items={popular.results?.slice(0, 18) || []} />
      <MediaGrid title="Top Rated" items={topRated.results?.slice(0, 18) || []} />
    </div>
  );
}
