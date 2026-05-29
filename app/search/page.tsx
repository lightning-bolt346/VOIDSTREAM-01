'use client';
import { useState, useEffect, Suspense } from 'react';
import { Media } from '@/types/tmdb';
import { MediaGrid } from '@/components/media/MediaGrid';
import { SearchIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { searchMedia } from '@/app/actions';

import { Filter } from 'lucide-react';

const GENRES: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction', 10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
  10759: 'Action & Adventure', 10762: 'Kids', 10765: 'Sci-Fi & Fantasy', 10768: 'War & Politics'
};

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);

  const [typeFilter, setTypeFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');

  useEffect(() => {
    if (query.length > 2) {
      setLoading(true);
      const timeout = setTimeout(() => {
        router.replace(`/search?q=${encodeURIComponent(query)}`);
        searchMedia(query).then(res => {
          setResults(res.results || []);
          setLoading(false);
        });
      }, 500);
      return () => {
        clearTimeout(timeout);
        setLoading(false);
      };
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query, router]);

  const filteredResults = results.filter(item => {
    if (typeFilter !== 'all' && item.media_type !== typeFilter) return false;
    
    if (yearFilter !== 'all') {
      const year = parseInt((item.release_date || item.first_air_date || '').substring(0, 4) || '0');
      if (yearFilter === '2020s' && (year < 2020 || year >= 2030)) return false;
      if (yearFilter === '2010s' && (year < 2010 || year >= 2020)) return false;
      if (yearFilter === '2000s' && (year < 2000 || year >= 2010)) return false;
      if (yearFilter === 'older' && year >= 2000) return false;
    }

    if (genreFilter !== 'all') {
      if (!item.genre_ids?.includes(parseInt(genreFilter))) return false;
    }

    return true;
  });

  return (
    <>
      <div className="relative max-w-3xl mx-auto mb-6">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <SearchIcon className="text-zinc-500" size={24} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies, TV shows..."
          className="w-full bg-void-900 border border-zinc-800 rounded-2xl py-4 pl-14 pr-6 text-xl focus:outline-none focus:border-zinc-600 transition-colors shadow-lg"
        />
        {loading && (
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <div className="w-5 h-5 border-2 border-crimson-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 max-w-3xl mx-auto mb-12 justify-center items-center">
        <Filter size={16} className="text-zinc-500" />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-void-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-crimson-500 text-zinc-300">
          <option value="all">All Types</option>
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
        </select>
        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="bg-void-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-crimson-500 text-zinc-300">
          <option value="all">All Years</option>
          <option value="2020s">2020s</option>
          <option value="2010s">2010s</option>
          <option value="2000s">2000s</option>
          <option value="older">Older</option>
        </select>
        <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)} className="bg-void-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-crimson-500 text-zinc-300">
          <option value="all">All Genres</option>
          {Object.entries(GENRES).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
      </div>
      
      {query.length > 2 && filteredResults.length > 0 ? (
        <MediaGrid title={`Search Results for "${query}" (${filteredResults.length})`} items={filteredResults} />
      ) : query.length > 2 ? (
        <div className="text-center text-zinc-500 mt-20">
          <p className="text-xl">No results found for "{query}" with current filters</p>
        </div>
      ) : null}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-4 min-h-screen">
      <Suspense fallback={<div className="h-20 w-full animate-pulse bg-void-900 rounded-2xl" />}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
