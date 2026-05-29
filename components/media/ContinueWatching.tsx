'use client';
import { useWatchHistory } from '@/hooks/useWatchHistory';
import { MediaGrid } from '@/components/media/MediaGrid';
import { Media } from '@/types/tmdb';

export function ContinueWatching() {
  const { history } = useWatchHistory();
  
  if (!history || history.length === 0) return null;

  const historyMedia = history.slice(0, 6).map(item => ({
    ...item,
    media_type: item.type,
    poster_path: item.poster,
    backdrop_path: null,
    genre_ids: [],
    popularity: 0,
    vote_average: 0,
    vote_count: 0,
    overview: ''
  })) as unknown as Media[];

  return <MediaGrid title="Continue Watching" items={historyMedia} />;
}
