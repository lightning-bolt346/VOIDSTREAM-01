'use client';
import { useState, useEffect, Suspense } from 'react';
import { Media } from '@/types/tmdb';
import { MediaGrid } from '@/components/media/MediaGrid';
import { SearchIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { searchMedia, discoverMedia } from '@/app/actions';

import { Filter, History, X } from 'lucide-react';
import { storage } from '@/lib/storage';
import { usePreferences } from '@/hooks/usePreferences';

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
  const [history, setHistory] = useState<string[]>([]);
  const [isDiscoverMode, setIsDiscoverMode] = useState(false);

  const [typeFilter, setTypeFilter] = useState('movie');
  const [yearFilter, setYearFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('0');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const { preferences } = usePreferences();

  useEffect(() => {
    setHistory(storage.get().searchHistory || []);
  }, []);

  const addToHistory = (q: string) => {
    setHistory(prev => {
      const filtered = prev.filter(item => item !== q);
      const next = [q, ...filtered].slice(0, 10);
      storage.set({ searchHistory: next });
      return next;
    });
  };

  const removeFromHistory = (q: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => {
      const next = prev.filter(item => item !== q);
      storage.set({ searchHistory: next });
      return next;
    });
  };

  useEffect(() => {
    if (query.trim().length > 2) {
      setIsDiscoverMode(false);
      setLoading(true);
      const timeout = setTimeout(() => {
        router.replace(`/search?q=${encodeURIComponent(query)}`);
        searchMedia(query.trim(), preferences.adultContent).then(res => {
          setResults(res.results || []);
          if (res.results && res.results.length > 0) {
            addToHistory(query);
          }
          setLoading(false);
        });
      }, 500);
      return () => {
        clearTimeout(timeout);
        setLoading(false);
      };
    } else {
      setIsDiscoverMode(true);
      setLoading(true);
      
      const type = typeFilter === 'all' ? 'movie' : typeFilter;
      const params: Record<string, string> = {
        sort_by: sortBy,
        include_adult: preferences.adultContent ? 'true' : 'false'
      };
      
      if (ratingFilter !== '0') {
         params['vote_average.gte'] = ratingFilter;
         params['vote_count.gte'] = '100'; // Make sure it has some votes
      }

      if (yearFilter !== 'all') {
        if (yearFilter === '2020s') {
           params['primary_release_date.gte'] = '2020-01-01';
           params['primary_release_date.lte'] = '2029-12-31';
           params['first_air_date.gte'] = '2020-01-01';
           params['first_air_date.lte'] = '2029-12-31';
        } else if (yearFilter === '2010s') {
           params['primary_release_date.gte'] = '2010-01-01';
           params['primary_release_date.lte'] = '2019-12-31';
           params['first_air_date.gte'] = '2010-01-01';
           params['first_air_date.lte'] = '2019-12-31';
        } else if (yearFilter === '2000s') {
           params['primary_release_date.gte'] = '2000-01-01';
           params['primary_release_date.lte'] = '2009-12-31';
           params['first_air_date.gte'] = '2000-01-01';
           params['first_air_date.lte'] = '2009-12-31';
        } else if (yearFilter === 'older') {
           params['primary_release_date.lte'] = '1999-12-31';
           params['first_air_date.lte'] = '1999-12-31';
        }
      }

      if (genreFilter !== 'all') {
        params.with_genres = genreFilter;
      }

      discoverMedia(type as "movie" | "tv", params).then(res => {
         const items = res.results || [];
         setResults(items.map((i: any) => ({ ...i, media_type: type })));
         setLoading(false);
      });
    }
  }, [query, router, typeFilter, yearFilter, genreFilter, ratingFilter, sortBy]);

  const filteredResults = isDiscoverMode ? results : results.filter(item => {
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

    if (item.vote_average && item.vote_average < parseInt(ratingFilter)) {
      return false;
    }

    return true;
  });

  const sortedResults = isDiscoverMode ? filteredResults : [...filteredResults].sort((a, b) => {
    if (sortBy === 'vote_average.desc') {
      return (b.vote_average || 0) - (a.vote_average || 0);
    } else if (sortBy === 'primary_release_date.desc') {
      const aDate = new Date(a.release_date || a.first_air_date || 0).getTime();
      const bDate = new Date(b.release_date || b.first_air_date || 0).getTime();
      return bDate - aDate;
    }
    // popularity sorting is implicitly the default from TMDB search or relevance
    return 0;
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
        <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="bg-void-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-crimson-500 text-zinc-300">
          <option value="0">Any Rating</option>
          <option value="5">5+ Stars</option>
          <option value="6">6+ Stars</option>
          <option value="7">7+ Stars</option>
          <option value="8">8+ Stars</option>
          <option value="9">9+ Stars</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-void-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-crimson-500 text-zinc-300 font-medium">
          <option value="popularity.desc">Sort by Popularity</option>
          <option value="primary_release_date.desc">Sort by Release Date</option>
          <option value="vote_average.desc">Sort by Rating</option>
        </select>
      </div>
      
      {isDiscoverMode && sortedResults.length > 0 ? (
        <MediaGrid title={`Discover Results (${sortedResults.length})`} items={sortedResults} />
      ) : isDiscoverMode && !loading ? (
        <div className="text-center text-zinc-500 mt-20">
          <p className="text-xl">No results found for these filters</p>
        </div>
      ) : query.length > 2 && sortedResults.length > 0 ? (
        <MediaGrid title={`Search Results for "${query}" (${sortedResults.length})`} items={sortedResults} />
      ) : query.length > 2 && !loading ? (
        <div className="text-center text-zinc-500 mt-20">
          <p className="text-xl">No results found for "{query}"</p>
        </div>
      ) : (
        !isDiscoverMode && history.length > 0 && (
          <div className="max-w-3xl mx-auto mt-8 px-4">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <History size={16} /> Recent Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {history.map(item => (
                <div 
                  key={item} 
                  className="group flex items-center gap-2 bg-void-900 border border-zinc-800 rounded-xl px-3 py-2 cursor-pointer hover:bg-void-800 transition-colors" 
                  onClick={() => setQuery(item)}
                >
                  <span className="text-sm text-zinc-300 font-medium">{item}</span>
                  <button 
                    onClick={(e) => removeFromHistory(item, e)} 
                    className="text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove keyword"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      )}
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
