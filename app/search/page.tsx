'use client';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { MediaCard } from '@/components/media/MediaCard';
import { Media } from '@/types/tmdb';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 2) {
        setLoading(true);
        router.replace(`/search?q=${encodeURIComponent(query)}`);
        try {
          const res = await fetch(`/api/tmdb/search/multi?query=${encodeURIComponent(query)}`);
          const data = await res.json();
          // Filter out people
          setResults(data.results?.filter((m: Media) => m.media_type !== 'person') || []);
        } catch (e) {
          console.error();
        }
        setLoading(false);
      } else if (query.length === 0) {
        setResults([]);
        router.replace('/search');
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, router]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-24 mt-8">
      <div className="relative max-w-3xl mx-auto mb-12">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <SearchIcon className="text-white/40" size={24} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies or TV shows..."
          className="w-full bg-void-900 border border-white/10 rounded-2xl py-6 pl-14 pr-6 text-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-crimson-500/50 shadow-2xl transition-all"
        />
      </div>

      {loading && (
        <div className="flex justify-center my-20">
          <Loader2 className="animate-spin text-crimson-500" size={48} />
        </div>
      )}

      {!loading && results.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            Results for "{query}"
            <span className="text-white/40 text-sm font-normal">({results.length})</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {results.map(r => <MediaCard key={r.id} media={r} />)}
          </div>
        </div>
      )}

      {!loading && query.length > 2 && results.length === 0 && (
        <div className="text-center my-20 text-white/50 text-xl font-medium">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center mt-32"><Loader2 className="animate-spin text-crimson-500" size={48} /></div>}>
      <SearchContent />
    </Suspense>
  );
}
