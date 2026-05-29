import { tmdb } from '@/lib/tmdb';
import { MediaGrid } from '@/components/media/MediaGrid';

export default async function AnimePage() {
  const anime = await tmdb.getAnime().catch(() => ({ results: [] }));
  const animePage2 = await tmdb.getAnime('2').catch(() => ({ results: [] }));

  return (
    <div className="flex flex-col pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 w-full mb-8">
        <h1 className="text-4xl font-display font-black text-crimson-500">Anime</h1>
        <p className="text-white/60 mt-2">Discover popular Japanese animation.</p>
      </div>
      
      <MediaGrid title="Trending Anime" items={anime.results?.slice(0, 18) || []} />
      <MediaGrid title="More Anime" items={animePage2.results?.slice(0, 18) || []} />
    </div>
  );
}
