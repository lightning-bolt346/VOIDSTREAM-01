import { tmdb } from '@/lib/tmdb';
import { MediaGrid } from '@/components/media/MediaGrid';

export const dynamic = 'force-dynamic';

export default async function TvPage() {
  const popTv = await tmdb.getPopular('tv');
  const topTv = await tmdb.getTopRated('tv');
  return (
    <div className="flex flex-col min-h-screen pb-20 pt-8">
      <div className="px-4 md:px-12 mb-8">
        <h1 className="text-4xl font-display font-black">TV Shows</h1>
      </div>
      <MediaGrid title="Popular" items={popTv.results} />
      <MediaGrid title="Top Rated" items={topTv.results} />
    </div>
  );
}
