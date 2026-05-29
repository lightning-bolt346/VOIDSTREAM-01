export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] w-full">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-crimson-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest animate-pulse">System Matrix Loading...</div>
      </div>
    </div>
  );
}
