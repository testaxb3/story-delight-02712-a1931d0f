import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
}

/**
 * Optimized hook to fetch all dashboard stats in a single query
 * Uses React Query for caching, background refetching, and better UX
 */
export function useDashboardStats() {
  const { user } = useAuth();

  console.log('useDashboardStats called with user:', user?.id);

  return useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      console.log('Fetching dashboard stats for user:', user?.id);
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('dashboard_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      console.log('Dashboard stats response:', { data, error });

      if (error) throw error;
      if (!data) throw new Error('No dashboard data found');

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
      } as DashboardStats;
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: false, // Don't refetch if data is fresh
  });
}
