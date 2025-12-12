import { forwardRef } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ScriptCardSkeleton() {
  return (
    <Card className="p-4 space-y-3">
      {/* Title */}
      <Skeleton className="h-6 w-3/4" />

      {/* Category & Profile badges */}
      <div className="flex gap-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-24" />
      </div>

      {/* Description lines */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-9" />
      </div>
    </Card>
  );
}

// Using forwardRef to fix AnimatePresence warning
export const ScriptCardSkeletonList = forwardRef<HTMLDivElement, { count?: number }>(
  function ScriptCardSkeletonList({ count = 6 }, ref) {
    return (
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <ScriptCardSkeleton key={i} />
        ))}
      </div>
    );
  }
);
