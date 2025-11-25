import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { differenceInDays, startOfDay, subDays } from 'date-fns';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  isAtRisk: boolean; // true if last completion was yesterday (need to complete today)
  lastCompletionDate: Date | null;
}

export const useRoutineStreak = (userId: string) => {
  const queryClient = useQueryClient();

  // Fetch streak data
  const { data: streakData, isLoading } = useQuery({
    queryKey: ['routine-streak', userId],
    queryFn: async (): Promise<StreakData> => {
      const { data: completions, error } = await supabase
        .from('routine_completions')
        .select('completed_at')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      if (!completions || completions.length === 0) {
        return {
          currentStreak: 0,
          longestStreak: 0,
          isAtRisk: false,
          lastCompletionDate: null,
        };
      }

      // Calculate current streak
      const today = startOfDay(new Date());
      const completionDates = completions
        .map((c) => startOfDay(new Date(c.completed_at)))
        .filter((date, index, self) => 
          // Remove duplicates (same day completions)
          self.findIndex(d => d.getTime() === date.getTime()) === index
        );

      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      // Check if completed today
      const lastCompletion = completionDates[0];
      const daysSinceLastCompletion = differenceInDays(today, lastCompletion);

      // Current streak calculation
      if (daysSinceLastCompletion === 0) {
        // Completed today
        currentStreak = 1;
        tempStreak = 1;

        // Count consecutive days backwards
        for (let i = 1; i < completionDates.length; i++) {
          const prevDate = completionDates[i];
          const expectedDate = subDays(lastCompletion, i);
          
          if (startOfDay(prevDate).getTime() === startOfDay(expectedDate).getTime()) {
            currentStreak++;
            tempStreak++;
          } else {
            break;
          }
        }
      } else if (daysSinceLastCompletion === 1) {
        // Last completion was yesterday - streak still active but at risk
        currentStreak = 1;
        tempStreak = 1;

        for (let i = 1; i < completionDates.length; i++) {
          const prevDate = completionDates[i];
          const expectedDate = subDays(lastCompletion, i);
          
          if (startOfDay(prevDate).getTime() === startOfDay(expectedDate).getTime()) {
            currentStreak++;
            tempStreak++;
          } else {
            break;
          }
        }
      }

      // Calculate longest streak ever
      for (let i = 0; i < completionDates.length; i++) {
        if (i === 0) {
          tempStreak = 1;
          continue;
        }

        const currentDate = completionDates[i];
        const prevDate = completionDates[i - 1];
        const daysDiff = differenceInDays(prevDate, currentDate);

        if (daysDiff === 1) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }

      longestStreak = Math.max(longestStreak, tempStreak);

      return {
        currentStreak,
        longestStreak,
        isAtRisk: daysSinceLastCompletion === 1,
        lastCompletionDate: lastCompletion,
      };
    },
    staleTime: 1000 * 60, // 1 minute
  });

  // Mutation to invalidate streak after completion
  const refreshStreak = useMutation({
    mutationFn: async () => {
      // Just invalidate the query to refetch
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routine-streak', userId] });
    },
  });

  return {
    streak: streakData?.currentStreak || 0,
    longestStreak: streakData?.longestStreak || 0,
    isAtRisk: streakData?.isAtRisk || false,
    lastCompletionDate: streakData?.lastCompletionDate,
    isLoading,
    refreshStreak: refreshStreak.mutate,
  };
};
