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

// Default stats for instant UI rendering
const DEFAULT_STATS: DashboardStats = {
  averageStress: 0,
  totalTrackerEntries: 0,
  meltdownsBefore: 0,
  meltdownsAfter: 0,
  uniqueScriptsUsed: 0,
  totalScriptUses: 0,
  totalScripts: 0,
  totalVideos: 0,
  totalPdfs: 0,
  scriptsTodayCount: 0,
  scriptUsesToday: 0,
  activeUsersWeek: 0,
  scriptUsesWeek: 0,
  postsThisWeek: 0,
  currentStreak: 0,
  longestStreak: 0,
  recentScriptUsage: [],
  weeklyWins: [],
};

/**
 * Optimized hook to fetch all dashboard stats
 * - Parallel fetching with Promise.all
 * - Aggressive caching (10min stale, 30min gc)
 * - Placeholder data for instant UI
 */
export function useDashboardStats(childId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard-stats', user?.id, childId],
    queryFn: async (): Promise<DashboardStats> => {
      if (!user?.id) throw new Error('User not authenticated');

      // Parallel fetch: dashboard_stats + streak data
      const [statsResult, streakResult] = await Promise.all([
        supabase
          .from('dashboard_stats')
          .select('*')
          .eq('user_id', user.id)
          .single(),
        childId
          ? supabase
              .from('user_achievements_stats')
              .select('current_streak, longest_streak')
              .eq('user_id', user.id)
              .eq('child_profile_id', childId)
              .maybeSingle()
          : supabase
              .from('user_achievements_stats_aggregated')
              .select('current_streak, longest_streak')
              .eq('user_id', user.id)
              .maybeSingle(),
      ]);

      if (statsResult.error) throw statsResult.error;
      const data = statsResult.data;
      if (!data) throw new Error('No dashboard data found');

      const streakData = streakResult.data;

      return {
        averageStress: data.average_stress ?? 0,
        totalTrackerEntries: data.total_tracker_entries ?? 0,
        meltdownsBefore: data.meltdowns_before_day_7 ?? 0,
        meltdownsAfter: data.meltdowns_after_day_7 ?? 0,
        uniqueScriptsUsed: data.unique_scripts_used ?? 0,
        totalScriptUses: data.total_script_uses ?? 0,
        totalScripts: data.total_scripts ?? 0,
        totalVideos: data.total_videos ?? 0,
        totalPdfs: data.total_pdfs ?? 0,
        scriptsTodayCount: data.scripts_today_count ?? 0,
        scriptUsesToday: data.script_uses_today ?? 0,
        activeUsersWeek: data.active_users_week ?? 0,
        scriptUsesWeek: data.script_uses_week ?? 0,
        postsThisWeek: data.posts_this_week ?? 0,
        currentStreak: streakData?.current_streak ?? 0,
        longestStreak: streakData?.longest_streak ?? 0,
        recentScriptUsage: Array.isArray(data.recent_script_usage) ? data.recent_script_usage : [],
        weeklyWins: Array.isArray(data.weekly_wins) ? data.weekly_wins : [],
      };
    },
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes fresh
    gcTime: 30 * 60 * 1000, // 30 minutes cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: DEFAULT_STATS, // Instant UI render
  });
}
