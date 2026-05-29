import { tmdb } from '@/lib/tmdb';
import { TvPlayer } from './TvPlayer';
import { MediaGrid } from '@/components/media/MediaGrid';

export default async function TvWatchPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const show = await tmdb.getDetails('tv', params.id);
  const similar = show.similar?.results?.slice(0, 6) || [];
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-24 flex flex-col gap-8">
      <TvPlayer show={show} />
      
      {similar.length > 0 && (
        <div className="pt-8 border-t border-white/10">
          <MediaGrid title="Similar Shows" items={similar} />
        </div>
      )}
    </div>
  );
}
