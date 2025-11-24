import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface RecentScript {
  id: string;
  scriptTitle: string;
  scriptCategory: string;
  usedAt: string;
  profile: string | null;
}

export interface WeeklyWin {
  icon: string;
  title: string;
  metric: string;
}

export interface DashboardStats {
  // Tracker summary
  averageStress: number;
  totalTrackerEntries: number;
  meltdownsBefore: number;
  meltdownsAfter: number;
  
  // Scripts usage
  uniqueScriptsUsed: number;
  totalScriptUses: number;
  
  // Content counts
  totalScripts: number;
  totalVideos: number;
  totalPdfs: number;
  
  // Live stats
  scriptsTodayCount: number;
  scriptUsesToday: number;
  activeUsersWeek: number;
  scriptUsesWeek: number;
  postsThisWeek: number;
  
  // Streak data
  currentStreak: number;
  longestStreak: number;
  
  // Recent activity
  recentScriptUsage: RecentScript[];
  weeklyWins: WeeklyWin[];
}

/**
 * Optimized hook to fetch all dashboard stats in a single query
 * Uses React Query for caching, background refetching, and better UX
 */
export function useDashboardStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Fetch dashboard stats
      const { data, error } = await supabase
        .from('dashboard_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('No dashboard data found');

      // Fetch streak data from user_achievements_stats
      const { data: streakData } = await supabase
        .from('user_achievements_stats')
        .select('current_streak, longest_streak')
        .eq('user_id', user.id)
        .single();

      // Transform snake_case to camelCase
      return {
        averageStress: data.average_stress,
        totalTrackerEntries: data.total_tracker_entries,
        meltdownsBefore: data.meltdowns_before_day_7,
        meltdownsAfter: data.meltdowns_after_day_7,
        uniqueScriptsUsed: data.unique_scripts_used,
        totalScriptUses: data.total_script_uses,
        totalScripts: data.total_scripts,
        totalVideos: data.total_videos,
        totalPdfs: data.total_pdfs,
        scriptsTodayCount: data.scripts_today_count,
        scriptUsesToday: data.script_uses_today,
        activeUsersWeek: data.active_users_week,
        scriptUsesWeek: data.script_uses_week,
        postsThisWeek: data.posts_this_week,
        currentStreak: streakData?.current_streak ?? 0,
        longestStreak: streakData?.longest_streak ?? 0,
        recentScriptUsage: Array.isArray(data.recent_script_usage) ? data.recent_script_usage : [],
        weeklyWins: Array.isArray(data.weekly_wins) ? data.weekly_wins : [],
      } as DashboardStats;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes (increased from 2)
    gcTime: 15 * 60 * 1000, // Keep in cache for 15 minutes (increased from 10)
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnMount: false, // Don't refetch if data is fresh
  });
}
