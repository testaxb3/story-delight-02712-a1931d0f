/**
 * BADGE STATS V2 - Information Dense
 * Removed decorative emojis, increased information density
 * Apple-style: Clean, precise, functional
 */

import { memo } from 'react';
import { Trophy, Flame, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import type { BadgeStats } from '@/types/achievements';

interface BadgeStatsV2Props {
  stats: BadgeStats;
}

export const BadgeStatsV2 = memo(({ stats }: BadgeStatsV2Props) => {
  const streakGrade = stats.currentStreak >= 30 ? 'S' : stats.currentStreak >= 14 ? 'A' : stats.currentStreak >= 7 ? 'B' : 'C';
  const badgeGrade = stats.percentage >= 90 ? 'S' : stats.percentage >= 70 ? 'A' : stats.percentage >= 50 ? 'B' : 'C';

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {/* Current Streak */}
      <div className="bg-card rounded-2xl p-4 border border-border/40 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-orange-100/50 dark:bg-orange-900/20 flex items-center justify-center">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
          </div>
          <div className={`
            text-xs font-bold px-2 py-0.5 rounded-full
            ${streakGrade === 'S' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' : ''}
            ${streakGrade === 'A' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : ''}
            ${streakGrade === 'B' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : ''}
            ${streakGrade === 'C' ? 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400' : ''}
          `}>
            {streakGrade}
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground leading-none mb-1">
          {stats.currentStreak}
        </div>
        <div className="text-xs text-muted-foreground font-medium">
          day{stats.currentStreak !== 1 ? 's' : ''} streak
        </div>
        {stats.longestStreak > stats.currentStreak && (
          <div className="text-[10px] text-muted-foreground/60 mt-2">
            record: {stats.longestStreak}
          </div>
        )}
      </div>

      {/* Badges Progress */}
      <div className="bg-card rounded-2xl p-4 border border-border/40 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100/50 dark:bg-indigo-900/20 flex items-center justify-center">
            <Trophy className="w-4 h-4 fill-indigo-500 text-indigo-500" />
          </div>
          <div className={`
            text-xs font-bold px-2 py-0.5 rounded-full
            ${badgeGrade === 'S' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' : ''}
            ${badgeGrade === 'A' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : ''}
            ${badgeGrade === 'B' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : ''}
            ${badgeGrade === 'C' ? 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400' : ''}
          `}>
            {badgeGrade}
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground leading-none mb-1">
          {stats.unlockedCount}/{stats.totalCount}
        </div>
        <div className="text-xs text-muted-foreground font-medium mb-2">
          badges earned
        </div>
        <Progress
          value={stats.percentage}
          className="h-1.5 bg-indigo-100 dark:bg-indigo-900/20"
          indicatorClassName="bg-indigo-500"
        />
      </div>

      {/* Completion Rate */}
      <div className="bg-card rounded-2xl p-4 border border-border/40 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-green-100/50 dark:bg-green-900/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground leading-none mb-1">
          {Math.round(stats.percentage)}%
        </div>
        <div className="text-xs text-muted-foreground font-medium">
          completion rate
        </div>
        {stats.percentage < 100 && (
          <div className="text-[10px] text-muted-foreground/60 mt-2">
            {stats.totalCount - stats.unlockedCount} remaining
          </div>
        )}
      </div>
    </div>
  );
});

BadgeStatsV2.displayName = 'BadgeStatsV2';
