'use server';

import { tmdb } from '@/lib/tmdb';
import { Media } from '@/types/tmdb';

export async function searchMedia(query: string, includeAdult: boolean = false) {
  const result = await tmdb.search(query, includeAdult);
  if (result && result.results) {
    result.results = result.results.filter((item: Media) => item.media_type !== 'person');
  }
  return result;
}

export async function discoverMedia(type: "movie" | "tv", params: Record<string, string>) {
  return await tmdb.discover(type, params);
}

export async function getSeasonDetailsAction(tvId: string, seasonNumber: number) {
  return await tmdb.getSeasonDetails(tvId, seasonNumber);
}
