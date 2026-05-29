'use client';
import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';

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
    const data = storage.get();
    setHistory(data.history || []);
  }, []);

  const addToHistory = (item: HistoryItem) => {
    setHistory(prev => {
      const filtered = prev.filter(i => i.id !== item.id);
      const newHistory = [item, ...filtered].slice(0, 50); // Keep last 50
      storage.set({ history: newHistory });
      return newHistory;
    });
  };
  
  const removeFromHistory = (id: string) => {
    setHistory(prev => {
      const newHistory = prev.filter(i => i.id !== id);
      storage.set({ history: newHistory });
      return newHistory;
    });
  };

  return { history, addToHistory, removeFromHistory };
}
