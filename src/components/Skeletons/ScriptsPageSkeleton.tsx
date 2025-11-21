import { ImprovedSkeleton } from "@/components/common/ImprovedSkeleton";

export const ScriptsPageSkeleton = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-4">
        <ImprovedSkeleton className="h-10 w-64" />
        <ImprovedSkeleton className="h-5 w-96" />
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ImprovedSkeleton className="h-10 w-full rounded-lg" />
          <ImprovedSkeleton className="h-10 w-full rounded-lg" />
          <ImprovedSkeleton className="h-10 w-full rounded-lg" />
          <ImprovedSkeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-3">
            <ImprovedSkeleton className="h-8 w-8 rounded-lg" />
            <ImprovedSkeleton className="h-6 w-16" />
            <ImprovedSkeleton className="h-4 w-24" />
          </div>
        ))}
      </div>

      {/* Scripts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-6 space-y-4 hover-lift"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <ImprovedSkeleton className="h-10 w-10 rounded-full" />
              <ImprovedSkeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="space-y-3">
              <ImprovedSkeleton className="h-6 w-full" />
              <ImprovedSkeleton className="h-4 w-full" />
              <ImprovedSkeleton className="h-4 w-4/5" />
            </div>
            <div className="flex items-center gap-2">
              <ImprovedSkeleton className="h-6 w-16 rounded-full" />
              <ImprovedSkeleton className="h-6 w-20 rounded-full" />
              <ImprovedSkeleton className="h-6 w-24 rounded-full" />
            </div>
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <ImprovedSkeleton className="h-4 w-24" />
              <ImprovedSkeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
