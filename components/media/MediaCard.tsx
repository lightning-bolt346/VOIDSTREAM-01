import Link from 'next/link';
import Image from 'next/image';
import { Media } from '@/types/tmdb';
import { getImageUrl } from '@/lib/tmdb';
import { cn } from '@/lib/utils'; // if this exists

export function MediaCard({ media, className }: { media: Media, className?: string }) {
  const isMovie = media.media_type === 'movie' || !media.name;
  const title = media.title || media.name;
  const year = media.release_date?.slice(0, 4) || media.first_air_date?.slice(0, 4);
  const href = `/watch/${isMovie ? 'movie' : 'tv'}/${media.id}`;

  return (
    <Link href={href} className={cn("group relative", className)}>
      <div className="relative aspect-[2/3] bg-void-800 rounded-lg overflow-hidden border border-zinc-800 transition-all group-hover:scale-105 group-hover:border-crimson-500/50">
        <Image
          src={getImageUrl(media.poster_path, 'w500')}
          alt={title || 'Poster'}
          fill
          className="object-cover opacity-90 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-100 z-10">
            {isMovie ? 'Movie' : 'TV Show'} • {year || 'N/A'} • ★ {media.vote_average?.toFixed(1) || 'NR'}
          </div>
        </div>
      </div>
      <div className="mt-2 text-sm font-semibold truncate group-hover:text-white transition-colors text-zinc-300">
        {title}
      </div>
    </Link>
  );
}
