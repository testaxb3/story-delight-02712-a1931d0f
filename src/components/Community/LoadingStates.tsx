import React from 'react';
import { motion } from 'framer-motion';

export const PostSkeleton = React.memo(function PostSkeleton({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl relative overflow-hidden"
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-white/10 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
          <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
        </div>
      </div>

      {/* Title */}
      <div className="h-6 w-3/4 bg-white/10 rounded mb-3 animate-pulse" />

      {/* Content lines */}
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-4/6 bg-white/10 rounded animate-pulse" />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-3 border-t border-white/5">
        <div className="flex-1 h-11 bg-white/10 rounded-xl animate-pulse" />
        <div className="flex-1 h-11 bg-white/10 rounded-xl animate-pulse" />
      </div>
    </motion.div>
  );
});

export const PostsFeedSkeleton = React.memo(function PostsFeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-5">
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeleton key={i} index={i} />
      ))}
    </div>
  );
});

export const MembersListSkeleton = React.memo(function MembersListSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="h-8 w-40 bg-white/10 rounded animate-pulse" />
        <div className="h-8 w-24 bg-white/10 rounded-full animate-pulse" />
      </div>
      <div className="flex gap-4 overflow-x-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-[72px] h-[72px] rounded-full bg-white/10 animate-pulse" />
            <div className="h-6 w-16 bg-white/10 rounded-full animate-pulse" />
            <div className="h-4 w-14 bg-white/10 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </motion.div>
  );
});
