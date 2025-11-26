import { motion } from 'framer-motion';

export const QuizResultsSkeleton = () => {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hero Card Skeleton */}
      <div className="relative overflow-hidden rounded-3xl bg-card/60 dark:bg-card/40 backdrop-blur-xl border border-border/50 p-6 md:p-8">
        <div className="space-y-4">
          {/* Badge skeleton */}
          <div className="h-9 w-32 rounded-full bg-muted/50 animate-pulse" />

          {/* Title skeleton */}
          <div className="space-y-2">
            <div className="h-10 md:h-12 lg:h-14 w-3/4 bg-muted/50 rounded-xl animate-pulse" />
            <div className="h-10 md:h-12 lg:h-14 w-1/2 bg-muted/50 rounded-xl animate-pulse" />
          </div>

          {/* Description skeleton */}
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full bg-muted/30 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-muted/30 rounded animate-pulse" />
          </div>
        </div>

        {/* Shimmer overlay */}
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{ translateX: ['100%', '-100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Rings Grid Skeleton */}
      <div className="grid grid-cols-2 gap-2.5 md:gap-4 lg:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="relative overflow-hidden bg-card/60 dark:bg-card/40 backdrop-blur-xl rounded-lg md:rounded-xl lg:rounded-2xl p-2.5 md:p-4 lg:p-6 border border-border/40"
          >
            {/* Circle skeleton */}
            <div className="w-16 h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 mx-auto mb-1.5 md:mb-2 lg:mb-4 rounded-full bg-muted/40 animate-pulse" />

            {/* Value skeleton */}
            <div className="h-6 md:h-8 lg:h-10 w-16 mx-auto mb-1 bg-muted/50 rounded animate-pulse" />

            {/* Label skeleton */}
            <div className="h-3 md:h-4 w-12 mx-auto bg-muted/30 rounded animate-pulse" />

            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{ translateX: ['100%', '-100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: i * 0.1 }}
            />
          </div>
        ))}
      </div>

      {/* Section title skeleton */}
      <div className="text-center space-y-2">
        <div className="h-7 md:h-8 w-48 mx-auto bg-muted/50 rounded-xl animate-pulse" />
        <div className="h-4 w-32 mx-auto bg-muted/30 rounded animate-pulse" />
      </div>

      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="relative overflow-hidden bg-card/60 dark:bg-card/40 backdrop-blur-xl rounded-2xl p-4 md:p-5 border border-border/40"
          >
            <div className="flex items-start gap-3 md:gap-4 mb-2">
              {/* Icon skeleton */}
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-muted/40 animate-pulse flex-shrink-0" />

              <div className="flex-1 space-y-2">
                {/* Label skeleton */}
                <div className="h-3 w-24 bg-muted/30 rounded animate-pulse" />
                {/* Value skeleton */}
                <div className="h-8 md:h-10 w-20 bg-muted/50 rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Description skeleton */}
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-muted/20 rounded animate-pulse" />
              <div className="h-3 w-4/5 bg-muted/20 rounded animate-pulse" />
            </div>

            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{ translateX: ['100%', '-100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: i * 0.15 }}
            />
          </div>
        ))}
      </div>

      {/* Progress bars skeleton */}
      <div className="relative overflow-hidden bg-card/60 dark:bg-card/40 backdrop-blur-xl rounded-3xl p-5 md:p-6 border border-border/40">
        <div className="h-6 w-40 mx-auto mb-5 bg-muted/50 rounded-xl animate-pulse" />

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-3 w-32 bg-muted/30 rounded animate-pulse" />
                <div className="h-5 w-12 bg-muted/50 rounded animate-pulse" />
              </div>
              <div className="h-2.5 md:h-3 w-full bg-muted/30 rounded-full animate-pulse" />
            </div>
          ))}
        </div>

        {/* Shimmer */}
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{ translateX: ['100%', '-100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Chart skeleton */}
      <div className="relative overflow-hidden bg-card/60 dark:bg-card/40 backdrop-blur-xl rounded-3xl p-5 md:p-6 border border-border/40">
        <div className="space-y-3 mb-4">
          <div className="h-6 w-48 mx-auto bg-muted/50 rounded-xl animate-pulse" />
          <div className="h-4 w-32 mx-auto bg-muted/30 rounded animate-pulse" />
        </div>

        {/* Chart area */}
        <div className="h-56 md:h-64 lg:h-80 bg-muted/20 rounded-2xl animate-pulse mb-4" />

        {/* Bottom cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted/30 rounded-xl p-3 md:p-4 animate-pulse">
              <div className="h-5 w-16 mx-auto mb-1 bg-muted/40 rounded" />
              <div className="h-3 w-24 mx-auto bg-muted/30 rounded" />
            </div>
          ))}
        </div>

        {/* Shimmer */}
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{ translateX: ['100%', '-100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </div>
  );
};
