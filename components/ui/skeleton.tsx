export function PostSkeleton() {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-5 animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-5 w-20 skeleton rounded" />
        <div className="h-4 w-24 skeleton rounded" />
        <div className="h-4 w-12 skeleton rounded ml-auto" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full skeleton rounded" />
        <div className="h-4 w-5/6 skeleton rounded" />
        <div className="h-4 w-4/6 skeleton rounded" />
      </div>
      <div className="h-3 w-28 skeleton rounded mb-4" />
      <div className="flex gap-2 pt-3 border-t border-border/60">
        <div className="h-8 w-16 skeleton rounded-lg" />
        <div className="h-8 w-16 skeleton rounded-lg" />
        <div className="h-8 w-16 skeleton rounded-lg" />
      </div>
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}
