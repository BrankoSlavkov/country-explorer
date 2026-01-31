function SkeletonCard() {
  return (
    <div className="p-6 rounded-xl backdrop-blur-md bg-black/50 border border-white/20 shadow-lg">
      <div className="w-16 h-16 bg-white/10 rounded animate-pulse mb-4" />
      <div className="h-6 w-32 bg-white/10 rounded animate-pulse mb-3" />
      <div className="space-y-2">
        <div className="h-4 w-40 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-28 bg-white/10 rounded animate-pulse" />
      </div>
    </div>
  );
}

export function CountryCardListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
      {Array.from({ length: 12 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
