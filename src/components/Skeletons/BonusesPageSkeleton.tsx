import { ImprovedSkeleton } from "@/components/common/ImprovedSkeleton";

export const BonusesPageSkeleton = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-3">
        <ImprovedSkeleton className="h-10 w-56" />
        <ImprovedSkeleton className="h-5 w-96" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
            <ImprovedSkeleton className="h-10 w-10 rounded-full" />
            <ImprovedSkeleton className="h-8 w-16" />
            <ImprovedSkeleton className="h-4 w-28" />
          </div>
        ))}
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((i) => (
          <ImprovedSkeleton key={i} className="h-10 w-32 rounded-full flex-shrink-0" />
        ))}
      </div>

      {/* Bonuses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="group rounded-2xl border border-border bg-card overflow-hidden hover-lift-strong"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {/* Thumbnail */}
            <div className="relative">
              <ImprovedSkeleton className="h-52 w-full rounded-none" />
              <div className="absolute top-4 left-4">
                <ImprovedSkeleton className="h-8 w-20 rounded-full" />
              </div>
              <div className="absolute top-4 right-4">
                <ImprovedSkeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <ImprovedSkeleton className="h-7 w-full" />
                <ImprovedSkeleton className="h-4 w-full" />
                <ImprovedSkeleton className="h-4 w-4/5" />
              </div>

              <div className="flex items-center gap-2">
                <ImprovedSkeleton className="h-6 w-16 rounded-full" />
                <ImprovedSkeleton className="h-6 w-20 rounded-full" />
              </div>

              <div className="pt-4 border-t border-border">
                <ImprovedSkeleton className="h-11 w-full rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
