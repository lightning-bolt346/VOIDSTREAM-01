export function MediaGridSkeleton({ count = 12, title }: { count?: number, title?: string }) {
  return (
    <div className="space-y-6 animate-pulse w-full max-w-7xl mx-auto px-4">
      {title && <div className="h-8 w-48 bg-zinc-900 rounded-lg" />}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="w-full aspect-[2/3] bg-zinc-900 rounded-xl" />
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-zinc-900 rounded-md" />
              <div className="h-3 w-1/2 bg-zinc-900 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
