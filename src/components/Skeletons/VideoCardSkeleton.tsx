import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function VideoCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Thumbnail */}
      <Skeleton className="h-48 w-full rounded-t-lg" />

      {/* Content */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />

        {/* Meta info */}
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </Card>
  );
}

export function VideoCardSkeletonList({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  );
}
