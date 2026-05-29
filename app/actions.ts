'use server';

import { tmdb } from '@/lib/tmdb';

export async function searchMedia(query: string) {
  return await tmdb.search(query);
}
