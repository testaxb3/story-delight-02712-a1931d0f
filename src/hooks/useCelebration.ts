import React, { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import {
  getTodayScriptCount,
  getTotalScriptCount,
  getStreakDays,
  getDaysSinceStart,
} from '@/lib/celebrationStats';

export type CelebrationType =
  | 'script_success'
  | 'milestone_5'
  | 'first_today'
  | 'streak_3';

export interface CelebrationData {
  type: CelebrationType;
  scriptTitle?: string;
  totalScriptsUsed?: number;
  streakDays?: number;
  daysSinceStart?: number;
}

export function useCelebration() {
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] =
    useState<CelebrationData | null>(null);
  const { user } = useAuth();
  const { activeChild } = useChildProfiles();

  /**
   * Check if any milestone celebrations should be triggered
   * Returns the celebration type or null if none should trigger
   */
  const checkMilestones = useCallback(async (): Promise<CelebrationType | null> => {
    if (!user?.id) return null;

    try {
      // Get all stats in parallel
      const [todayCount, totalCount, streak] = await Promise.all([
        getTodayScriptCount(user.id),
        getTotalScriptCount(user.id),
        getStreakDays(user.id),
      ]);

      // Priority order: first_today > milestone_5 > streak_3

      // Check if this is the first script of the day
      if (todayCount === 1) {
        return 'first_today';
      }

      // Check if hit a milestone (every 5 scripts)
      if (totalCount > 0 && totalCount % 5 === 0) {
        return 'milestone_5';
      }

      // Check if hit a 3-day streak
      if (streak === 3) {
        return 'streak_3';
      }

      return null;
    } catch (error) {
      console.error('Error checking milestones:', error);
      return null;
    }
  }, [user?.id]);

  /**
   * Trigger a celebration with the given type and optional data
   */
  const triggerCelebration = useCallback(
    async (type: CelebrationType, extraData?: Partial<CelebrationData>) => {
      if (!user?.id) return;

      try {
        // Gather relevant stats based on celebration type
        const data: CelebrationData = {
          type,
          ...extraData,
        };

        // Add missing stats based on type
        if (type === 'milestone_5' && !data.totalScriptsUsed) {
          data.totalScriptsUsed = await getTotalScriptCount(user.id);
        }

        if (type === 'streak_3' && !data.streakDays) {
          data.streakDays = await getStreakDays(user.id);
        }

        if (type === 'first_today' && !data.daysSinceStart) {
          data.daysSinceStart = await getDaysSinceStart(user.id);
        }

        setCelebrationData(data);
        setShowCelebration(true);
      } catch (error) {
        console.error('Error triggering celebration:', error);
      }
    },
    [user?.id]
  );

  /**
   * Close the celebration modal
   */
  const closeCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);

  return {
    showCelebration,
    celebrationData,
    triggerCelebration,
    closeCelebration,
    checkMilestones,
  };
}
