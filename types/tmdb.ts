export interface Media {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type: 'movie' | 'tv' | 'person';
  genre_ids: number[];
  popularity: number;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
}

export interface MediaDetails extends Media {
  genres: { id: number; name: string }[];
  runtime?: number;
  episode_run_time?: number[];
  status: string;
  tagline: string;
  number_of_episodes?: number;
  number_of_seasons?: number;
  seasons?: Season[];
  production_companies: { id: number; logo_path: string | null; name: string; origin_country: string }[];
  credits?: {
    cast: Cast[];
    crew: Crew[];
  };
  similar?: {
    results: Media[];
  };
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}

export interface Episode {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
}

export interface Cast {
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  profile_path: string | null;
  character: string;
  order: number;
}

export interface Crew {
  id: number;
  department: string;
  name: string;
  job: string;
  profile_path: string | null;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
