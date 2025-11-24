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
    <div className="grid grid-cols-2 gap-3">
      {/* Day Streak - Estilo da referência */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-card rounded-2xl p-4 overflow-hidden border border-border/50"
      >
        {/* Sparkles decorativos */}
        {stats.currentStreak > 0 && (
          <>
            <div className="absolute top-2 right-2 text-xs">✨</div>
            <div className="absolute bottom-2 left-2 text-xs">✨</div>
          </>
        )}

        <div className="flex flex-col items-center text-center relative z-10">
          {/* Ícone grande com emoji 3D style */}
          <div className="relative mb-3">
            <div className="text-5xl mb-1">🔥</div>
            {/* Número no círculo branco */}
            {stats.currentStreak > 0 && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-background rounded-full flex items-center justify-center text-xs font-bold border-2 border-orange-500">
                {stats.currentStreak}
              </div>
            )}
          </div>

          <div className="text-sm font-semibold text-foreground mb-0.5">Day Streak</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Flame className="w-3 h-3 text-orange-500" />
            <span className="font-medium text-foreground">{stats.currentStreak} days</span>
            <span>longest streak</span>
          </div>
        </div>
      </motion.div>

      {/* Badges Earned - Estilo da referência */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative bg-card rounded-2xl p-4 overflow-hidden border border-border/50"
      >
        <div className="flex flex-col items-center text-center relative z-10">
          {/* Ícone hexagonal 3D style */}
          <div className="relative mb-3">
            <div
              className="w-16 h-16 flex items-center justify-center"
              style={{
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              }}
            >
              <Trophy className="w-7 h-7 text-white drop-shadow-md" />
            </div>
            {/* Número no círculo */}
            {stats.unlockedCount > 0 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-background rounded-full flex items-center justify-center text-xs font-bold border-2 border-indigo-500">
                {stats.unlockedCount}
              </div>
            )}
          </div>

          <div className="text-sm font-semibold text-foreground mb-0.5">Badges earned</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Trophy className="w-3 h-3 text-indigo-500" />
            <span className="font-medium text-foreground">{stats.unlockedCount}/{stats.totalCount}</span>
            <span>badges</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

BadgeStats.displayName = 'BadgeStats';
