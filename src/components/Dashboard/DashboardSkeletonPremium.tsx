import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeletonPremium() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background pb-32 relative overflow-hidden transition-colors duration-300">
      {/* Ambient Background */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-900/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-blue-900/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Header */}
      <header className="relative z-50 px-6 pt-[calc(env(safe-area-inset-top)+8px)] pb-6 flex items-center justify-between">
        <Skeleton className="h-9 w-24 bg-slate-200 dark:bg-[#2C2C2E]" />
        <Skeleton className="h-9 w-20 rounded-full bg-slate-200 dark:bg-[#2C2C2E]" />
      </header>

      {/* Weekly Calendar */}
      <div className="px-4 mb-8">
        <div className="flex justify-between items-center bg-white/60 dark:bg-[#1C1C1E]/50 backdrop-blur-sm p-4 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
          {[1,2,3,4,5,6,7].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-3 w-8 bg-slate-200 dark:bg-[#2C2C2E]" />
              <Skeleton className="h-10 w-10 rounded-full bg-slate-200 dark:bg-[#2C2C2E]" />
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Cards */}
      <div className="mb-8 overflow-x-auto pb-4 px-6 scrollbar-hide flex gap-4">
        {[1,2,3].map((i) => (
          <div key={i} className="shrink-0 w-[85vw] max-w-sm">
            <div className="h-56 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-[#333] rounded-[32px] p-6 flex flex-col justify-between shadow-sm dark:shadow-none">
              <div className="flex justify-between">
                <Skeleton className="h-12 w-12 rounded-2xl bg-slate-200 dark:bg-[#2C2C2E]" />
                <Skeleton className="h-6 w-16 rounded-full bg-slate-200 dark:bg-[#2C2C2E]" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-7 w-32 bg-slate-200 dark:bg-[#2C2C2E]" />
                <Skeleton className="h-4 w-48 bg-slate-200 dark:bg-[#2C2C2E]" />
                <Skeleton className="h-12 w-full rounded-xl bg-slate-200 dark:bg-[#2C2C2E]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mb-8">
        <Skeleton className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white" />
        <Skeleton className="w-2 h-2 rounded-full bg-slate-300 dark:bg-[#333]" />
        <Skeleton className="w-2 h-2 rounded-full bg-slate-300 dark:bg-[#333]" />
      </div>

      {/* Recently Added */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-36 bg-slate-200 dark:bg-[#2C2C2E]" />
          <Skeleton className="h-4 w-16 bg-slate-200 dark:bg-[#2C2C2E]" />
        </div>
        
        <div className="space-y-4">
          {[1,2,3].map((i) => (
            <div key={i} className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-[#333] rounded-2xl p-4 flex items-center gap-4 shadow-sm dark:shadow-none">
              <Skeleton className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-[#2C2C2E]" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full bg-slate-200 dark:bg-[#2C2C2E]" />
                <Skeleton className="h-3 w-32 bg-slate-200 dark:bg-[#2C2C2E]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
