import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserStats {
  scriptsUsed: number;
  videosWatched: number;
  dayStreak: number;
  bestStreak: number;
  totalDays: number;
  postsCreated: number;
}

export interface RecentActivity {
  type: 'script' | 'video';
  title: string;
  date: string;
  icon: string;
}

/**
 * Custom hook to fetch and manage user statistics
 * @param userId - The user's ID
 * @returns Object containing stats, recent activity, and loading state
 */
export function useUserStats(userId: string | undefined) {
  const [stats, setStats] = useState<UserStats>({
    scriptsUsed: 0,
    videosWatched: 0,
    dayStreak: 1,
    bestStreak: 1,
    totalDays: 1,
    postsCreated: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!userId) return;

      setLoading(true);

      try {
        // Fetch scripts usage count
        const { count: scriptsCount } = await supabase
          .from('scripts_usage')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        // Fetch videos watched count
        const { count: videosCount } = await supabase
          .from('video_progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('completed', true);

        // Fetch posts created count
        const { count: postsCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('author_id', userId);

        // Calculate streak
        const { data: recentUsage } = await supabase
          .from('scripts_usage')
          .select('used_at')
          .eq('user_id', userId)
          .order('used_at', { ascending: false })
          .limit(30);

        const { streak, bestStreak, totalDays } = calculateStreak(recentUsage);

        setStats({
          scriptsUsed: scriptsCount || 0,
          videosWatched: videosCount || 0,
          dayStreak: streak,
          bestStreak: bestStreak,
          totalDays: totalDays,
          postsCreated: postsCount || 0,
        });

        // Fetch recent activity
        const activities = await fetchRecentActivity(userId);
        setRecentActivity(activities);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  return { stats, recentActivity, loading };
}

/**
 * Calculates user's day streak from usage data
 */
function calculateStreak(recentUsage: Array<{ used_at: string }> | null) {
  let streak = 1;
  let bestStreak = 1;
  let currentStreak = 1;

  if (recentUsage && recentUsage.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dates = recentUsage.map((u) => {
      const d = new Date(u.used_at);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    });

    const uniqueDates = [...new Set(dates)].sort((a, b) => b - a);

    // Calculate current streak
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const diff = (uniqueDates[i] - uniqueDates[i + 1]) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        currentStreak++;
      } else {
        if (currentStreak > bestStreak) bestStreak = currentStreak;
        currentStreak = 1;
      }
    }

    streak = currentStreak;
    if (currentStreak > bestStreak) bestStreak = currentStreak;

    const totalDays = new Set(
      recentUsage.map((u) => new Date(u.used_at).toDateString())
    ).size;

    return { streak, bestStreak, totalDays };
  }

  return { streak: 1, bestStreak: 1, totalDays: 1 };
}

/**
 * Fetches recent user activity (scripts and videos)
 */
async function fetchRecentActivity(userId: string): Promise<RecentActivity[]> {
  const { data: recentScripts } = await supabase
    .from('scripts_usage')
    .select('scripts(title), used_at')
    .eq('user_id', userId)
    .order('used_at', { ascending: false })
    .limit(3);

  const { data: recentVideos } = await supabase
    .from('video_progress')
    .select('videos(title), updated_at')
    .eq('user_id', userId)
    .eq('completed', true)
    .order('updated_at', { ascending: false })
    .limit(3);

  const activities: RecentActivity[] = [];

  if (recentScripts) {
    recentScripts.forEach((s) => {
      if (s.scripts) {
        activities.push({
          type: 'script',
          title: (s.scripts as any).title,
          date: s.used_at,
          icon: '📖',
        });
      }
    });
  }

  if (recentVideos) {
    recentVideos.forEach((v) => {
      if (v.videos) {
        activities.push({
          type: 'video',
          title: (v.videos as any).title,
          date: v.updated_at,
          icon: '🎬',
        });
      }
    });
  }

  activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return activities.slice(0, 5);
}
