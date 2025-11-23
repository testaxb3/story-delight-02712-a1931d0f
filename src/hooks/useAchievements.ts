import { useMemo } from 'react';
import type { UserStats } from './useUserStats';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  progress?: string;
  gradient: {
    from: string;
    to: string;
  };
  borderColor: string;
  bgColor: string;
  textColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export interface AchievementProgress {
  unlockedCount: number;
  totalCount: number;
  percentage: number;
  nextAchievement: string;
  level: '🎯 Beginner' | '⭐ Advanced' | '🏆 Master';
}

/**
 * Custom hook to manage user achievements based on stats
 * @param stats - User statistics
 * @returns Object containing achievements array and progress info
 */
export function useAchievements(stats: UserStats) {
  const achievements = useMemo<Achievement[]>(() => {
    return [
      {
        id: 'first-login',
        title: 'First Login',
        description: 'Welcome!',
        emoji: '✅',
        unlocked: true,
        gradient: { from: 'green-400', to: 'emerald-500' },
        borderColor: 'border-green-400/50',
        bgColor: 'from-green-50 to-emerald-50',
        textColor: 'text-green-900',
        badgeBg: 'bg-green-500/20',
        badgeText: 'text-green-700',
        badgeBorder: 'border-green-500/30',
      },
      {
        id: 'week-warrior',
        title: 'Week Warrior',
        description: '7-day streak',
        emoji: '🔥',
        unlocked: stats.dayStreak >= 7,
        progress: `${stats.dayStreak}/7 days`,
        gradient: { from: 'red-400', to: 'orange-500' },
        borderColor: 'border-red-400/50',
        bgColor: 'from-red-50 to-orange-50',
        textColor: 'text-red-900',
        badgeBg: 'bg-red-500/20',
        badgeText: 'text-red-700',
        badgeBorder: 'border-red-500/30',
      },
      {
        id: 'script-master',
        title: 'Script Master',
        description: 'Use 10 scripts',
        emoji: '📚',
        unlocked: stats.scriptsUsed >= 10,
        progress: `${stats.scriptsUsed}/10 scripts`,
        gradient: { from: 'purple-400', to: 'blue-500' },
        borderColor: 'border-purple-400/50',
        bgColor: 'from-purple-50 to-blue-50',
        textColor: 'text-purple-900',
        badgeBg: 'bg-purple-500/20',
        badgeText: 'text-purple-700',
        badgeBorder: 'border-purple-500/30',
      },
      {
        id: 'video-graduate',
        title: 'Video Graduate',
        description: 'Watch 3 videos',
        emoji: '🎬',
        unlocked: stats.videosWatched >= 3,
        progress: `${stats.videosWatched}/3 videos`,
        gradient: { from: 'pink-400', to: 'rose-500' },
        borderColor: 'border-pink-400/50',
        bgColor: 'from-pink-50 to-rose-50',
        textColor: 'text-pink-900',
        badgeBg: 'bg-pink-500/20',
        badgeText: 'text-pink-700',
        badgeBorder: 'border-pink-500/30',
      },
      {
        id: 'community-star',
        title: 'Community Star',
        description: '5 posts',
        emoji: '💬',
        unlocked: stats.postsCreated >= 5,
        progress: `${stats.postsCreated}/5 posts`,
        gradient: { from: 'blue-400', to: 'cyan-500' },
        borderColor: 'border-blue-400/50',
        bgColor: 'from-blue-50 to-cyan-50',
        textColor: 'text-blue-900',
        badgeBg: 'bg-blue-500/20',
        badgeText: 'text-blue-700',
        badgeBorder: 'border-blue-500/30',
      },
      {
        id: '30-day-hero',
        title: '30-Day Hero',
        description: '30-day streak',
        emoji: '🏆',
        unlocked: stats.dayStreak >= 30,
        progress: `${stats.dayStreak}/30 days`,
        gradient: { from: 'yellow-400', to: 'amber-500' },
        borderColor: 'border-yellow-400/50',
        bgColor: 'from-yellow-50 to-amber-50',
        textColor: 'text-yellow-900',
        badgeBg: 'bg-yellow-500/20',
        badgeText: 'text-yellow-700',
        badgeBorder: 'border-yellow-500/30',
      },
    ];
  }, [stats]);

  const progress = useMemo<AchievementProgress>(() => {
    const unlockedCount = achievements.filter((a) => a.unlocked).length;
    const totalCount = achievements.length;
    const percentage = Math.round((unlockedCount / totalCount) * 100);

    let nextAchievement = 'All achievements unlocked! 🎉';
    if (stats.dayStreak < 7) {
      nextAchievement = 'Next: Complete a 7-day streak 🔥';
    } else if (stats.scriptsUsed < 10) {
      nextAchievement = 'Next: Use 10 scripts 📚';
    } else if (stats.videosWatched < 3) {
      nextAchievement = 'Next: Watch 3 videos 🎬';
    } else if (stats.postsCreated < 5) {
      nextAchievement = 'Next: Create 5 community posts 💬';
    } else if (stats.dayStreak < 30) {
      nextAchievement = 'Next: Reach 30-day streak 🏆';
    }

    const level =
      percentage < 50 ? '🎯 Beginner' : percentage < 100 ? '⭐ Advanced' : '🏆 Master';

    return {
      unlockedCount,
      totalCount,
      percentage,
      nextAchievement,
      level,
    };
  }, [achievements, stats]);

  return { achievements, progress };
}
