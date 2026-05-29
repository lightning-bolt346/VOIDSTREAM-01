export default function Loading() {
  return (
    <div className="py-24 w-full flex flex-col gap-12 max-w-3xl mx-auto px-4 animate-pulse">
      <div className="h-16 w-full bg-zinc-900 rounded-2xl" />
      <div className="flex gap-4">
         <div className="h-10 w-32 bg-zinc-900 rounded-xl" />
         <div className="h-10 w-32 bg-zinc-900 rounded-xl" />
         <div className="h-10 w-32 bg-zinc-900 rounded-xl" />
      </div>
      <div className="space-y-4">
         <div className="h-6 w-48 bg-zinc-900 rounded-lg" />
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="aspect-[2/3] w-full bg-zinc-900 rounded-xl" />
             <div className="aspect-[2/3] w-full bg-zinc-900 rounded-xl" />
             <div className="aspect-[2/3] w-full bg-zinc-900 rounded-xl" />
             <div className="aspect-[2/3] w-full bg-zinc-900 rounded-xl" />
         </div>
      </div>
    </div>
  );
}
