/**
 * BADGE STATS V2 - Premium Redesign
 * Animated numbers, gamer-style grades, animated fire streak
 * Glassmorphism + vibrant gradients
 */

import { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, TrendingUp, Zap, Star, Target, Award } from 'lucide-react';
import type { BadgeStats } from '@/types/achievements';

interface BadgeStatsV2Props {
  stats: BadgeStats;
}

// Animated counter hook
function useAnimatedCounter(target: number, duration: number = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }

    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return count;
}

// Grade badge component - only shows S, A, B (never C)
const GradeBadge = ({ grade, show = true }: { grade: string; show?: boolean }) => {
  // Never show C grade
  if (!show || grade === 'C') return null;

  const gradeStyles: Record<string, string> = {
    'S': 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-500/40 ring-2 ring-yellow-300/50',
    'A': 'bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-lg shadow-green-500/40',
    'B': 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg shadow-blue-500/40',
    'C': 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-md',
  };

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${gradeStyles[grade] || gradeStyles['C']}`}
    >
      {grade}
    </motion.div>
  );
};

// Animated fire icon with glow
const AnimatedFire = ({ active, streak }: { active: boolean; streak: number }) => (
  <div className="relative">
    {active ? (
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 3, -3, 0]
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative"
      >
        <Flame className="w-7 h-7 fill-orange-500 text-orange-500" />
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 blur-md"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <Flame className="w-7 h-7 fill-orange-500 text-orange-500" />
        </motion.div>
      </motion.div>
    ) : (
      <Flame className="w-7 h-7 text-gray-500" />
    )}
  </div>
);

export const BadgeStatsV2 = memo(({ stats }: BadgeStatsV2Props) => {
  const streakGrade = stats.currentStreak >= 30 ? 'S' : stats.currentStreak >= 14 ? 'A' : stats.currentStreak >= 7 ? 'B' : 'C';
  const badgeGrade = stats.percentage >= 90 ? 'S' : stats.percentage >= 70 ? 'A' : stats.percentage >= 50 ? 'B' : 'C';

  const animatedStreak = useAnimatedCounter(stats.currentStreak);
  const animatedUnlocked = useAnimatedCounter(stats.unlockedCount);
  const animatedPercentage = useAnimatedCounter(Math.round(stats.percentage));

  // Calculate XP (gamification)
  const totalXP = (stats.unlockedCount * 100) + (stats.currentStreak * 10) + (stats.longestStreak * 5);
  const level = Math.floor(totalXP / 500) + 1;
  const xpInLevel = totalXP % 500;
  const xpToNextLevel = 500;
  const xpProgress = (xpInLevel / xpToNextLevel) * 100;

  return (
    <div className="space-y-4 mb-6">
      {/* XP Bar - Premium */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-4 rounded-2xl bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 border border-white/10 backdrop-blur-xl overflow-hidden"
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/40"
              >
                <Star className="w-5 h-5 text-white fill-white" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-foreground">Level {level}</span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300"
                  >
                    {totalXP.toLocaleString()} XP
                  </motion.span>
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              {xpInLevel}/{xpToNextLevel} XP
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full relative"
            >
              {/* Animated shine */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 1 }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Stats Grid - Premium Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {/* Current Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative rounded-2xl p-4 overflow-hidden"
          style={{
            background: stats.currentStreak > 0
              ? 'linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.1) 100%)'
              : 'linear-gradient(135deg, rgba(100,100,100,0.1) 0%, rgba(80,80,80,0.1) 100%)',
            border: stats.currentStreak > 0
              ? '1px solid rgba(249,115,22,0.3)'
              : '1px solid rgba(100,100,100,0.2)'
          }}
        >
          {/* Background glow for active streak */}
          {stats.currentStreak > 0 && (
            <motion.div
              className="absolute -top-6 -right-6 w-20 h-20 bg-orange-500/30 rounded-full blur-2xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <AnimatedFire active={stats.currentStreak > 0} streak={stats.currentStreak} />
              <GradeBadge grade={streakGrade} show={stats.currentStreak > 0} />
            </div>

            <motion.div
              key={animatedStreak}
              className="text-3xl font-black text-foreground leading-none mb-1"
            >
              {animatedStreak}
            </motion.div>

            <div className="text-[11px] text-muted-foreground font-medium">
              day{stats.currentStreak !== 1 ? 's' : ''} streak
            </div>

            {stats.longestStreak > stats.currentStreak && (
              <div className="flex items-center gap-1 mt-2 text-[10px] text-orange-400/70">
                <Zap className="w-3 h-3" />
                best: {stats.longestStreak}
              </div>
            )}
          </div>
        </motion.div>

        {/* Badges Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative rounded-2xl p-4 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 100%)',
            border: '1px solid rgba(99,102,241,0.3)'
          }}
        >
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 0.5 }}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/40">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <GradeBadge grade={badgeGrade} show={stats.unlockedCount > 0} />
            </div>

            <div className="text-3xl font-black text-foreground leading-none mb-1">
              <span>{animatedUnlocked}</span>
              <span className="text-base text-muted-foreground font-bold">/{stats.totalCount}</span>
            </div>

            <div className="text-[11px] text-muted-foreground font-medium mb-2">
              badges earned
            </div>

            {/* Mini progress bar */}
            <div className="h-1.5 bg-indigo-500/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.percentage}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Completion Rate Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative rounded-2xl p-4 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.1) 100%)',
            border: '1px solid rgba(16,185,129,0.3)'
          }}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                <Target className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="text-3xl font-black text-foreground leading-none mb-1">
              {animatedPercentage}<span className="text-lg">%</span>
            </div>

            <div className="text-[11px] text-muted-foreground font-medium">
              completion
            </div>

            {stats.percentage < 100 ? (
              <div className="text-[10px] text-emerald-400/70 mt-2">
                {stats.totalCount - stats.unlockedCount} remaining
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold mt-2"
              >
                <Award className="w-3 h-3" />
                COMPLETE!
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
});

BadgeStatsV2.displayName = 'BadgeStatsV2';
