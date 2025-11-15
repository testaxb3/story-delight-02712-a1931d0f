import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingDown, TrendingUp, Minus, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DayData {
  completed: boolean;
  stressLevel: number | null;
  meltdownCount: string | null;
}

interface ProgressDashboardProps {
  days: DayData[];
  totalDays: number;
}

export function ProgressDashboard({ days, totalDays }: ProgressDashboardProps) {
  const stats = useMemo(() => {
    const completedDays = days.filter(d => d.completed).length;
    const percentage = Math.round((completedDays / totalDays) * 100);

    // This week vs last week (last 7 days vs previous 7 days)
    const thisWeek = days.slice(-7);
    const lastWeek = days.slice(-14, -7);

    const avgStress = (week: DayData[]) => {
      const completed = week.filter(d => d.completed && d.stressLevel !== null);
      if (completed.length === 0) return null;
      return completed.reduce((sum, d) => sum + (d.stressLevel || 0), 0) / completed.length;
    };

    const countMeltdowns = (week: DayData[]) => {
      return week.filter(d => d.completed && d.meltdownCount && d.meltdownCount !== '0').length;
    };

    const thisWeekStress = avgStress(thisWeek);
    const lastWeekStress = avgStress(lastWeek);
    const stressDiff = thisWeekStress && lastWeekStress 
      ? Math.round(((thisWeekStress - lastWeekStress) / lastWeekStress) * 100)
      : null;

    const thisWeekMeltdowns = countMeltdowns(thisWeek);
    const lastWeekMeltdowns = countMeltdowns(lastWeek);
    const meltdownDiff = lastWeekMeltdowns > 0
      ? Math.round(((thisWeekMeltdowns - lastWeekMeltdowns) / lastWeekMeltdowns) * 100)
      : null;

    const thisWeekCompletion = thisWeek.filter(d => d.completed).length;
    const lastWeekCompletion = lastWeek.filter(d => d.completed).length;
    const completionDiff = lastWeekCompletion > 0
      ? Math.round(((thisWeekCompletion - lastWeekCompletion) / lastWeekCompletion) * 100)
      : null;

    return {
      completedDays,
      percentage,
      stressDiff,
      meltdownDiff,
      completionDiff,
      thisWeekStress,
    };
  }, [days, totalDays]);

  const getTrendIcon = (diff: number | null) => {
    if (diff === null) return Minus;
    if (diff > 0) return TrendingUp;
    if (diff < 0) return TrendingDown;
    return Minus;
  };

  const getTrendColor = (diff: number | null, lowerIsBetter: boolean = true) => {
    if (diff === null) return 'text-muted-foreground';
    const isPositive = lowerIsBetter ? diff < 0 : diff > 0;
    return isPositive ? 'text-success' : 'text-destructive';
  };

  return (
    <Card className="backdrop-blur-2xl bg-card/80 border border-border/50 rounded-3xl p-8 shadow-2xl shadow-primary/10">
      {/* Main Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Your Transformation Journey
            </h3>
            <p className="text-muted-foreground mt-2">
              {stats.completedDays}/{totalDays} days complete
            </p>
          </div>
          <div className="text-right">
            <motion.div 
              className="text-5xl font-black bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              {stats.percentage}%
            </motion.div>
            <p className="text-sm text-muted-foreground font-medium mt-1">Progress</p>
          </div>
        </div>
        <div className="relative h-4 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/70 rounded-full shadow-lg shadow-primary/20"
            initial={{ width: 0 }}
            animate={{ width: `${stats.percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Weekly Comparison */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <h4 className="font-bold text-foreground text-lg">This Week vs Last Week</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Stress Level */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-sm bg-muted/20 border border-border/30 rounded-2xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-muted-foreground">Stress</span>
              {stats.stressDiff !== null && (
                <div className={cn('flex items-center gap-1 text-sm font-bold', getTrendColor(stats.stressDiff, true))}>
                  {(() => {
                    const Icon = getTrendIcon(stats.stressDiff);
                    return <Icon className="w-4 h-4" />;
                  })()}
                  {Math.abs(stats.stressDiff)}%
                </div>
              )}
            </div>
            {stats.thisWeekStress !== null ? (
              <div className="text-2xl font-black text-foreground">
                {stats.thisWeekStress.toFixed(1)}/5
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No data yet</div>
            )}
          </motion.div>

          {/* Meltdowns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-sm bg-muted/20 border border-border/30 rounded-2xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-muted-foreground">Meltdowns</span>
              {stats.meltdownDiff !== null && (
                <div className={cn('flex items-center gap-1 text-sm font-bold', getTrendColor(stats.meltdownDiff, true))}>
                  {(() => {
                    const Icon = getTrendIcon(stats.meltdownDiff);
                    return <Icon className="w-4 h-4" />;
                  })()}
                  {Math.abs(stats.meltdownDiff)}%
                </div>
              )}
            </div>
            <div className="text-2xl font-black text-foreground">
              {days.slice(-7).filter(d => d.completed && d.meltdownCount && d.meltdownCount !== '0').length} days
            </div>
          </motion.div>

          {/* Completion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-sm bg-muted/20 border border-border/30 rounded-2xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Completion</span>
              {stats.completionDiff !== null && (
                <div className={cn('flex items-center gap-1 text-sm font-bold', getTrendColor(stats.completionDiff, false))}>
                  {(() => {
                    const Icon = getTrendIcon(stats.completionDiff);
                    return <Icon className="w-4 h-4" />;
                  })()}
                  {Math.abs(stats.completionDiff)}%
                </div>
              )}
            </div>
            <div className="text-2xl font-black text-foreground">
              {days.slice(-7).filter(d => d.completed).length}/7 days
            </div>
          </motion.div>
        </div>
      </div>

      {/* Motivation Message */}
      {stats.percentage >= 50 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-sm bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-primary/20">
              <Target className="w-5 h-5 text-primary flex-shrink-0" />
            </div>
            <div>
              <p className="font-bold text-lg text-foreground">You're more than halfway there! 🎉</p>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                Keep going! You're building lasting changes in your parenting approach.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  );
}
