'use client';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/tmdb';

export function CastSection({ cast, crew }: {
  cast?: { id: number, name: string, character: string, profile_path: string | null }[],
  crew?: { id: number, name: string, job: string, profile_path: string | null }[]
}) {
  if (!cast || cast.length === 0) return null;
  const topCast = cast.slice(0, 8);
  
  // Find Director and Producers
  const directors = crew?.filter(c => c.job === 'Director').slice(0, 2) || [];
  const producers = crew?.filter(c => c.job === 'Producer' || c.job === 'Executive Producer').slice(0, 3) || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {directors.length > 0 && (
           <div>
             <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Director</h4>
             <div className="flex flex-col gap-1">
               {directors.map(d => (
                 <Link key={d.id} href={`/person/${d.id}`} className="text-zinc-300 text-sm hover:text-white transition-colors">{d.name}</Link>
               ))}
             </div>
           </div>
         )}
         {producers.length > 0 && (
           <div>
             <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Producers</h4>
             <div className="flex flex-col gap-1">
               {producers.map(p => (
                 <Link key={p.id} href={`/person/${p.id}`} className="text-zinc-300 text-sm hover:text-white transition-colors">{p.name}</Link>
               ))}
             </div>
           </div>
         )}
      </div>

      <div>
        <h3 className="text-sm font-bold font-display uppercase tracking-wider text-zinc-500 mb-4">Top Cast</h3>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
          {topCast.map(person => (
            <Link key={person.id} href={`/person/${person.id}`} className="flex flex-col gap-2 group transition-transform hover:scale-105 active:scale-95">
              <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
                {person.profile_path ? (
                  <Image src={getImageUrl(person.profile_path, 'w185')} alt={person.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-600 font-bold text-center text-xs p-2">
                    No Image
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-white leading-tight line-clamp-1">{person.name}</p>
                <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">{person.character}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
