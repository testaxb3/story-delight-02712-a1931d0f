import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { useHaptic } from './useHaptic';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement: string;
  rarity?: string;
}

interface UserBadge {
  badge_id: string;
  unlocked_at: string;
}

interface UserStats {
  current_streak: number;
  longest_streak: number;
  days_completed: number;
  scripts_used: number;
  videos_watched: number;
  posts_created: number;
  reactions_received: number;
  badges_unlocked: number;
}

export interface BadgeWithProgress {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  unlocked: boolean;
  unlockedAt?: string;
  rarity?: string;
  progress?: {
    current: number;
    required: number;
    label: string;
  };
}

const parseRequirement = (requirement: string): { type: string; value: number } => {
  const [type, valueStr] = requirement.split(':');
  return { type, value: parseInt(valueStr) || 0 };
};

const getProgressLabel = (type: string): string => {
  const labels: Record<string, string> = {
    streak_days: 'days',
    scripts_used: 'scripts',
    videos_watched: 'videos',
    days_completed: 'days',
    posts_created: 'posts'
  };
  return labels[type] || 'items';
};

const calculateProgress = (badge: Badge, stats: UserStats): { current: number; required: number; label: string } | undefined => {
  const { type, value } = parseRequirement(badge.requirement);
  
  const progressMap: Record<string, number> = {
    streak_days: stats.current_streak,
    scripts_used: stats.scripts_used,
    videos_watched: stats.videos_watched,
    days_completed: stats.days_completed,
    posts_created: stats.posts_created
  };

  const current = progressMap[type];
  
  if (current === undefined) return undefined;

  return {
    current,
    required: value,
    label: getProgressLabel(type)
  };
};

export const useUserAchievements = (userId: string | undefined) => {
  const { triggerHaptic } = useHaptic();
  const previousBadgesRef = useRef<BadgeWithProgress[]>([]);

  const query = useQuery({
    queryKey: ['user-achievements', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required');

      // Fetch all badges
      const { data: badges, error: badgesError } = await supabase
        .from('badges')
        .select('*')
        .order('category', { ascending: true });

      if (badgesError) throw badgesError;

      // Fetch user's unlocked badges
      const { data: userBadges, error: userBadgesError } = await supabase
        .from('user_badges')
        .select('badge_id, unlocked_at')
        .eq('user_id', userId);

      if (userBadgesError) throw userBadgesError;

      // Fetch user stats
      const { data: stats, error: statsError } = await supabase
        .from('user_achievements_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (statsError) throw statsError;

      // Create a map of unlocked badges
      const unlockedMap = new Map<string, string>();
      userBadges?.forEach((ub: UserBadge) => {
        unlockedMap.set(ub.badge_id, ub.unlocked_at);
      });

      // Combine badge data with unlock status and progress
      const badgesWithProgress: BadgeWithProgress[] = (badges || []).map((badge: Badge) => {
        const unlocked = unlockedMap.has(badge.id);
        const unlockedAt = unlockedMap.get(badge.id);
        const progress = !unlocked ? calculateProgress(badge, stats) : undefined;

        return {
          id: badge.id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          category: badge.category,
          rarity: badge.rarity,
          unlocked,
          unlockedAt,
          progress
        };
      });

      const unlockedCount = badgesWithProgress.filter(b => b.unlocked).length;
      const totalCount = badgesWithProgress.length;
      const percentage = Math.round((unlockedCount / totalCount) * 100);

      return {
        badges: badgesWithProgress,
        stats: {
          unlockedCount,
          totalCount,
          percentage,
          currentStreak: stats.current_streak,
          longestStreak: stats.longest_streak,
          nextGoal: badgesWithProgress
            .filter(b => !b.unlocked && b.progress)
            .sort((a, b) => {
              const aProgress = a.progress!.current / a.progress!.required;
              const bProgress = b.progress!.current / b.progress!.required;
              return bProgress - aProgress;
            })[0]
        }
      };
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });

  // Detect new unlocks and show celebration
  useEffect(() => {
    if (!query.data?.badges) return;

    const currentBadges = query.data.badges;
    const previousBadges = previousBadgesRef.current;

    if (previousBadges.length > 0) {
      const newUnlocks = currentBadges.filter(
        current => current.unlocked && 
          !previousBadges.find(prev => prev.id === current.id)?.unlocked
      );

      newUnlocks.forEach(badge => {
        console.log('🎉 Badge unlocked:', badge.name);
        
        // Confetti explosion
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          console.log('✨ Confetti triggered successfully');
        } catch (error) {
          console.error('❌ Confetti failed:', error);
        }

        // Haptic feedback
        try {
          triggerHaptic('medium');
          setTimeout(() => triggerHaptic('light'), 200);
          setTimeout(() => triggerHaptic('light'), 400);
          console.log('📳 Haptic feedback triggered');
        } catch (error) {
          console.error('❌ Haptic failed:', error);
        }

        // Toast notification
        toast.success(`🏆 Badge Unlocked: ${badge.name}`, {
          description: badge.description,
          duration: 5000,
        });
        console.log('🔔 Toast notification displayed');
      });
    }

    previousBadgesRef.current = currentBadges;
  }, [query.data?.badges, triggerHaptic]);

  return query;
};
