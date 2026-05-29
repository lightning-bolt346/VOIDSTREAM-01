import { tmdb } from '@/lib/tmdb';
import Link from 'next/link';
import { HeroSlider } from '@/components/media/HeroSlider';
import { ContinueWatching } from '@/components/media/ContinueWatching';
import { FilterableContent } from '@/components/media/FilterableContent';
import { RecommendedForYou } from '@/components/media/RecommendedForYou';

export default async function Home() {
  const [trending, popMovies, popTv] = await Promise.all([
    tmdb.getTrending('all'),
    tmdb.getPopular('movie'),
    tmdb.getPopular('tv')
  ]);

  return (
    <div className="flex flex-col min-h-screen -mt-20">
      <HeroSlider items={trending.results?.slice(0, 5) || []} />
      <div className="flex flex-col relative z-20 pb-20 mt-4 gap-8">
        <ContinueWatching />
        <RecommendedForYou />
        <FilterableContent sections={[
          { title: "Trending Now", items: trending.results?.slice(5, 17) || [] },
          { title: "Popular Movies", items: popMovies.results?.slice(0, 12) || [] },
          { title: "Popular TV Shows", items: popTv.results?.slice(0, 12) || [] }
        ]} />
      </div>
    </div>
  );
}
