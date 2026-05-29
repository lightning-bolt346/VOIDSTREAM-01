export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen -mt-20 w-full animate-pulse">
      {/* Hero Skeleton */}
      <div className="w-full h-[85vh] min-h-[600px] max-h-[900px] bg-void-900 overflow-hidden flex flex-col justify-end px-4 md:px-12 pb-16">
        <div className="max-w-2xl space-y-4">
          <div className="h-6 w-32 bg-void-800 rounded"></div>
          <div className="h-16 w-3/4 bg-void-800 rounded"></div>
          <div className="h-4 w-1/4 bg-void-800 rounded"></div>
          <div className="h-20 w-full bg-void-800 rounded"></div>
          <div className="flex gap-4">
            <div className="h-12 w-32 bg-void-800 rounded"></div>
            <div className="h-12 w-32 bg-void-800 rounded"></div>
          </div>
        </div>
      </div>

      {/* Grids Skeleton */}
      <div className="flex flex-col relative z-20 pb-20 mt-4 px-4 md:px-8 space-y-12">
        {[1, 2, 3].map((section) => (
          <div key={section}>
            <div className="h-8 w-48 bg-void-900 rounded mb-6"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6].map((card) => (
                <div
                  key={card}
                  className="aspect-[2/3] bg-void-900 rounded-lg"
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
