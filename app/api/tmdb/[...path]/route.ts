import { NextRequest, NextResponse } from 'next/server';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const urlPath = path.join('/');
  const { searchParams } = new URL(request.url);
  
  const tmdbUrl = new URL(`${TMDB_BASE_URL}/${urlPath}`);
  tmdbUrl.searchParams.append('api_key', process.env.TMDB_API_KEY || '');
  
  searchParams.forEach((value, key) => {
    tmdbUrl.searchParams.append(key, value);
  });

  try {
    const res = await fetch(tmdbUrl.toString());
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch from TMDB' }, { status: 500 });
  }
}
