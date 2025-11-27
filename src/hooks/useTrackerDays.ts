import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TrackerDay {
  id: string;
  day_number: number;
  date: string;
  completed: boolean;
  completed_at: string | null;
  stress_level: number | null;
}

export interface TrackerStats {
  nextDay: TrackerDay | null;
  completedDays: TrackerDay[];
  canLogToday: boolean;
  timeUntilNextLog: number | null; // milliseconds until next log available
  lastCompletedAt: string | null;
}

const COOLDOWN_HOURS = 20; // User can log again after 20 hours

export function useTrackerDays(userId?: string, childId?: string) {
  return useQuery({
    queryKey: ['tracker-days', userId, childId],
    queryFn: async (): Promise<TrackerStats> => {
      if (!userId || !childId) {
        return {
          nextDay: null,
          completedDays: [],
          canLogToday: false,
          timeUntilNextLog: null,
          lastCompletedAt: null,
        };
      }

      // Fetch all tracker days for this child
      const { data: trackerDays, error } = await supabase
        .from('tracker_days')
        .select('*')
        .eq('user_id', userId)
        .eq('child_profile_id', childId)
        .order('day_number');

      if (error) throw error;
      if (!trackerDays || trackerDays.length === 0) {
        return {
          nextDay: null,
          completedDays: [],
          canLogToday: false,
          timeUntilNextLog: null,
          lastCompletedAt: null,
        };
      }

      // Find next uncompleted day in sequence
      const nextDay = trackerDays.find(d => !d.completed) || null;

      // Get completed days
      const completedDays = trackerDays.filter(d => d.completed && d.completed_at);

      // Find last completed day
      const lastCompleted = completedDays.length > 0
        ? completedDays.reduce((latest, day) => 
            new Date(day.completed_at!) > new Date(latest.completed_at!) ? day : latest
          )
        : null;

      // Calculate cooldown
      let canLogToday = true;
      let timeUntilNextLog = null;

      if (lastCompleted && lastCompleted.completed_at) {
        const lastTime = new Date(lastCompleted.completed_at).getTime();
        const now = Date.now();
        const cooldownMs = COOLDOWN_HOURS * 60 * 60 * 1000;
        const timeSinceLastLog = now - lastTime;

        if (timeSinceLastLog < cooldownMs) {
          canLogToday = false;
          timeUntilNextLog = cooldownMs - timeSinceLastLog;
        }
      }

      return {
        nextDay,
        completedDays,
        canLogToday,
        timeUntilNextLog,
        lastCompletedAt: lastCompleted?.completed_at || null,
      };
    },
    enabled: !!userId && !!childId,
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
  });
}
