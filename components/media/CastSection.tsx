'use client';
import Image from 'next/image';
import { getImageUrl } from '@/lib/tmdb';

export function CastSection({ cast }: { cast?: { id: number, name: string, character: string, profile_path: string | null }[] }) {
  if (!cast || cast.length === 0) return null;
  const topCast = cast.slice(0, 6);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold font-display uppercase tracking-wider">Top Cast</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {topCast.map(person => (
          <div key={person.id} className="flex flex-col gap-2">
            <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
              {person.profile_path ? (
                <Image src={getImageUrl(person.profile_path, 'w185')} alt={person.name} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-600 font-bold text-center p-2">
                  No Image
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-tight">{person.name}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{person.character}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
