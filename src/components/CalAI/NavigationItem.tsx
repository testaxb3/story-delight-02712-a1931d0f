import { ChevronRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationItemProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  className?: string;
  showChevron?: boolean;
}

export function NavigationItem({
  icon: Icon,
  title,
  subtitle,
  onClick,
  className,
  showChevron = true,
}: NavigationItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-between w-full py-4 border-b border-border/50 last:border-0 transition-colors hover:bg-muted/50",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-foreground/70" />
        <div className="text-left">
          <p className="font-medium text-sm text-foreground">{title}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {showChevron && (
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      )}
    </button>
  );
}
