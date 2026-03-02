export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="h-8 bg-white/5 rounded w-48 mx-auto mb-2 animate-pulse" />
        <div className="h-4 bg-white/5 rounded w-32 mx-auto animate-pulse" />
      </div>
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="h-4 bg-white/5 rounded w-20 animate-pulse" />
          <div className="h-8 bg-white/5 rounded w-40 animate-pulse" />
          <div className="h-6 bg-white/5 rounded w-60 animate-pulse" />
          <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
        </div>
        <div className="p-6 border-t border-white/10 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-1">
              <div className="h-4 bg-white/5 rounded w-24 animate-pulse" />
              <div className="h-2 bg-white/5 rounded w-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
