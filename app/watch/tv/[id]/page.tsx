import { tmdb } from '@/lib/tmdb';
import { TvPlayer } from './TvPlayer';
import { MediaGrid } from '@/components/media/MediaGrid';

export const dynamic = 'force-dynamic';

export default async function WatchTv({ params }: { params: { id: string } }) {
  const { id } = await params;
  const show = await tmdb.getDetails('tv', id);
  const similar = show.similar?.results?.slice(0, 6) || [];
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8 w-full">
      <TvPlayer show={show} />
      
      {similar.length > 0 && (
        <div className="mt-12 border-t border-zinc-800 pt-8">
          <MediaGrid title="Similar Shows" items={similar} />
        </div>
      )}
    </div>
  );
}
