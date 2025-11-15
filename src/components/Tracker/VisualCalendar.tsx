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
    if (!completed || level === null) return 'bg-muted/30 border-border/50';
    if (level <= 2) return 'bg-success/20 border-success';
    if (level <= 3) return 'bg-warning/20 border-warning';
    return 'bg-destructive/20 border-destructive';
  };

  return (
    <Card className="backdrop-blur-2xl bg-card/80 border border-border/50 rounded-3xl p-8 shadow-2xl shadow-primary/10">
      {/* Header with Streak */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Your 30-Day Journey
          </h3>
          <p className="text-muted-foreground mt-2">Track your transformation progress</p>
        </div>
        {currentStreak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 text-base rounded-2xl shadow-lg shadow-orange-500/20">
              <Flame className="w-5 h-5 mr-2" />
              {currentStreak} Day Streak
            </Badge>
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 mb-8 p-4 bg-muted/20 backdrop-blur-sm rounded-2xl border border-border/30">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-success" />
          <span className="text-muted-foreground font-medium">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <Circle className="w-5 h-5 text-muted-foreground" />
          <span className="text-muted-foreground font-medium">Not Started</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-success/20 border-2 border-success/40" />
          <span className="text-muted-foreground font-medium">Low Stress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-destructive/20 border-2 border-destructive/40" />
          <span className="text-muted-foreground font-medium">High Stress</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-6">
        {weeks.map((week, weekIndex) => (
          <motion.div 
            key={weekIndex} 
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: weekIndex * 0.05 }}
          >
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-muted-foreground w-20 px-3 py-1 bg-muted/30 rounded-full text-center">
                Week {weekIndex + 1}
              </span>
              <div className="grid grid-cols-7 gap-3 flex-1">
                {week.map((day) => (
                  <motion.button
                    key={day.dayNumber}
                    onClick={() => onDayClick(day.dayNumber)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'relative aspect-square rounded-2xl border-2 transition-all duration-300',
                      'flex flex-col items-center justify-center p-3',
                      'backdrop-blur-sm',
                      getStressColor(day.stressLevel, day.completed),
                      day.completed
                        ? 'hover:border-primary/60 cursor-pointer shadow-lg'
                        : 'hover:border-border/50 cursor-pointer'
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
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
