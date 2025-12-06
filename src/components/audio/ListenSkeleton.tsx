import { memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AmbientBackground } from '@/components/Dashboard/AmbientBackground';

export const ListenSkeleton = memo(function ListenSkeleton() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <AmbientBackground />
      <div
        className="relative z-10"
        style={{
          paddingTop: 'max(1.5rem, calc(env(safe-area-inset-top) + 1rem))',
          paddingBottom: 'max(10rem, calc(env(safe-area-inset-bottom) + 8rem))',
        }}
      >
        <div className="max-w-2xl mx-auto px-4 space-y-5">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-2xl" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 rounded-xl border border-border/50">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Skeleton className="w-3.5 h-3.5 rounded" />
                    <Skeleton className="h-2.5 w-12" />
                  </div>
                  <Skeleton className="h-6 w-10" />
                </div>
              ))}
            </div>

            <Skeleton className="h-4 w-56" />
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton
                key={i}
                className="h-8 rounded-full flex-shrink-0"
                style={{ width: `${60 + i * 10}px` }}
              />
            ))}
          </div>

          {/* Hero */}
          <div className="rounded-2xl border border-border/50 p-4">
            <Skeleton className="h-5 w-28 rounded-full mb-3" />
            <div className="flex items-center gap-4">
              <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-full max-w-[180px]" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
            </div>
          </div>

          {/* Quick Relief */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="flex gap-3 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-shrink-0 w-24">
                  <Skeleton className="w-24 h-24 rounded-xl" />
                  <Skeleton className="h-3 w-20 mt-1.5 mx-auto" />
                </div>
              ))}
            </div>
          </div>

          {/* Section Header */}
          <Skeleton className="h-3 w-20" />

          {/* Series Cards */}
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/50 p-4 flex items-center gap-4"
              >
                <div className="relative flex-shrink-0">
                  <Skeleton className="w-16 h-16 rounded-xl" />
                </div>
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full max-w-[200px]" />
                  <div className="flex gap-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                </div>
                <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
