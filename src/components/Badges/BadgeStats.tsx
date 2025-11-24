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
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Day Streak */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl p-6 border border-border"
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Flame className="w-8 h-8 text-white" />
            </div>
            {stats.currentStreak > 0 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-background border-2 border-orange-500 rounded-full flex items-center justify-center text-xs font-bold">
                {stats.currentStreak}
              </div>
            )}
          </div>
          <div className="text-sm font-semibold text-foreground mb-1">Day Streak</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Flame className="w-3 h-3" />
            <span>{stats.longestStreak} days</span>
            <span className="text-muted-foreground/60">longest streak</span>
          </div>
        </div>
      </motion.div>

      {/* Badges Earned */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl p-6 border border-border"
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            {stats.unlockedCount > 0 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-background border-2 border-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                {stats.unlockedCount}
              </div>
            )}
          </div>
          <div className="text-sm font-semibold text-foreground mb-1">Badges earned</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Trophy className="w-3 h-3" />
            <span className="font-semibold text-foreground">{stats.unlockedCount}/{stats.totalCount} badges</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

BadgeStats.displayName = 'BadgeStats';
