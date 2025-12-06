import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeletonPremium() {
  return (
    <div className="min-h-screen bg-background pb-32 relative overflow-hidden transition-colors duration-300">
      {/* Ambient Background */}
      <div className="fixed -top-[30%] -right-[20%] w-[70%] h-[70%] bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed -bottom-[20%] -left-[25%] w-[60%] h-[60%] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Safe area */}
      <div className="h-[env(safe-area-inset-top)]" />

      {/* Header */}
      <header className="relative z-10 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-20 rounded-full" />
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 px-5 space-y-4">
        {/* Hero Metrics Card */}
        <div className="relative p-5 rounded-3xl overflow-hidden border border-border/30">
          <div className="absolute inset-0 bg-card/50" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-14 w-20" />
                <Skeleton className="h-6 w-12" />
              </div>
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-28 w-28 rounded-full" />
          </div>
          <Skeleton className="h-3 w-28 mt-4" />
        </div>

        {/* Situation Picker */}
        <div className="space-y-3">
          <Skeleton className="h-3 w-40" />
          <div className="flex gap-2 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl min-w-[72px]"
              >
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-2.5 w-10" />
              </div>
            ))}
          </div>
        </div>

        {/* Insight Cards */}
        <div className="flex gap-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex-1 p-4 rounded-2xl border border-border"
            >
              <Skeleton className="h-10 w-10 rounded-2xl mb-3" />
              <Skeleton className="h-7 w-12 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-14" />
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border border-border flex items-center gap-4"
              >
                <Skeleton className="w-12 h-12 rounded-2xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full max-w-[200px]" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-4 rounded flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Bonus Guides */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-14" />
          </div>

          <div className="flex gap-4 overflow-hidden pb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[130px] w-[130px] flex-shrink-0">
                <Skeleton className="aspect-[3/4] rounded-xl mb-2" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4 mt-1" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAB */}
      <div
        className="fixed z-50"
        style={{
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 6rem)',
          right: '1.25rem',
        }}
      >
        <Skeleton className="w-[60px] h-[60px] rounded-full" />
      </div>
    </div>
  );
}
