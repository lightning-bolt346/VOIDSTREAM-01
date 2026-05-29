export default function Loading() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-6">
           <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl bg-zinc-900 border border-zinc-800" />
           <div className="h-12 w-3/4 bg-zinc-900 rounded-xl" />
           <div className="flex gap-4">
               <div className="h-4 w-16 bg-zinc-900 rounded" />
               <div className="h-4 w-16 bg-zinc-900 rounded" />
           </div>
           <div className="space-y-3 mt-4">
              <div className="h-4 w-full bg-zinc-900 rounded" />
              <div className="h-4 w-full bg-zinc-900 rounded" />
              <div className="h-4 w-2/3 bg-zinc-900 rounded" />
           </div>
        </div>
        <div className="w-full xl:w-96 flex flex-col gap-4">
           <div className="h-12 w-full bg-zinc-900 rounded-xl" />
           <div className="h-[400px] w-full bg-zinc-900 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
