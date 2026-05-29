'use client';
import { useState, useEffect, Suspense } from 'react';
import { tmdb } from '@/lib/tmdb';
import { Media } from '@/types/tmdb';
import { MediaGrid } from '@/components/media/MediaGrid';
import { SearchIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Media[]>([]);

  useEffect(() => {
    if (query.length > 2) {
      const timeout = setTimeout(() => {
        router.replace(`/search?q=${encodeURIComponent(query)}`);
        tmdb.search(query).then(res => setResults(res.results));
      }, 500);
      return () => clearTimeout(timeout);
    } else {
      setResults([]);
    }
  }, [query, router]);

  return (
    <>
      <div className="relative max-w-3xl mx-auto mb-12">
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
      </div>
      
      {query.length > 2 && results.length > 0 ? (
        <MediaGrid title={`Search Results for "${query}"`} items={results} />
      ) : query.length > 2 ? (
        <div className="text-center text-zinc-500 mt-20">
          <p className="text-xl">No results found for "{query}"</p>
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
