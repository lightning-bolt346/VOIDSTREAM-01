import { TMDBResponse, Media, MediaDetails } from '@/types/tmdb';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchTMDB<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey || apiKey === 'YOUR_TMDB_API_KEY') {
    throw new Error('NO_API_KEY');
  }

  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.append('api_key', apiKey);
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000); // 8 second timeout

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`TMDB API Error: ${res.statusText}`);
    return res.json();
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

// Fallback Mock Data generator
const getMockMedia = (id: number, t: string = 'movie'): Media => ({
  id,
  title: `Mock Media ${id}`,
  name: `Mock Show ${id}`,
  overview: 'This is a mocked media item because the TMDB API Key is missing or invalid.',
  poster_path: null,
  backdrop_path: null,
  media_type: t as any,
  genre_ids: [12],
  popularity: 100,
  vote_average: 8.5,
  vote_count: 500,
});

export const tmdb = {
  getTrending: async (type: 'all' | 'movie' | 'tv' = 'all') => 
    fetchTMDB<TMDBResponse<Media>>(`/trending/${type}/week`)
      .catch(() => ({ page: 1, results: Array.from({length: 12}).map((_, i) => getMockMedia(i, type === 'all' ? 'movie' : type)), total_pages: 1, total_results: 12 })),
  getPopular: async (type: 'movie' | 'tv') => 
    fetchTMDB<TMDBResponse<Media>>(`/${type}/popular`)
      .catch(() => ({ page: 1, results: Array.from({length: 12}).map((_, i) => getMockMedia(i, type)), total_pages: 1, total_results: 12 })),
  getTopRated: async (type: 'movie' | 'tv') => 
    fetchTMDB<TMDBResponse<Media>>(`/${type}/top_rated`)
      .catch(() => ({ page: 1, results: Array.from({length: 12}).map((_, i) => getMockMedia(i, type)), total_pages: 1, total_results: 12 })),
  getDetails: async (type: 'movie' | 'tv', id: string) => 
    fetchTMDB<MediaDetails>(`/${type}/${id}`, { append_to_response: 'credits,similar' })
      .catch(() => ({ ...getMockMedia(parseInt(id, 10), type), genres: [], status: 'Released', tagline: 'Mock Tagline' } as any)),
  getSeasonDetails: async (tvId: string, seasonNumber: number) =>
    fetchTMDB<any>(`/tv/${tvId}/season/${seasonNumber}`)
      .catch(() => ({ episodes: [] })),
  search: async (query: string, page: string = '1') =>
    fetchTMDB<TMDBResponse<Media>>('/search/multi', { query, page })
      .catch(() => ({ page: 1, results: [], total_pages: 1, total_results: 0 })),
  getAnime: async (page: string = '1') =>
    fetchTMDB<TMDBResponse<Media>>('/discover/tv', { with_genres: '16', with_original_language: 'ja', page })
      .catch(() => ({ page: 1, results: Array.from({length: 12}).map((_, i) => getMockMedia(i, 'tv')), total_pages: 1, total_results: 12 }))
};

export const getImageUrl = (path: string | null, size: 'original' | 'w500' | 'w780' = 'original') => {
  if (!path) return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
