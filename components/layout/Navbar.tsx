'use client';
import Link from 'next/link';
import { Search, Menu, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${scrolled || mobileMenuOpen ? 'bg-void-950/95 backdrop-blur-md border-b border-zinc-900 shadow-xl' : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-2xl font-display font-black tracking-tighter text-crimson-500 hover:scale-105 transition-transform">
            VOIDSTREAM
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-semibold text-zinc-300">
            <Link href="/" className="hover:text-white transition-colors active:scale-95">Home</Link>
            <Link href="/movies" className="hover:text-white transition-colors active:scale-95">Movies</Link>
            <Link href="/tv" className="hover:text-white transition-colors active:scale-95">TV Shows</Link>
            <Link href="/anime" className="hover:text-white transition-colors active:scale-95">Anime</Link>
          </div>
        </div>
        <div className="flex items-center gap-4 text-zinc-300">
          <Link href="/search" className="p-2 hover:text-white transition-colors active:scale-95" onClick={() => setMobileMenuOpen(false)}>
            <Search size={20} />
          </Link>
          <Link href="/profile" className="hidden md:flex w-8 h-8 rounded-full bg-gradient-to-tr from-crimson-500 to-crimson-700 items-center justify-center hover:scale-105 shadow-md shadow-crimson-500/20 transition-all font-bold text-white text-xs">
            <User size={14} />
          </Link>
          <button 
            className="md:hidden p-2 hover:text-white transition-colors active:scale-95"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-void-950 border-b border-zinc-900 shadow-xl py-4 px-4 flex flex-col gap-4 text-zinc-300 font-semibold fade-in slide-in-from-top-2 animate-in duration-200">
          <Link href="/" className="p-2 hover:text-white hover:bg-white/5 rounded transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link href="/movies" className="p-2 hover:text-white hover:bg-white/5 rounded transition-colors" onClick={() => setMobileMenuOpen(false)}>Movies</Link>
          <Link href="/tv" className="p-2 hover:text-white hover:bg-white/5 rounded transition-colors" onClick={() => setMobileMenuOpen(false)}>TV Shows</Link>
          <Link href="/anime" className="p-2 hover:text-white hover:bg-white/5 rounded transition-colors" onClick={() => setMobileMenuOpen(false)}>Anime</Link>
          <Link href="/profile" className="p-2 text-crimson-400 hover:text-crimson-300 hover:bg-white/5 rounded transition-colors flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <User size={16} /> My Profile
          </Link>
        </div>
      )}
    </nav>
    </>
  );
}
