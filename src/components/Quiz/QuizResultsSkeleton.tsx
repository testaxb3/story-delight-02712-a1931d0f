import { motion } from 'framer-motion';

export const QuizResultsSkeleton = () => {
  return (
    <div className="space-y-5 pb-32">
      {/* Social Proof Banner Skeleton */}
      <div className="flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-muted/30 border border-border/30 animate-pulse">
        <div className="flex -space-x-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-8 h-8 rounded-full bg-muted/50" />
          ))}
        </div>
        <div className="flex-1 space-y-1">
          <div className="h-3 w-24 bg-muted/50 rounded" />
          <div className="h-2 w-32 bg-muted/30 rounded" />
        </div>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3.5 h-3.5 rounded bg-muted/50" />
          ))}
        </div>
      </div>

      {/* Hero Card Skeleton */}
      <div className="relative overflow-hidden rounded-[2rem] bg-card/80 border border-border/50 p-6">
        <div className="h-1.5 w-full bg-muted/30 rounded absolute top-0 left-0 right-0" />

        <div className="flex flex-col items-center text-center pt-4">
          {/* Emoji placeholder */}
          <div className="w-20 h-20 rounded-full bg-muted/30 mb-4 animate-pulse" />

          {/* Badge placeholder */}
          <div className="h-8 w-32 rounded-full bg-muted/30 mb-3 animate-pulse" />

          {/* Name */}
          <div className="h-3 w-40 bg-muted/20 rounded mb-4 animate-pulse" />

          {/* Title */}
          <div className="h-8 w-48 bg-muted/30 rounded mb-2 animate-pulse" />
          <div className="h-4 w-36 bg-muted/20 rounded mb-4 animate-pulse" />

          {/* Description */}
          <div className="space-y-2 w-full max-w-sm">
            <div className="h-3 w-full bg-muted/20 rounded animate-pulse" />
            <div className="h-3 w-4/5 bg-muted/20 rounded mx-auto animate-pulse" />
          </div>
        </div>

        {/* Shimmer */}
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{ translateX: ['100%', '-100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* What You Get Section Skeleton */}
      <div>
        <div className="h-5 w-40 bg-muted/30 rounded mb-4 animate-pulse" />
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 rounded-2xl bg-muted/10 border border-border/30 text-center animate-pulse">
              <div className="w-8 h-8 rounded bg-muted/30 mx-auto mb-2" />
              <div className="h-6 w-8 bg-muted/30 rounded mx-auto mb-1" />
              <div className="h-3 w-12 bg-muted/20 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Goals Section Skeleton */}
      <div>
        <div className="h-5 w-28 bg-muted/30 rounded mb-3 animate-pulse" />
        <div className="flex flex-wrap gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 w-28 rounded-full bg-muted/20 animate-pulse" />
          ))}
        </div>
      </div>

      {/* Tips Section Skeleton */}
      <div>
        <div className="h-5 w-44 bg-muted/30 rounded mb-3 animate-pulse" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/10 border border-border/30 animate-pulse">
              <div className="w-7 h-7 rounded-full bg-muted/30" />
              <div className="h-3 flex-1 bg-muted/20 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Success Metrics Skeleton */}
      <div>
        <div className="h-5 w-52 bg-muted/30 rounded mb-4 animate-pulse" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 rounded-2xl bg-muted/10 border border-border/30 animate-pulse">
              <div className="w-5 h-5 bg-muted/30 rounded mb-2" />
              <div className="h-6 w-16 bg-muted/30 rounded mb-1" />
              <div className="h-3 w-20 bg-muted/20 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial Skeleton */}
      <div className="p-5 rounded-2xl bg-muted/10 border border-border/30 animate-pulse">
        <div className="flex gap-0.5 mb-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-muted/30 rounded" />
          ))}
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-3 w-full bg-muted/20 rounded" />
          <div className="h-3 w-5/6 bg-muted/20 rounded" />
          <div className="h-3 w-4/6 bg-muted/20 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted/30" />
          <div className="space-y-1">
            <div className="h-3 w-20 bg-muted/30 rounded" />
            <div className="h-2 w-28 bg-muted/20 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};