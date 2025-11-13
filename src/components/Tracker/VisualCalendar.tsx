import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Flame, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DayData {
  dayNumber: number;
  completed: boolean;
  stressLevel: number | null;
  meltdownCount: string | null;
  completedAt: string | null;
}

interface VisualCalendarProps {
  days: DayData[];
  onDayClick: (day: number) => void;
}

export function VisualCalendar({ days, onDayClick }: VisualCalendarProps) {
  const weeks = useMemo(() => {
    const weeksArray: DayData[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeksArray.push(days.slice(i, i + 7));
    }
    return weeksArray;
  }, [days]);

  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].completed) streak++;
      else break;
    }
    return streak;
  }, [days]);

  const getStressColor = (level: number | null, completed: boolean) => {
    if (!completed || level === null) return 'bg-muted';
    if (level <= 2) return 'bg-success/20 border-success/40';
    if (level <= 3) return 'bg-warning/20 border-warning/40';
    return 'bg-destructive/20 border-destructive/40';
  };

  return (
    <Card className="p-6 space-y-6">
      {/* Header with Streak */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Your 30-Day Journey</h3>
          <p className="text-sm text-muted-foreground mt-1">Track your transformation progress</p>
        </div>
        {currentStreak > 0 && (
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 text-base">
            <Flame className="w-4 h-4 mr-2" />
            {currentStreak} Day Streak
          </Badge>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <span className="text-muted-foreground">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <Circle className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Not Started</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-success/20 border-2 border-success/40" />
          <span className="text-muted-foreground">Low Stress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-destructive/20 border-2 border-destructive/40" />
          <span className="text-muted-foreground">High Stress</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-4">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-muted-foreground w-16">
                Week {weekIndex + 1}
              </span>
              <div className="grid grid-cols-7 gap-2 flex-1">
                {week.map((day) => (
                  <motion.button
                    key={day.dayNumber}
                    onClick={() => onDayClick(day.dayNumber)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'relative aspect-square rounded-xl border-2 transition-all touch-target',
                      'flex flex-col items-center justify-center p-2',
                      getStressColor(day.stressLevel, day.completed),
                      day.completed
                        ? 'hover:border-primary/60 cursor-pointer'
                        : 'hover:border-border cursor-pointer'
                    )}
                  >
                    {/* Day Number */}
                    <span className={cn(
                      'text-lg font-bold',
                      day.completed ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                      {day.dayNumber}
                    </span>

                    {/* Completion Icon */}
                    {day.completed && (
                      <CheckCircle2 className="absolute top-1 right-1 w-4 h-4 text-success" />
                    )}

                    {/* Milestone Badge */}
                    {day.completed && [7, 14, 21, 30].includes(day.dayNumber) && (
                      <Sparkles className="absolute bottom-1 left-1 w-3 h-3 text-warning animate-pulse" />
                    )}

                    {/* Meltdown Indicator */}
                    {day.completed && day.meltdownCount && day.meltdownCount !== '0' && (
                      <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-destructive" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
