import { Clock, BookOpen } from 'lucide-react';
import { GradientText } from '@/components/common/GradientText';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import type { RecentScript } from '@/hooks/useDashboardStats';

interface RecentScriptUsageProps {
  recentScripts: RecentScript[];
  loading?: boolean;
}

export const RecentScriptUsage = ({ recentScripts, loading = false }: RecentScriptUsageProps) => {

  if (loading) {
    return (
      <div className="card-elevated p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (recentScripts.length === 0) {
    return null;
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'transitions': 'bg-primary/10 text-primary border-primary/20',
      'emotional-regulation': 'bg-accent/10 text-accent border-accent/20',
      'cooperation': 'bg-secondary/10 text-secondary border-secondary/20',
      'focus': 'bg-warning/10 text-warning border-warning/20',
      'bedtime': 'bg-success/10 text-success border-success/20',
      'connection': 'bg-primary/10 text-primary border-primary/20',
    };
    return colors[category] || 'bg-muted/10 text-muted-foreground border-border';
  };

  return (
    <div className="card-elevated p-6 rounded-2xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <GradientText as="h3" className="text-xl">
          Recent Script Usage
        </GradientText>
      </div>

      {/* Scripts List */}
      <div className="space-y-2">
        {recentScripts.slice(0, 5).map((script) => (
          <div
            key={script.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 hover:bg-muted/30 transition-all duration-200 hover:scale-[1.01] hover:translate-x-1 border border-border/50 cursor-pointer"
          >
            {/* Icon */}
            <div className="p-2 rounded-lg bg-gradient-primary transition-transform hover:rotate-12">
              <BookOpen className="w-4 h-4 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">
                {script.scriptTitle}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(script.usedAt), { addSuffix: true })}
              </p>
            </div>

            {/* Category Badge */}
            <Badge 
              variant="outline" 
              className={`text-xs ${getCategoryColor(script.scriptCategory)}`}
            >
              {script.scriptCategory}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
