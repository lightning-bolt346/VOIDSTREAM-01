'use client';
import { useState, useTransition } from 'react';
import { MediaGrid } from './MediaGrid';
import { Media } from '@/types/tmdb';
import { MediaGridSkeleton } from './MediaGridSkeleton';

const GENRES: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction', 10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
  10759: 'Action & Adventure', 10762: 'Kids', 10765: 'Sci-Fi & Fantasy', 10768: 'War & Politics'
};

export function FilterableContent({ sections }: { sections: { title: string, items: Media[] }[] }) {
  const [activeGenre, setActiveGenre] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFilter = (genreId: number | null) => {
    startTransition(() => {
      setActiveGenre(genreId);
    });
  };

  // Collect all unique genres present in the items
  const allGenreIds = new Set<number>();
  sections.forEach(s => s.items.forEach(i => i.genre_ids?.forEach(id => allGenreIds.add(id))));
  
  const availableGenres = Array.from(allGenreIds).map(id => ({ id, name: GENRES[id] })).filter(g => g.name).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col gap-8 w-full z-20 relative">
      <div className="px-4 md:px-12 flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        <button 
          onClick={() => handleFilter(null)} 
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${activeGenre === null ? 'bg-crimson-500 text-white border-crimson-500' : 'bg-void-950 border-zinc-800 text-zinc-300 hover:text-white hover:bg-void-800'}`}
        >
          All
        </button>
        {availableGenres.map(genre => (
          <button 
            key={genre.id} 
            onClick={() => handleFilter(genre.id)} 
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${activeGenre === genre.id ? 'bg-crimson-500 text-white border-crimson-500' : 'bg-void-950 border-zinc-800 text-zinc-300 hover:text-white hover:bg-void-800'}`}
          >
            {genre.name}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-0 relative">
          {isPending ? (
            sections.map(section => (
               <div key={section.title} className="py-6"><MediaGridSkeleton count={6} /></div>
            ))
          ) : (
            <>
              {sections.map(section => {
                const filteredItems = activeGenre ? section.items.filter(item => item.genre_ids?.includes(activeGenre)) : section.items;
                if (filteredItems.length === 0) return null;
                return <MediaGrid key={section.title} title={section.title} items={filteredItems} />;
              })}
              {sections.every(section => {
                const filteredItems = activeGenre ? section.items.filter(item => item.genre_ids?.includes(activeGenre)) : section.items;
                return filteredItems.length === 0;
              }) && (
                <div className="flex items-center justify-center py-20 px-4 text-center">
                  <div className="text-zinc-500">
                    <p className="text-xl font-medium mb-1">No matches found</p>
                    <p className="text-sm">Try selecting a different genre filter</p>
                  </div>
                </div>
              )}
            </>
          )}
      </div>
    </div>
  );
}
