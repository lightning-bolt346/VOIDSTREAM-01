'use client';
import { useState, useEffect, useCallback } from 'react';
import { storage, VoidStorage } from '@/lib/storage';

export interface HistoryItem {
  id: string; type: 'movie'|'tv'; title: string; poster?: string|null; timestamp: number; season?: number; episode?: number;
}

export function useWatchHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  useEffect(() => { 
    setHistory(storage.get().history || []); 
  }, []);
  
  const addToHistory = useCallback((item: HistoryItem) => {
    setHistory(prev => {
      const filtered = prev.filter(i => i.id !== item.id);
      const newHistory = [item, ...filtered].slice(0, 50);
      storage.set({ history: newHistory });
      return newHistory;
    });
  }, []);
  
  return { history, addToHistory };
}
