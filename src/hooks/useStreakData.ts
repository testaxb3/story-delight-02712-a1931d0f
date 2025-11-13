import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface StreakDay {
  date: string;
  completed: boolean;
  count: number;
}

export interface StreakMilestone {
  days: number;
  label: string;
  icon: string;
  color: string;
  unlocked: boolean;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  last30Days: StreakDay[];
  milestones: StreakMilestone[];
  canRecover: boolean;
  recoveryDeadline: Date | null;
}

const MILESTONES: Omit<StreakMilestone, 'unlocked'>[] = [
  { days: 3, label: 'First Steps', icon: '👶', color: 'text-blue-500' },
  { days: 7, label: 'Week Warrior', icon: '⭐', color: 'text-green-500' },
  { days: 14, label: 'Two Weeks Strong', icon: '💪', color: 'text-purple-500' },
  { days: 30, label: 'Monthly Master', icon: '🏆', color: 'text-yellow-500' },
  { days: 60, label: 'Dedicated Parent', icon: '👑', color: 'text-pink-500' },
  { days: 100, label: 'Century Club', icon: '💎', color: 'text-cyan-500' },
];

export function useStreakData(userId?: string, childId?: string) {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    totalDays: 0,
    last30Days: [],
    milestones: MILESTONES.map(m => ({ ...m, unlocked: false })),
    canRecover: false,
    recoveryDeadline: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStreakData() {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Get all tracker days, ordered by date
        const { data: trackerDays, error } = await supabase
          .from('tracker_days')
          .select('date, completed, completed_at')
          .eq('user_id', userId)
          .order('date', { ascending: false });

        if (error) {
          console.error('Error fetching streak data:', error);
          setLoading(false);
          return;
        }

        // Calculate current streak
        let currentStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (trackerDays && trackerDays.length > 0) {
          // Check if streak is still active (completed today or yesterday)
          const mostRecentDate = new Date(trackerDays[0].date);
          mostRecentDate.setHours(0, 0, 0, 0);

          const daysDiff = Math.floor((today.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24));

          if (daysDiff <= 1 && trackerDays[0].completed) {
            // Streak is active, count consecutive days
            for (const day of trackerDays) {
              if (day.completed) {
                currentStreak++;
              } else {
                break;
              }
            }
          }
        }

        // Calculate longest streak
        let longestStreak = 0;
        let tempStreak = 0;

        if (trackerDays) {
          for (const day of trackerDays) {
            if (day.completed) {
              tempStreak++;
              longestStreak = Math.max(longestStreak, tempStreak);
            } else {
              tempStreak = 0;
            }
          }
        }

        // Total completed days
        const totalDays = trackerDays?.filter(d => d.completed).length || 0;

        // Generate last 30 days data
        const last30Days: StreakDay[] = [];
        for (let i = 29; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);

          const dateString = date.toISOString().split('T')[0];
          const trackerDay = trackerDays?.find(d => d.date === dateString);

          last30Days.push({
            date: dateString,
            completed: trackerDay?.completed || false,
            count: trackerDay?.completed ? 1 : 0,
          });
        }

        // Check if user can recover streak (missed yesterday but has been consistent)
        const canRecover = currentStreak === 0 && longestStreak >= 3;
        const recoveryDeadline = canRecover ? new Date(today.getTime() + 24 * 60 * 60 * 1000) : null;

        // Calculate unlocked milestones
        const milestones = MILESTONES.map(m => ({
          ...m,
          unlocked: longestStreak >= m.days,
        }));

        setStreakData({
          currentStreak,
          longestStreak,
          totalDays,
          last30Days,
          milestones,
          canRecover,
          recoveryDeadline,
        });
      } catch (error) {
        console.error('Error in fetchStreakData:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStreakData();
  }, [userId, childId]);

  return { streakData, loading };
}
