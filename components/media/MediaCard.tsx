import Link from 'next/link';
import Image from 'next/image';
import { Media } from '@/types/tmdb';
import { getImageUrl } from '@/lib/tmdb';
import { cn } from '@/lib/utils';

export function MediaCard({ media, className }: { media: Media & { progress?: number, season?: number, episode?: number }, className?: string }) {
  const title = media.title || media.name;
  const isMovie = media.media_type === 'movie' || !media.name;
  const year = (media.release_date || media.first_air_date || '').substring(0, 4);
  const href = `/watch/${isMovie ? 'movie' : 'tv'}/${media.id}${!isMovie && media.season && media.episode ? `?season=${media.season}&episode=${media.episode}` : ''}`; // Keep resume link if applicable

  return (
    <Link href={href} className={cn("group relative block transition-transform active:scale-[0.98]", className)}>
      <div className="relative aspect-[2/3] bg-void-800 rounded-lg overflow-hidden border border-zinc-800 transition-all duration-300 ease-out group-hover:scale-[1.03] group-hover:shadow-[0_0_20px_rgba(220,38,38,0.15)] group-hover:border-zinc-500">
        <Image
          src={getImageUrl(media.poster_path, 'w500')}
          alt={title || 'Poster'}
          fill
          className="object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 will-change-transform"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-100 z-10 line-clamp-1">
            {isMovie ? 'Movie' : 'TV'} • {year || 'N/A'} • ★ {media.vote_average?.toFixed(1) || 'NR'}
            {media.season && media.episode && ` • S${media.season} E${media.episode}`}
          </div>
        </div>
        {media.progress !== undefined && media.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 z-20">
            <div className="h-full bg-crimson-500 rounded-r-full" style={{ width: `${Math.min(100, Math.max(0, media.progress))}%` }} />
          </div>
        )}
      </div>
      <div className="mt-2 text-sm font-medium truncate group-hover:text-white transition-colors text-zinc-400">
        {title}
      </div>
    </Link>
  );
}
