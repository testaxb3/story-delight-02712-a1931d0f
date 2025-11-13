import { supabase } from '@/integrations/supabase/client';

/**
 * Get the number of scripts used today for the current user
 */
export async function getTodayScriptCount(userId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('script_usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('used_at', new Date().toISOString().split('T')[0]); // Today's date

    if (error) {
      console.error('Error getting today script count:', error);
      return 0;
    }

    return count ?? 0;
  } catch (error) {
    console.error('Error getting today script count:', error);
    return 0;
  }
}

/**
 * Get the total number of scripts used by the current user
 */
export async function getTotalScriptCount(userId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('script_usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      console.error('Error getting total script count:', error);
      return 0;
    }

    return count ?? 0;
  } catch (error) {
    console.error('Error getting total script count:', error);
    return 0;
  }
}

/**
 * Get the current streak of consecutive days using scripts
 */
export async function getStreakDays(userId: string): Promise<number> {
  try {
    // Get distinct dates of script usage, ordered by date descending
    const { data, error } = await supabase
      .from('script_usage')
      .select('used_at')
      .eq('user_id', userId)
      .order('used_at', { ascending: false });

    if (error || !data) {
      console.error('Error getting streak days:', error);
      return 0;
    }

    if (data.length === 0) return 0;

    // Extract unique dates and convert to Date objects
    const uniqueDates = Array.from(
      new Set(
        data.map((row) => new Date(row.used_at).toISOString().split('T')[0])
      )
    )
      .map((dateStr) => new Date(dateStr))
      .sort((a, b) => b.getTime() - a.getTime()); // Sort descending

    if (uniqueDates.length === 0) return 0;

    // Check if the most recent usage was today or yesterday
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const mostRecent = uniqueDates[0];
    mostRecent.setHours(0, 0, 0, 0);

    // If the most recent usage is not today or yesterday, streak is broken
    if (
      mostRecent.getTime() !== today.getTime() &&
      mostRecent.getTime() !== yesterday.getTime()
    ) {
      return 0;
    }

    // Count consecutive days
    let streak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const current = new Date(uniqueDates[i]);
      current.setHours(0, 0, 0, 0);
      const previous = new Date(uniqueDates[i - 1]);
      previous.setHours(0, 0, 0, 0);

      const dayDiff =
        (previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24);

      if (dayDiff === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }
}

/**
 * Get the number of days since the user started using the app
 */
export async function getDaysSinceStart(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('script_usage')
      .select('used_at')
      .eq('user_id', userId)
      .order('used_at', { ascending: true })
      .limit(1);

    if (error || !data || data.length === 0) {
      return 1; // Default to day 1 if no data
    }

    const firstUsage = new Date(data[0].used_at);
    const today = new Date();
    const daysDiff = Math.floor(
      (today.getTime() - firstUsage.getTime()) / (1000 * 60 * 60 * 24)
    );

    return Math.max(1, daysDiff + 1); // Add 1 to include the first day
  } catch (error) {
    console.error('Error getting days since start:', error);
    return 1;
  }
}
