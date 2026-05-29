'use server';

import { tmdb } from '@/lib/tmdb';
import { Media } from '@/types/tmdb';

export async function searchMedia(query: string) {
  const result = await tmdb.search(query);
  if (result && result.results) {
    result.results = result.results.filter((item: Media) => item.media_type !== 'person');
  }
  return result;
}

export async function getSeasonDetailsAction(tvId: string, seasonNumber: number) {
  return await tmdb.getSeasonDetails(tvId, seasonNumber);
}
