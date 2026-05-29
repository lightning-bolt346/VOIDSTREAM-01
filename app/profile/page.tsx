"use client";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useFavorites } from "@/hooks/useFavorites";
import { usePreferences } from "@/hooks/usePreferences";
import { MediaGrid } from "@/components/media/MediaGrid";
import { Trash2, User, Heart } from "lucide-react";
import Link from "next/link";
import { Media } from "@/types/tmdb";

export default function ProfilePage() {
  const { history, clearHistory } = useWatchHistory();
  const { watchlist } = useWatchlist();
  const { favorites } = useFavorites();
  const { preferences, updatePreferences } = usePreferences();

  const GENRES = [
    { id: 28, name: "Action" },
    { id: 35, name: "Comedy" },
    { id: 18, name: "Drama" },
    { id: 878, name: "Sci-Fi" },
    { id: 27, name: "Horror" },
    { id: 10749, name: "Romance" },
    { id: 16, name: "Animation" },
    { id: 14, name: "Fantasy" },
    { id: 53, name: "Thriller" },
  ];

  const handleToggleGenre = (id: number) => {
    let current = [...preferences.preferredGenres];
    if (current.includes(id)) {
      current = current.filter(g => g !== id);
    } else {
      current.push(id);
    }
    updatePreferences({ preferredGenres: current });
  };

  // Convert history items to Media format for MediaGrid
  const historyMedia = history.map((item) => ({
    ...item,
    media_type: item.type,
    poster_path: item.poster,
    // Add extra needed properties safely
  })) as unknown as Media[];

  const watchlistMedia = watchlist.map((item) => ({
    ...item,
    media_type: item.type,
    poster_path: item.poster,
  })) as unknown as Media[];

  const favoritesMedia = favorites.map((item) => ({
    ...item,
    media_type: item.type,
    poster_path: item.poster,
  })) as unknown as Media[];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-32 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center gap-6 pb-8 border-b border-zinc-800">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-crimson-500 to-crimson-800 flex items-center justify-center shadow-2xl">
          <User size={40} className="text-white" />
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white mb-2">
            My Profile
          </h1>
          <p className="text-zinc-400 font-medium">
            Manage your watch history and saved list
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold font-display uppercase tracking-wider">
            My Watchlist
          </h2>
          <span className="text-sm font-mono text-zinc-500">
            {watchlist.length} ITEMS
          </span>
        </div>
        {watchlist.length > 0 ? (
          <MediaGrid items={watchlistMedia} />
        ) : (
          <div className="h-48 rounded-xl border border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-500">
            <p>Your watchlist is empty.</p>
            <Link
              href="/"
              className="text-crimson-500 hover:text-crimson-400 mt-2 font-medium"
            >
              Discover movies
            </Link>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold font-display uppercase tracking-wider flex items-center gap-2">
            <Heart size={24} className="text-pink-500" /> My Favorites
          </h2>
          <span className="text-sm font-mono text-zinc-500">
            {favorites.length} ITEMS
          </span>
        </div>
        {favorites.length > 0 ? (
          <MediaGrid items={favoritesMedia} />
        ) : (
          <div className="h-48 rounded-xl border border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-500">
            <p>You haven't added any favorites yet.</p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-display uppercase tracking-wider">
              Watch History
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-mono text-zinc-500 hidden sm:block">
              {history.length} TITLES
            </span>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-crimson-500 transition-colors bg-void-900 px-3 py-1.5 rounded-lg border border-zinc-800"
              >
                <Trash2 size={14} /> Clear History
              </button>
            )}
          </div>
        </div>
        {history.length > 0 ? (
          <MediaGrid items={historyMedia} />
        ) : (
          <div className="h-48 rounded-xl border border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-500">
            <p>No watch history yet.</p>
          </div>
        )}
      </div>

      <div className="space-y-6 pt-12 border-t border-zinc-800/50">
        <h2 className="text-2xl font-bold font-display uppercase tracking-wider">
          Personalization
        </h2>
        
        <div className="bg-void-950 border border-zinc-800 rounded-2xl p-6 md:p-8">
          <h3 className="text-lg font-bold mb-2">Favorite Genres</h3>
          <p className="text-zinc-400 text-sm mb-6">Select your favorite genres to help us personalize your recommendations.</p>
          
          <div className="flex flex-wrap gap-3">
            {GENRES.map(genre => {
              const isSelected = preferences.preferredGenres.includes(genre.id);
              return (
                <button
                  key={genre.id}
                  onClick={() => handleToggleGenre(genre.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isSelected 
                      ? 'bg-crimson-500 text-white shadow-lg shadow-crimson-500/20 scale-105' 
                      : 'bg-void-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  {genre.name}
                </button>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800/50">
            <h3 className="text-lg font-bold mb-4">Content Settings</h3>
            <div className="flex items-center justify-between p-4 bg-void-900 border border-zinc-800 rounded-xl">
              <div>
                <h4 className="font-semibold mb-1 text-white">Include Mature Content</h4>
                <p className="text-zinc-400 text-xs text-balance">Show 18+ and restricted content in your discover feed and recommendations.</p>
              </div>
              <button
                onClick={() => updatePreferences({ adultContent: !preferences.adultContent })}
                className={`relative w-12 h-6 rounded-full transition-colors ${preferences.adultContent ? 'bg-crimson-500' : 'bg-zinc-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all transform ${preferences.adultContent ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
