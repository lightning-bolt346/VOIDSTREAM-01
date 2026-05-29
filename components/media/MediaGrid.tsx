import { Media } from '@/types/tmdb';
import { MediaCard } from './MediaCard';
import { ChevronRight } from 'lucide-react';

export function MediaGrid({ title, items }: { title: string; items: Media[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="relative z-20 px-4 md:px-12 py-6">
      <h3 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
        {title}
        <ChevronRight className="w-5 h-5 text-zinc-500" />
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {items.map((item) => (
          <MediaCard key={item.id} media={item} />
        ))}
      </div>
    </section>
  );
}
