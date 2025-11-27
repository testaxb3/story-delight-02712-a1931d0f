/**
 * ACHIEVEMENTS TYPE DEFINITIONS
 * Centralized, strict typing for badge system
 * Zero tolerance for `any` types
 */

export type BadgeCategory = 'streak' | 'scripts' | 'videos' | 'tracker' | 'community' | 'special';

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface BadgeProgress {
  current: number;
  required: number;
  label: string;
  percentage: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  requirement: string;
  unlocked: boolean;
  unlocked_at: string | null;
  progress: BadgeProgress | null;
}

export interface BadgeStats {
  unlockedCount: number;
  totalCount: number;
  percentage: number;
  currentStreak: number;
  longestStreak: number;
}

export interface AchievementsData {
  badges: Badge[];
  stats: BadgeStats;
}

export interface BadgeUnlockEvent {
  badge: Badge;
  timestamp: string;
}

export const BADGE_CATEGORY_LABELS: Record<BadgeCategory, { label: string; emoji: string }> = {
  streak: { label: 'Streak', emoji: '🔥' },
  scripts: { label: 'Scripts', emoji: '📖' },
  videos: { label: 'Videos', emoji: '🎬' },
  tracker: { label: 'Tracker', emoji: '📝' },
  community: { label: 'Community', emoji: '💬' },
  special: { label: 'Special', emoji: '🏆' }
};

export const BADGE_RARITY_CONFIG: Record<BadgeRarity, {
  label: string;
  gradient: string;
  glow: string;
  ringWidth: number;
}> = {
  common: {
    label: 'Common',
    gradient: 'from-gray-400 to-gray-600',
    glow: 'shadow-gray-500/50',
    ringWidth: 2
  },
  rare: {
    label: 'Rare',
    gradient: 'from-blue-400 to-blue-600',
    glow: 'shadow-blue-500/50',
    ringWidth: 3
  },
  epic: {
    label: 'Epic',
    gradient: 'from-purple-400 to-purple-600',
    glow: 'shadow-purple-500/50',
    ringWidth: 4
  },
  legendary: {
    label: 'Legendary',
    gradient: 'from-yellow-400 to-orange-600',
    glow: 'shadow-yellow-500/50',
    ringWidth: 5
  }
};
