import { TMDBResponse, Media, MediaDetails, Episode } from '@/types/tmdb';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchTMDB<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.append('api_key', process.env.TMDB_API_KEY || '');
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 } // Cache for 1 hour by default
  });

  if (!res.ok) {
    throw new Error(`TMDB API Error: ${res.statusText}`);
  }

  return res.json();
}

export const tmdb = {
  getTrending: (type: 'all' | 'movie' | 'tv' = 'all') => 
    fetchTMDB<TMDBResponse<Media>>(`/trending/${type}/week`),
  
  getPopular: (type: 'movie' | 'tv') => 
    fetchTMDB<TMDBResponse<Media>>(`/${type}/popular`),
    
  getTopRated: (type: 'movie' | 'tv') => 
    fetchTMDB<TMDBResponse<Media>>(`/${type}/top_rated`),
    
  getDetails: (type: 'movie' | 'tv', id: string) => 
    fetchTMDB<MediaDetails>(`/${type}/${id}`, { append_to_response: 'credits,similar' }),
    
  getSeasonDetails: (tvId: string, seasonNumber: number) =>
    fetchTMDB<any>(`/tv/${tvId}/season/${seasonNumber}`),
    
  search: (query: string, page: string = '1') =>
    fetchTMDB<TMDBResponse<Media>>('/search/multi', { query, page }),
    
  // Anime is just TV shows with genre 16
  getAnime: (page: string = '1') =>
    fetchTMDB<TMDBResponse<Media>>('/discover/tv', {
      with_genres: '16',
      with_original_language: 'ja',
      page
    })
};

export const getImageUrl = (path: string | null, size: 'original' | 'w500' | 'w780' = 'original') => {
  if (!path) return 'https://picsum.photos/seed/placeholder/800/1200';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
