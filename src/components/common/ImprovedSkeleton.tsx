import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'card' | 'text' | 'avatar' | 'button';
}

export const ImprovedSkeleton = ({ 
  className, 
  variant = 'default',
  ...props 
}: SkeletonProps) => {
  const baseClasses = "relative overflow-hidden rounded-md bg-muted";
  
  const variantClasses = {
    default: "",
    card: "h-48 w-full",
    text: "h-4 w-full",
    avatar: "h-10 w-10 rounded-full",
    button: "h-10 w-24 rounded-lg"
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />
    </div>
  );
};

// Preset skeleton components for common use cases
export const CardSkeleton = () => (
  <div className="space-y-4 p-6 border border-border rounded-xl bg-card">
    <div className="flex items-center gap-4">
      <ImprovedSkeleton variant="avatar" />
      <div className="space-y-2 flex-1">
        <ImprovedSkeleton variant="text" className="w-3/4" />
        <ImprovedSkeleton variant="text" className="w-1/2" />
      </div>
    </div>
    <ImprovedSkeleton variant="card" className="h-32" />
    <div className="flex gap-2">
      <ImprovedSkeleton variant="button" />
      <ImprovedSkeleton variant="button" />
    </div>
  </div>
);

export const TextBlockSkeleton = () => (
  <div className="space-y-3">
    <ImprovedSkeleton variant="text" className="w-full" />
    <ImprovedSkeleton variant="text" className="w-5/6" />
    <ImprovedSkeleton variant="text" className="w-4/6" />
  </div>
);

export const ListSkeleton = ({ items = 3 }: { items?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);
