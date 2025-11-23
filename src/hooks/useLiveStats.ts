import React, { useEffect, useState } from 'react';
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
 * Calculate simulated active users based on time of day
 * Returns realistic numbers considering user behavior patterns
 */
function getSimulatedActiveUsers(totalMembers: number): number {
  const now = new Date();
  const hour = now.getHours();
  
  // Define activity rates based on time of day (more realistic)
  let activityMultiplier: number;
  
  if (hour >= 0 && hour < 6) {
    // Madrugada (0h-6h): muito baixo - 1-3% dos usuários "ativos"
    activityMultiplier = 0.015 + Math.random() * 0.015;
  } else if (hour >= 6 && hour < 9) {
    // Manhã cedo (6h-9h): médio-baixo - 5-8%
    activityMultiplier = 0.05 + Math.random() * 0.03;
  } else if (hour >= 9 && hour < 12) {
    // Manhã (9h-12h): médio - 8-12%
    activityMultiplier = 0.08 + Math.random() * 0.04;
  } else if (hour >= 12 && hour < 17) {
    // Tarde (12h-17h): médio-alto - 10-15%
    activityMultiplier = 0.10 + Math.random() * 0.05;
  } else if (hour >= 17 && hour < 21) {
    // Início da noite (17h-21h): PICO - 12-18%
    activityMultiplier = 0.12 + Math.random() * 0.06;
  } else if (hour >= 21 && hour < 23) {
    // Noite (21h-23h): alto - 8-12%
    activityMultiplier = 0.08 + Math.random() * 0.04;
  } else {
    // Final da noite (23h-0h): médio-baixo - 4-7%
    activityMultiplier = 0.04 + Math.random() * 0.03;
  }

  // Calculate base active users
  const baseActive = Math.floor(totalMembers * activityMultiplier);

  // Add small variation based on day to keep consistency within same hour
  const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const hourVariation = Math.floor(Math.sin(dayOfYear * 1.5 + hour) * 3);

  return Math.max(1, baseActive + hourVariation);
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
