import { Plus } from 'lucide-react';

export function Footer() {
  return (
    <>
      <footer className="z-50 px-8 py-3 bg-void-950 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-600 font-mono tracking-widest leading-none mt-auto">
        <div className="flex flex-wrap items-center gap-6 uppercase">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            TMDB API Connected
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
            LCP: 1.1s
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
            PWA Optimized
          </div>
        </div>
        <div className="uppercase tracking-[0.2em] hidden md:block">
          Voidstream Architecture v4.0.2-Stable
        </div>
      </footer>

      {/* Custom Overlay (Glass UI Detail) */}
      <button className="fixed bottom-8 right-8 w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors z-[100] group shadow-2xl">
        <Plus className="w-5 h-5 text-white transition-transform group-hover:rotate-90" strokeWidth={2} />
      </button>
    </>
  );
}
