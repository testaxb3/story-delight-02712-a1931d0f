import { memo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

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
  const progressPercentage = stats.totalCount > 0 
    ? (stats.unlockedCount / stats.totalCount) * 100 
    : 0;

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {/* Day Streak Column */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        {/* Top Visual - Floating */}
        <div className="flex flex-col items-center justify-end h-40 pb-4">
          <div className="relative mb-2">
            <div className="text-8xl filter drop-shadow-xl animate-pulse-slow">🔥</div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 min-w-[2rem] h-8 px-2 bg-background rounded-full flex items-center justify-center text-base font-bold border-2 border-orange-500 shadow-sm z-10">
              {stats.currentStreak}
            </div>
          </div>
          <div className="text-sm font-medium text-muted-foreground mt-2">Day Streak</div>
        </div>

        {/* Bottom Card */}
        <div className="bg-card rounded-3xl p-4 shadow-sm border border-border/40 flex flex-col justify-center h-[6.5rem]">
           <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100/50 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0 text-orange-500 mt-0.5">
                <Flame className="w-4 h-4 fill-current" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
                 <div className="text-lg font-bold text-foreground leading-tight">{stats.longestStreak} days</div>
                 <div className="text-xs text-muted-foreground font-medium">longest streak</div>
              </div>
           </div>
        </div>
      </motion.div>

      {/* Badges Column */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-col gap-2"
      >
        {/* Top Visual - Floating */}
        <div className="flex flex-col items-center justify-end h-40 pb-4">
          <div className="relative mb-2">
            <div
              className="w-24 h-24 flex items-center justify-center shadow-xl relative group"
              style={{
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                background: 'linear-gradient(135deg, #4f46e5, #312e81)',
              }}
            >
               <div className="absolute inset-0 bg-black/10" style={{ clipPath: 'inherit' }} />
               <div className="absolute inset-[2px] bg-gradient-to-br from-indigo-500 to-indigo-700" style={{ clipPath: 'inherit' }} />
               <Trophy className="w-10 h-10 text-white relative z-10" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 min-w-[2rem] h-8 px-2 bg-background rounded-full flex items-center justify-center text-base font-bold border-2 border-indigo-500 shadow-sm z-10">
              {stats.unlockedCount}
            </div>
          </div>
          <div className="text-sm font-medium text-muted-foreground mt-2">Badges earned</div>
        </div>

        {/* Bottom Card */}
        <div className="bg-card rounded-3xl p-4 shadow-sm border border-border/40 flex flex-col justify-between h-[6.5rem]">
           <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100/50 dark:bg-indigo-900/20 flex items-center justify-center flex-shrink-0 text-indigo-500 mt-0.5">
                <Trophy className="w-4 h-4 fill-current" />
              </div>
              <div className="flex-1 min-w-0">
                 <div className="text-lg font-bold text-foreground leading-tight">
                    {stats.unlockedCount}/{stats.totalCount} <span className="text-sm font-normal text-muted-foreground ml-1">badges</span>
                 </div>
              </div>
           </div>
           <div className="w-full mt-auto pt-2">
             <Progress value={progressPercentage} className="h-1.5 bg-indigo-100 dark:bg-indigo-900/20" indicatorClassName="bg-indigo-500" />
           </div>
        </div>
      </motion.div>
    </div>
  );
});

BadgeStats.displayName = 'BadgeStats';