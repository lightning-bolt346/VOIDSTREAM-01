'use client';
import { useState, useEffect } from 'react';

export interface WatchlistItem {
  id: string; // tmdb id
  type: 'movie' | 'tv';
  title: string;
  poster: string | null;
  addedAt: number;
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('voidstream_watchlist');
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const toggleWatchlist = (item: Omit<WatchlistItem, 'addedAt'>) => {
    setWatchlist(prev => {
      const exists = prev.some(i => i.id === item.id);
      let newWatchlist;
      if (exists) {
        newWatchlist = prev.filter(i => i.id !== item.id);
      } else {
        newWatchlist = [{ ...item, addedAt: Date.now() }, ...prev];
      }
      localStorage.setItem('voidstream_watchlist', JSON.stringify(newWatchlist));
      return newWatchlist;
    });
  };
  
  const isInWatchlist = (id: string) => watchlist.some(i => i.id === id);

  return { watchlist, toggleWatchlist, isInWatchlist };
}
