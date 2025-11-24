import { memo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Target, TrendingUp } from 'lucide-react';

interface BadgeStatsProps {
  stats: {
    unlockedCount: number;
    totalCount: number;
    currentStreak: number;
    longestStreak: number;
    percentage: number;
  };
}

export const BadgeStats = memo(({ stats }: BadgeStatsProps) => {
  const statCards = [
    {
      icon: Trophy,
      label: 'Badges Unlocked',
      value: `${stats.unlockedCount}/${stats.totalCount}`,
      color: 'from-yellow-500 to-amber-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      icon: Target,
      label: 'Completion',
      value: `${stats.percentage}%`,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${stats.currentStreak} days`,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      icon: TrendingUp,
      label: 'Longest Streak',
      value: `${stats.longestStreak} days`,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className={`
              relative overflow-hidden rounded-2xl border border-border
              bg-card p-4 md:p-6
              hover:shadow-lg transition-shadow duration-300
            `}
          >
            {/* Background gradient */}
            <div 
              className={`absolute inset-0 opacity-5 bg-gradient-to-br ${stat.color}`} 
            />

            {/* Icon */}
            <div className={`${stat.bgColor} w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 relative z-10`}>
              <Icon className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
            </div>

            {/* Value */}
            <div className="relative z-10">
              <p className="text-2xl md:text-3xl font-black text-foreground mb-1">
                {stat.value}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground font-medium">
                {stat.label}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
});

BadgeStats.displayName = 'BadgeStats';
