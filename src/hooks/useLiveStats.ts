import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LiveStats {
  totalMembers: number;
  scriptsUsedToday: number;
  scriptsUsedThisWeek: number;
  communityPostsThisWeek: number;
  activeUsersThisWeek: number;
}

/**
 * Calculate simulated user growth based on days since launch
 * Grows gradually to make the app feel active and growing
 */
function getSimulatedUserCount(): number {
  // Base date - adjust this to your app's "launch date"
  const launchDate = new Date('2025-01-01');
  const now = new Date();

  // Calculate days since launch
  const daysSinceLaunch = Math.floor((now.getTime() - launchDate.getTime()) / (1000 * 60 * 60 * 24));

  // Base number of simulated users at launch
  const baseUsers = 847;

  // Growth rate: 15-25 new users per day on average
  const dailyGrowthBase = 18;
  const growthVariation = 7;

  // Use day number as seed for consistent daily variation
  const dayOfYear = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
  const pseudoRandom = Math.sin(dayOfYear) * 10000;
  const dailyVariation = Math.floor((pseudoRandom - Math.floor(pseudoRandom)) * growthVariation);

  // Calculate total simulated users
  const totalGrowth = daysSinceLaunch * dailyGrowthBase + dailyVariation;

  return baseUsers + Math.max(0, totalGrowth);
}

/**
 * Calculate simulated active users (proportional to total)
 */
function getSimulatedActiveUsers(totalMembers: number): number {
  // Typically 8-15% of total users are active weekly
  const activeRate = 0.12;
  const baseActive = Math.floor(totalMembers * activeRate);

  // Add small daily variation
  const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const variation = Math.floor(Math.sin(dayOfYear * 1.5) * 5);

  return Math.max(1, baseActive + variation);
}

/**
 * Fetch live statistics for social proof
 * Shows real numbers plus simulated growth to increase perceived value
 */
export function useLiveStats() {
  const [stats, setStats] = useState<LiveStats>({
    totalMembers: 0,
    scriptsUsedToday: 0,
    scriptsUsedThisWeek: 0,
    communityPostsThisWeek: 0,
    activeUsersThisWeek: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        // Fetch all stats in parallel
        const [
          totalMembersResult,
          scriptsUsedTodayResult,
          scriptsUsedWeekResult,
          communityPostsWeekResult,
          activeUsersWeekResult,
        ] = await Promise.all([
          // Total members (all profiles)
          supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true }),

          // Scripts used today (script_usage created today)
          supabase
            .from('script_usage')
            .select('id', { count: 'exact', head: true })
            .gte('used_at', today.toISOString()),

          // Scripts used this week
          supabase
            .from('script_usage')
            .select('id', { count: 'exact', head: true })
            .gte('used_at', weekAgo.toISOString()),

          // Community posts this week
          supabase
            .from('community_posts')
            .select('id', { count: 'exact', head: true })
            .gte('created_at', weekAgo.toISOString()),

          // Active users this week (unique users who used scripts)
          supabase
            .from('script_usage')
            .select('user_id')
            .gte('used_at', weekAgo.toISOString()),
        ]);

        if (!mounted) return;

        // Calculate unique active users
        const uniqueActiveUsers = new Set(
          (activeUsersWeekResult.data || []).map((entry) => entry.user_id)
        ).size;

        // Get simulated numbers for social proof
        const simulatedTotal = getSimulatedUserCount();
        const realMembers = totalMembersResult.count || 0;
        const combinedTotal = realMembers + simulatedTotal;

        setStats({
          totalMembers: combinedTotal,
          scriptsUsedToday: scriptsUsedTodayResult.count || 0,
          scriptsUsedThisWeek: scriptsUsedWeekResult.count || 0,
          communityPostsThisWeek: communityPostsWeekResult.count || 0,
          activeUsersThisWeek: Math.max(uniqueActiveUsers, getSimulatedActiveUsers(combinedTotal)),
        });
      } catch (err) {
        if (!mounted) return;
        console.error('Failed to fetch live stats:', err);
        setError(err as Error);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    fetchStats();

    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { stats, loading, error };
}
