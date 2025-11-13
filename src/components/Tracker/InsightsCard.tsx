import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingDown, Calendar, Zap } from 'lucide-react';

interface DayData {
  dayNumber: number;
  completed: boolean;
  stressLevel: number | null;
  meltdownCount: string | null;
  completedAt: string | null;
}

interface InsightsCardProps {
  days: DayData[];
}

export function InsightsCard({ days }: InsightsCardProps) {
  const insights = useMemo(() => {
    const completedDays = days.filter(d => d.completed);
    if (completedDays.length < 7) return [];

    const results: Array<{ type: 'success' | 'info' | 'warning'; message: string; icon: typeof Lightbulb }> = [];

    // Pattern: Best day of week
    const dayOfWeekStats: { [key: string]: { stress: number[], meltdowns: number } } = {};
    completedDays.forEach(day => {
      if (day.completedAt && day.stressLevel !== null) {
        const date = new Date(day.completedAt);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        if (!dayOfWeekStats[dayName]) {
          dayOfWeekStats[dayName] = { stress: [], meltdowns: 0 };
        }
        dayOfWeekStats[dayName].stress.push(day.stressLevel);
        if (day.meltdownCount && day.meltdownCount !== '0') {
          dayOfWeekStats[dayName].meltdowns++;
        }
      }
    });

    const avgStressByDay = Object.entries(dayOfWeekStats).map(([day, data]) => ({
      day,
      avgStress: data.stress.reduce((a, b) => a + b, 0) / data.stress.length,
      meltdowns: data.meltdowns,
    })).sort((a, b) => a.avgStress - b.avgStress);

    if (avgStressByDay.length > 0) {
      const bestDay = avgStressByDay[0];
      const worstDay = avgStressByDay[avgStressByDay.length - 1];

      results.push({
        type: 'success',
        message: `${bestDay.day}s are your best days with average stress of ${bestDay.avgStress.toFixed(1)}/5`,
        icon: TrendingDown,
      });

      if (worstDay.avgStress > 3.5) {
        results.push({
          type: 'warning',
          message: `${worstDay.day}s are more challenging. Consider preparing extra scripts for these days.`,
          icon: Calendar,
        });
      }
    }

    // Pattern: Recent streak
    let streak = 0;
    for (let i = completedDays.length - 1; i >= 0; i--) {
      if (completedDays[i].completed) streak++;
      else break;
    }

    if (streak >= 3) {
      results.push({
        type: 'success',
        message: `You're on a ${streak}-day streak! Keep building this momentum.`,
        icon: Zap,
      });
    }

    // Pattern: Stress improvement
    const recentDays = completedDays.slice(-7);
    const olderDays = completedDays.slice(-14, -7);
    
    if (recentDays.length >= 5 && olderDays.length >= 5) {
      const recentAvgStress = recentDays
        .filter(d => d.stressLevel !== null)
        .reduce((sum, d) => sum + (d.stressLevel || 0), 0) / recentDays.length;
      
      const olderAvgStress = olderDays
        .filter(d => d.stressLevel !== null)
        .reduce((sum, d) => sum + (d.stressLevel || 0), 0) / olderDays.length;

      const improvement = ((olderAvgStress - recentAvgStress) / olderAvgStress) * 100;

      if (improvement > 10) {
        results.push({
          type: 'success',
          message: `Your stress levels are down ${Math.round(improvement)}% compared to last week! 🎉`,
          icon: TrendingDown,
        });
      }
    }

    return results.slice(0, 3); // Show top 3 insights
  }, [days]);

  if (insights.length === 0) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-warning" />
        <h3 className="font-bold text-lg text-foreground">Smart Insights</h3>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
            >
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                insight.type === 'success' ? 'text-success' :
                insight.type === 'warning' ? 'text-warning' :
                'text-primary'
              }`} />
              <p className="text-sm text-foreground leading-relaxed">{insight.message}</p>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
