import { TrendingUp } from 'lucide-react';
import { GradientText } from '@/components/common/GradientText';
import { useWeeklyWins } from '@/hooks/useWeeklyWins';
import { Skeleton } from '@/components/ui/skeleton';

interface ThisWeeksWinsProps {
  userId: string | undefined;
}

export const ThisWeeksWins = ({ userId }: ThisWeeksWinsProps) => {
  const { wins, loading } = useWeeklyWins(userId);

  if (loading) {
    return (
      <div className="card-elevated p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-success" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  if (wins.length === 0) {
    return null;
  }

  return (
    <div className="card-elevated p-6 rounded-2xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-success" />
        <GradientText as="h3" className="text-xl">
          This Week's Wins
        </GradientText>
      </div>

      {/* Wins Grid */}
      <div className="space-y-3">
        {wins.map((win, index) => (
          <div 
            key={index}
            className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-muted/30 to-transparent border border-border/50 hover-lift"
          >
            {/* Icon */}
            <div className="text-3xl">{win.icon}</div>

            {/* Content */}
            <div className="flex-1">
              <h4 className={`font-bold ${win.color}`}>
                {win.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {win.metric}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
