import { tmdb } from '@/lib/tmdb';
import { HeroSlider } from '@/components/media/HeroSlider';
import { MediaGrid } from '@/components/media/MediaGrid';

export default async function Home() {
  const [trending, popMovies, popTv, topRated] = await Promise.all([
    tmdb.getTrending('all').catch(() => ({ results: [] })),
    tmdb.getPopular('movie').catch(() => ({ results: [] })),
    tmdb.getPopular('tv').catch(() => ({ results: [] })),
    tmdb.getTopRated('movie').catch(() => ({ results: [] })),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSlider items={trending.results?.slice(0, 5) || []} />
      
      <div className="flex flex-col relative z-20 -mt-24 pb-20">
        <MediaGrid title="Trending Now" items={trending.results?.slice(5, 17) || []} />
        <MediaGrid title="Popular Movies" items={popMovies.results?.slice(0, 12) || []} />
        <MediaGrid title="Popular TV Shows" items={popTv.results?.slice(0, 12) || []} />
        <MediaGrid title="Top Rated Classics" items={topRated.results?.slice(0, 12) || []} />
      </div>
    </div>
  );
}
