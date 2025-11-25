import { ImprovedSkeleton } from "@/components/common/ImprovedSkeleton";

export const DashboardSkeletonV2 = () => {
  return (
    <>
      {/* Header Spacer for status bar */}
      <div className="w-full h-[calc(env(safe-area-inset-top)+20px)]" />

      <div className="space-y-6 animate-in fade-in duration-500">
      {/* Hero Section Skeleton */}
      <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 p-8 sm:p-10">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-4">
              <ImprovedSkeleton className="h-8 w-32 rounded-full" />
              <ImprovedSkeleton className="h-12 w-64" />
              <ImprovedSkeleton className="h-6 w-96" />
            </div>
            <ImprovedSkeleton className="hidden sm:block w-16 h-16 rounded-full" />
          </div>
          <ImprovedSkeleton className="h-20 w-full rounded-2xl" />
          <div className="grid grid-cols-2 gap-4">
            <ImprovedSkeleton className="h-14 rounded-xl" />
            <ImprovedSkeleton className="h-14 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <ImprovedSkeleton className="h-10 w-10 rounded-lg" />
              <ImprovedSkeleton className="h-6 w-16" />
            </div>
            <div className="space-y-2">
              <ImprovedSkeleton className="h-8 w-20" />
              <ImprovedSkeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Continue Watching */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <ImprovedSkeleton className="h-6 w-40" />
            <ImprovedSkeleton className="h-4 w-16" />
          </div>
          <ImprovedSkeleton className="h-48 w-full rounded-xl" />
          <ImprovedSkeleton className="h-4 w-full" />
        </div>

        {/* Recent Scripts */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <ImprovedSkeleton className="h-6 w-32" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                <ImprovedSkeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <ImprovedSkeleton className="h-4 w-full" />
                  <ImprovedSkeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <ImprovedSkeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 border border-border rounded-xl space-y-3">
              <div className="flex items-center gap-3">
                <ImprovedSkeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <ImprovedSkeleton className="h-4 w-32" />
                  <ImprovedSkeleton className="h-3 w-24" />
                </div>
              </div>
              <ImprovedSkeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};
