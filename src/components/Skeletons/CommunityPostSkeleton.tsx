import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CommunityPostSkeleton() {
  return (
    <Card className="p-6 space-y-4">
      {/* Header - Avatar & Name */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-20" />
      </div>
    </Card>
  );
}

export function CommunityPostSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <CommunityPostSkeleton key={i} />
      ))}
    </div>
  );
}
