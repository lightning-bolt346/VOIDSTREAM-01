export default function Loading() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl bg-zinc-900 border border-zinc-800" />
      <div className="grid md:grid-cols-4 gap-8 mt-8">
        <div className="md:col-span-3 space-y-6 flex flex-col">
          <div className="h-12 w-3/4 bg-zinc-900 rounded-xl" />
          <div className="flex gap-4">
             <div className="h-4 w-16 bg-zinc-900 rounded" />
             <div className="h-4 w-16 bg-zinc-900 rounded" />
             <div className="h-4 w-16 bg-zinc-900 rounded" />
          </div>
          <div className="space-y-3 mt-4">
            <div className="h-4 w-full bg-zinc-900 rounded" />
            <div className="h-4 w-full bg-zinc-900 rounded" />
            <div className="h-4 w-2/3 bg-zinc-900 rounded" />
          </div>
        </div>
        <div className="space-y-6">
           <div className="h-12 w-full bg-zinc-900 rounded-xl" />
           <div className="space-y-2 flex flex-col">
              <div className="h-4 w-1/3 bg-zinc-900 rounded" />
              <div className="flex gap-2 flex-wrap mt-2">
                 <div className="h-6 w-16 bg-zinc-900 rounded-md" />
                 <div className="h-6 w-20 bg-zinc-900 rounded-md" />
                 <div className="h-6 w-12 bg-zinc-900 rounded-md" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
