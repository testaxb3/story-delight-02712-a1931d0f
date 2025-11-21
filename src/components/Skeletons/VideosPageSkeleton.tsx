import { ImprovedSkeleton } from "@/components/common/ImprovedSkeleton";

export const VideosPageSkeleton = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-3">
        <ImprovedSkeleton className="h-10 w-48" />
        <ImprovedSkeleton className="h-5 w-80" />
      </div>

      {/* Continue Watching */}
      <div className="space-y-4">
        <ImprovedSkeleton className="h-6 w-40" />
        <ImprovedSkeleton className="h-64 w-full rounded-2xl" />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <ImprovedSkeleton key={i} className="h-10 w-32 rounded-full flex-shrink-0" />
        ))}
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card overflow-hidden hover-lift"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <ImprovedSkeleton className="h-48 w-full rounded-none" />
            <div className="p-5 space-y-4">
              <div className="space-y-3">
                <ImprovedSkeleton className="h-6 w-full" />
                <ImprovedSkeleton className="h-4 w-full" />
                <ImprovedSkeleton className="h-4 w-3/4" />
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <ImprovedSkeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <ImprovedSkeleton className="h-3 w-24" />
                  <ImprovedSkeleton className="h-3 w-32" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
