import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfWeek, endOfWeek, startOfMonth } from 'date-fns';

interface RoutineStats {
  totalCompletions: number;
  completionsThisWeek: number;
  completionsThisMonth: number;
  averageMoodBefore: number;
  averageMoodAfter: number;
  moodImprovement: number;
  mostUsedRoutine: {
    id: string;
    title: string;
    count: number;
  } | null;
  totalTimeSpent: number; // in seconds
  recentCompletions: Array<{
    id: string;
    routine_id: string;
    completed_at: string;
    duration_seconds: number;
    mood_before: string | null;
    mood_after: string | null;
  }>;
}

const moodToNumber = (mood: string | null): number => {
  const moodMap: Record<string, number> = {
    frustrated: 1,
    sad: 2,
    neutral: 3,
    happy: 4,
  };
  return mood ? moodMap[mood] || 3 : 3;
};

export const useRoutineStats = (userId: string) => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['routine-stats', userId],
    queryFn: async (): Promise<RoutineStats> => {
      const now = new Date();
      const weekStart = startOfWeek(now, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(now, { weekStartsOn: 0 });
      const monthStart = startOfMonth(now);

      // Fetch all completions
      const { data: completions, error } = await supabase
        .from('routine_completions')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      if (!completions || completions.length === 0) {
        return {
          totalCompletions: 0,
          completionsThisWeek: 0,
          completionsThisMonth: 0,
          averageMoodBefore: 3,
          averageMoodAfter: 3,
          moodImprovement: 0,
          mostUsedRoutine: null,
          totalTimeSpent: 0,
          recentCompletions: [],
        };
      }

      // Calculate stats
      const totalCompletions = completions.length;
      const completionsThisWeek = completions.filter(
        (c) => new Date(c.completed_at) >= weekStart && new Date(c.completed_at) <= weekEnd
      ).length;
      const completionsThisMonth = completions.filter(
        (c) => new Date(c.completed_at) >= monthStart
      ).length;

      // Mood analysis
      const completionsWithMood = completions.filter(
        (c) => c.mood_before && c.mood_after
      );
      const avgMoodBefore =
        completionsWithMood.reduce((sum, c) => sum + moodToNumber(c.mood_before), 0) /
        (completionsWithMood.length || 1);
      const avgMoodAfter =
        completionsWithMood.reduce((sum, c) => sum + moodToNumber(c.mood_after), 0) /
        (completionsWithMood.length || 1);

      // Most used routine
      const routineCounts: Record<string, number> = {};
      completions.forEach((c) => {
        routineCounts[c.routine_id] = (routineCounts[c.routine_id] || 0) + 1;
      });
      
      const mostUsedRoutineId = Object.entries(routineCounts).sort(
        ([, a], [, b]) => b - a
      )[0]?.[0];

      let mostUsedRoutine = null;
      if (mostUsedRoutineId) {
        const { data: routine } = await supabase
          .from('routines')
          .select('id, title')
          .eq('id', mostUsedRoutineId)
          .single();

        if (routine) {
          mostUsedRoutine = {
            id: routine.id,
            title: routine.title,
            count: routineCounts[mostUsedRoutineId],
          };
        }
      }

      // Total time
      const totalTimeSpent = completions.reduce(
        (sum, c) => sum + (c.duration_seconds || 0),
        0
      );

      // Recent completions (last 10)
      const recentCompletions = completions.slice(0, 10);

      return {
        totalCompletions,
        completionsThisWeek,
        completionsThisMonth,
        averageMoodBefore: avgMoodBefore,
        averageMoodAfter: avgMoodAfter,
        moodImprovement: avgMoodAfter - avgMoodBefore,
        mostUsedRoutine,
        totalTimeSpent,
        recentCompletions,
      };
    },
    staleTime: 1000 * 60, // 1 minute
  });

  return {
    stats: stats || {
      totalCompletions: 0,
      completionsThisWeek: 0,
      completionsThisMonth: 0,
      averageMoodBefore: 3,
      averageMoodAfter: 3,
      moodImprovement: 0,
      mostUsedRoutine: null,
      totalTimeSpent: 0,
      recentCompletions: [],
    },
    isLoading,
  };
};
