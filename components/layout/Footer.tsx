import { Plus } from 'lucide-react';

export function Footer() {
  return (
    <>
      <footer className="z-50 px-8 py-3 bg-void-950 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-600 font-mono tracking-widest leading-none mt-auto">
        <div className="flex flex-wrap items-center gap-6 uppercase">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            System Online
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
            LCP: 1.1s
          </div>
        </div>
        <div className="uppercase tracking-[0.2em] hidden md:block">
          Voidstream Architecture
        </div>
      </footer>
    </>
  );
}
