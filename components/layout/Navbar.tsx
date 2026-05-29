'use client';
import Link from 'next/link';
import { Search, Menu, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${scrolled ? 'bg-void-950/95 backdrop-blur-md border-b border-zinc-900 shadow-xl' : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-2xl font-display font-black tracking-tighter text-crimson-500">
            VOIDSTREAM
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-semibold text-zinc-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/movies" className="hover:text-white transition-colors">Movies</Link>
            <Link href="/tv" className="hover:text-white transition-colors">TV Shows</Link>
            <Link href="/anime" className="hover:text-white transition-colors">Anime</Link>
          </div>
        </div>
        <div className="flex items-center gap-4 text-zinc-300">
          <Link href="/search" className="p-2 hover:text-white transition-colors">
            <Search size={20} />
          </Link>
          <div className="hidden md:block w-8 h-8 rounded bg-gradient-to-tr from-crimson-500 to-crimson-700 bg-cover"></div>
          <button className="md:hidden p-2 hover:text-white transition-colors">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
