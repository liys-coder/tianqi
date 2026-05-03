export default function LoadingSkeleton() {
  const shimmerStyle = {
    backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)',
    backgroundSize: '200% 100%',
  };

  return (
    <div className="px-6 md:px-12 lg:px-24 py-12 space-y-6 animate-fade-up" role="status" aria-label="加载中">
      {/* City header skeleton */}
      <div className="space-y-2">
        <div className="h-5 w-32 rounded bg-white/40 animate-shimmer" style={shimmerStyle} />
        <div className="h-4 w-48 rounded bg-white/30 animate-shimmer" style={shimmerStyle} />
      </div>
      {/* Hero card skeleton */}
      <div className="rounded-3xl bg-white/30 backdrop-blur-[20px] border border-white/50 p-8 space-y-4">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white/40 animate-shimmer" style={shimmerStyle} />
          <div className="space-y-2">
            <div className="h-16 w-32 rounded bg-white/40 animate-shimmer" style={shimmerStyle} />
            <div className="h-5 w-24 rounded bg-white/30 animate-shimmer" style={shimmerStyle} />
          </div>
        </div>
      </div>
      {/* Forecast skeleton */}
      <div className="flex gap-3 flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-1 min-w-[100px] rounded-2xl bg-white/30 backdrop-blur-[12px] border border-white/40 p-4 h-32 animate-shimmer" style={shimmerStyle} />
        ))}
      </div>
    </div>
  );
}
