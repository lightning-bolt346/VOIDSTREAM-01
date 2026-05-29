'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState('');
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'TV Shows', path: '/tv' },
    { name: 'Anime', path: '/anime' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-4 md:px-8 py-6 bg-gradient-to-b from-void-950 to-transparent">
      <div className="flex items-center gap-12">
        <Link href="/" className="text-2xl font-black tracking-tighter text-crimson-500 italic">
          VOIDSTREAM
        </Link>
        <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide text-zinc-400">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/');
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={cn(
                  "hover:text-white transition-colors",
                  isActive ? "text-white border-b-2 border-crimson-500 pb-1" : ""
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <form onSubmit={handleSearch} className="relative hidden md:flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-zinc-500" strokeWidth={2} />
          <input 
            type="text" 
            placeholder="Search titles..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-void-800 border border-zinc-800 rounded-full pl-10 pr-4 py-2 text-xs w-64 focus:outline-none focus:border-zinc-600 text-white placeholder:text-zinc-500" 
          />
        </form>
        <Link href="/search" className="md:hidden flex items-center p-2 rounded-full hover:bg-void-800 text-zinc-400 hover:text-white transition">
           <Search size={20} />
        </Link>
        <div className="w-8 h-8 rounded bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
          JD
        </div>
      </div>
    </nav>
  );
}
