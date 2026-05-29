import { MediaGridSkeleton } from '@/components/media/MediaGridSkeleton';

export default function Loading() {
  return (
    <div className="py-32 w-full flex flex-col gap-12">
      <div className="px-4 md:px-12 mb-8">
        <div className="h-10 w-64 bg-zinc-900 rounded-xl animate-pulse" />
      </div>
      <MediaGridSkeleton count={12} title="Anime Series" />
      <MediaGridSkeleton count={12} title="Anime Movies" />
    </div>
  );
}
