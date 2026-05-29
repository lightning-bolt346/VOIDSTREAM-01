export interface Source {
  id: string;
  name: string;
  url: (type: 'movie' | 'tv', id: string, season?: number, episode?: number) => string;
}

export const sources: Source[] = [
  {
    id: 'vidsrc',
    name: 'VidSrc.me',
    url: (type, id, season, episode) => 
      type === 'movie' ? `https://vidsrc.me/embed/movie?tmdb=${id}` : `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`
  },
  {
    id: 'autoembed',
    name: 'AutoEmbed',
    url: (type, id, season, episode) => 
      type === 'movie' ? `https://autoembed.co/movie/tmdb/${id}` : `https://autoembed.co/tv/tmdb/${id}-${season}-${episode}`
  },
  {
    id: 'vidsrcpro',
    name: 'VidSrc Pro',
    url: (type, id, season, episode) => 
      type === 'movie' ? `https://vidsrc.pro/embed/movie/${id}` : `https://vidsrc.pro/embed/tv/${id}/${season}/${episode}`
  }
];

export const getSource = (id?: string): Source => 
  sources.find(s => s.id === id) || sources[0];
