import { motion } from 'framer-motion';

export const QuizResultsSkeleton = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* HERO: Brain Profile Card */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-white/5 dark:bg-white/5 backdrop-blur-3xl border border-white/10 p-8 h-[400px] flex flex-col items-center justify-center space-y-6">
        <div className="h-8 w-32 rounded-full bg-white/10 animate-pulse" />
        <div className="space-y-3 flex flex-col items-center w-full">
          <div className="h-16 w-3/4 bg-white/10 rounded-2xl animate-pulse" />
          <div className="h-16 w-1/2 bg-white/10 rounded-2xl animate-pulse" />
        </div>
        <div className="h-4 w-full max-w-md bg-white/5 rounded animate-pulse" />
        <div className="h-4 w-5/6 max-w-md bg-white/5 rounded animate-pulse" />
        
        {/* Shimmer */}
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{ translateX: ['100%', '-100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* RINGS SECTION */}
      <div className="rounded-3xl bg-card/30 backdrop-blur-xl border border-border/30 p-6 h-[300px]">
        <div className="grid grid-cols-2 gap-4 h-full">
           {[1,2,3,4].map(i => (
             <div key={i} className="rounded-2xl bg-white/5 animate-pulse h-full w-full" />
           ))}
        </div>
      </div>

      {/* BENTO GRID STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Large Card */}
        <div className="md:col-span-2 h-40 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
        {/* Small Cards */}
        <div className="h-40 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
        <div className="h-40 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
      </div>

      {/* IMPACT METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
         ))}
      </div>

      {/* TIMELINE */}
      <div className="pt-4">
        <div className="rounded-[2.5rem] bg-white/5 border border-white/10 p-1">
           <div className="rounded-[2.2rem] bg-white/5 h-64 animate-pulse" />
        </div>
      </div>
    </div>
  );
};