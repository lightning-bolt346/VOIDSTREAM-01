export interface Source {
  id: string;
  name: string;
  url: (
    type: "movie" | "tv",
    id: string,
    season?: number,
    episode?: number,
  ) => string;
}

export const sources: Source[] = [
  {
    id: "autoembed",
    name: "AutoEmbed",
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://autoembed.co/movie/tmdb/${id}`
        : `https://autoembed.co/tv/tmdb/${id}-${season}-${episode}`,
  },
  {
    id: "vidsrc",
    name: "VidSrc ME",
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://vidsrc.me/embed/movie?tmdb=${id}`
        : `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`,
  },
  {
    id: "vidsrcpro",
    name: "VidSrc Pro",
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://vidsrc.pro/embed/movie/${id}`
        : `https://vidsrc.pro/embed/tv/${id}/${season}/${episode}`,
  },
  {
    id: "vidlink",
    name: "VidLink",
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://vidlink.pro/movie/${id}`
        : `https://vidlink.pro/tv/${id}/${season}/${episode}`,
  },
  {
    id: "embedsu",
    name: "EmbedSU",
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://embed.su/embed/movie/${id}`
        : `https://embed.su/embed/tv/${id}/${season}/${episode}`,
  },
  {
    id: "2embed",
    name: "2Embed (Sandboxed)",
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://www.2embed.cc/embed/${id}`
        : `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`,
  },
  {
    id: "smashystream",
    name: "SmashyStream",
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://player.smashy.stream/movie/${id}`
        : `https://player.smashy.stream/tv/${id}?s=${season}&e=${episode}`,
  },
  {
    id: "superembed",
    name: "SuperEmbed",
    url: (type, id, season, episode) =>
      type === "movie"
        ? `https://multiembed.mov/?video_id=${id}&tmdb=1`
        : `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`,
  }
];

export const getSource = (id?: string): Source =>
  sources.find((s) => s.id === id) || sources[0];
