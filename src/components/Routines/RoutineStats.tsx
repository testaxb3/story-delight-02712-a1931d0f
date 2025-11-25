import { motion } from 'framer-motion';
import { Clock, CheckCircle, Trophy, TrendingUp } from 'lucide-react';
import { useRoutineStats } from '@/hooks/useRoutineStats';
import { useAuth } from '@/contexts/AuthContext';

export const RoutineStats = () => {
  const { user } = useAuth();
  const { stats, isLoading } = useRoutineStats(user?.id || '');

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-border rounded w-1/3" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-border rounded" />
            <div className="h-20 bg-border rounded" />
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      icon: CheckCircle,
      label: 'Completed',
      value: stats.totalCompletions,
      subtitle: `${stats.completionsThisWeek} this week`,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Clock,
      label: 'Total Time',
      value: `${Math.floor(stats.totalTimeSpent / 60)}m`,
      subtitle: `${stats.completionsThisMonth} this month`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: TrendingUp,
      label: 'Mood Impact',
      value: stats.moodImprovement > 0 ? `+${stats.moodImprovement.toFixed(1)}` : stats.moodImprovement.toFixed(1),
      subtitle: 'Average improvement',
      color: stats.moodImprovement > 0 ? 'text-green-500' : 'text-muted-foreground',
      bgColor: stats.moodImprovement > 0 ? 'bg-green-500/10' : 'bg-muted/10',
    },
    {
      icon: Trophy,
      label: 'Most Used',
      value: stats.mostUsedRoutine?.title.slice(0, 12) || 'None',
      subtitle: stats.mostUsedRoutine ? `${stats.mostUsedRoutine.count}x` : '',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-6 space-y-4"
    >
      <h3 className="text-lg font-semibold text-foreground">Your Stats</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`${stat.bgColor} rounded-xl p-4 space-y-2`}
          >
            <div className="flex items-center gap-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            {stat.subtitle && (
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
