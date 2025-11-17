import { TrendingUp } from 'lucide-react';
import { GradientText } from '@/components/common/GradientText';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import type { WeeklyWin } from '@/hooks/useDashboardStats';

interface ThisWeeksWinsProps {
  wins: WeeklyWin[];
  loading?: boolean;
}

export const ThisWeeksWins = ({ wins, loading = false }: ThisWeeksWinsProps) => {

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
    <div className="card-elevated p-6 rounded-2xl animate-fade-in">
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
            className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-muted/30 to-transparent border border-border/50 hover-lift cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:translate-x-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Icon */}
            <div className="text-3xl animate-pulse">
              {win.icon}
            </div>

            {/* Content */}
            <div className="flex-1">
              <h4 className="font-bold text-foreground">
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
