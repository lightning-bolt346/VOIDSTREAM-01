import { tmdb } from '@/lib/tmdb';
import Link from 'next/link';
import { MediaGrid } from '@/components/media/MediaGrid';
import { HeroSlider } from '@/components/media/HeroSlider';

export default async function Home() {
  const [trending, popMovies, popTv] = await Promise.all([
    tmdb.getTrending('all'),
    tmdb.getPopular('movie'),
    tmdb.getPopular('tv')
  ]);

  return (
    <div className="flex flex-col min-h-screen -mt-20">
      <HeroSlider items={trending.results?.slice(0, 5) || []} />
      <div className="flex flex-col relative z-20 pb-20 mt-4">
        <MediaGrid title="Trending Now" items={trending.results?.slice(5, 17) || []} />
        <MediaGrid title="Popular Movies" items={popMovies.results?.slice(0, 12) || []} />
        <MediaGrid title="Popular TV Shows" items={popTv.results?.slice(0, 12) || []} />
      </div>
    </div>
  );
}
