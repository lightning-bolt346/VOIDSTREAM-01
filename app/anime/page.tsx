import { tmdb } from '@/lib/tmdb';
import { MediaGrid } from '@/components/media/MediaGrid';

export const dynamic = 'force-dynamic';

export default async function AnimePage() {
  const anime = await tmdb.getAnime();
  return (
    <div className="flex flex-col min-h-screen pb-20 pt-8">
      <div className="px-4 md:px-12 mb-8">
        <h1 className="text-4xl font-display font-black">Anime</h1>
      </div>
      <MediaGrid title="Discover Anime" items={anime.results} />
    </div>
  );
}
