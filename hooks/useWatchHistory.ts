'use client';
import { useState, useEffect } from 'react';

export interface HistoryItem {
  id: string; // tmdb id
  type: 'movie' | 'tv';
  title: string;
  poster: string | null;
  timestamp: number;
  season?: number;
  episode?: number;
}

export function useWatchHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('voidstream_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const addToHistory = (item: HistoryItem) => {
    setHistory(prev => {
      const filtered = prev.filter(i => i.id !== item.id);
      const newHistory = [item, ...filtered].slice(0, 50); // Keep last 50
      localStorage.setItem('voidstream_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };
  
  const removeFromHistory = (id: string) => {
    setHistory(prev => {
      const newHistory = prev.filter(i => i.id !== id);
      localStorage.setItem('voidstream_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  return { history, addToHistory, removeFromHistory };
}
