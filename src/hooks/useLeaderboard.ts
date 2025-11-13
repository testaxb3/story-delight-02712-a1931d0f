import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  initials: string;
  avatarColor: string;
  brainType?: 'INTENSE' | 'DISTRACTED' | 'DEFIANT';
  score: number;
  streak: number;
  isCurrentUser: boolean;
}

export type LeaderboardType = 'streak' | 'scripts' | 'xp';

const AVATAR_COLORS = [
  'bg-gradient-to-br from-purple-400 to-pink-400',
  'bg-gradient-to-br from-blue-400 to-cyan-400',
  'bg-gradient-to-br from-green-400 to-emerald-400',
  'bg-gradient-to-br from-orange-400 to-red-400',
  'bg-gradient-to-br from-pink-400 to-rose-400',
  'bg-gradient-to-br from-indigo-400 to-purple-400',
];

function getInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) return '??';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarColor(userId: string): string {
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function useLeaderboard(
  currentUserId?: string,
  leaderboardType: LeaderboardType = 'streak',
  brainTypeFilter?: 'INTENSE' | 'DISTRACTED' | 'DEFIANT' | null
) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);

      try {
        // Get all users with their profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, email')
          .limit(100);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          setLoading(false);
          return;
        }

        if (!profiles || profiles.length === 0) {
          setLoading(false);
          return;
        }

        // Get child profiles to determine brain types
        const { data: childProfiles } = await supabase
          .from('child_profiles')
          .select('parent_id, brain_profile')
          .eq('is_active', true);

        // Create a map of parent_id to brain_type
        const brainTypeMap = new Map<string, 'INTENSE' | 'DISTRACTED' | 'DEFIANT'>();
        childProfiles?.forEach(cp => {
          if (cp.brain_profile && !brainTypeMap.has(cp.parent_id)) {
            brainTypeMap.set(cp.parent_id, cp.brain_profile as 'INTENSE' | 'DISTRACTED' | 'DEFIANT');
          }
        });

        // Get leaderboard data based on type
        const leaderboardPromises = profiles.map(async (profile) => {
          const userId = profile.id;
          const brainType = brainTypeMap.get(userId);

          // Skip if brain type filter is active and doesn't match
          if (brainTypeFilter && brainType !== brainTypeFilter) {
            return null;
          }

          let score = 0;
          let streak = 0;

          if (leaderboardType === 'streak') {
            // Calculate current streak
            const { data: trackerDays } = await supabase
              .from('tracker_days')
              .select('date, completed')
              .eq('user_id', userId)
              .order('date', { ascending: false })
              .limit(30);

            if (trackerDays && trackerDays.length > 0) {
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              const mostRecentDate = new Date(trackerDays[0].date);
              mostRecentDate.setHours(0, 0, 0, 0);

              const daysDiff = Math.floor((today.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24));

              if (daysDiff <= 1 && trackerDays[0].completed) {
                for (const day of trackerDays) {
                  if (day.completed) {
                    streak++;
                  } else {
                    break;
                  }
                }
              }
            }
            score = streak;
          } else if (leaderboardType === 'scripts') {
            // Count total scripts used (completed tracker days)
            const { count } = await supabase
              .from('tracker_days')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', userId)
              .eq('completed', true);

            score = count || 0;
          } else if (leaderboardType === 'xp') {
            // Calculate XP based on activities
            const { count: scriptsCount } = await supabase
              .from('tracker_days')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', userId)
              .eq('completed', true);

            const { count: postsCount } = await supabase
              .from('community_posts')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', userId)
              .then(r => r)
              .catch(() => ({ count: 0 }));

            // XP calculation: 50 per script + 60 per community post
            score = (scriptsCount || 0) * 50 + (postsCount || 0) * 60;

            // Also calculate streak for display
            const { data: trackerDays } = await supabase
              .from('tracker_days')
              .select('date, completed')
              .eq('user_id', userId)
              .order('date', { ascending: false })
              .limit(30);

            if (trackerDays && trackerDays.length > 0) {
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              const mostRecentDate = new Date(trackerDays[0].date);
              mostRecentDate.setHours(0, 0, 0, 0);

              const daysDiff = Math.floor((today.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24));

              if (daysDiff <= 1 && trackerDays[0].completed) {
                for (const day of trackerDays) {
                  if (day.completed) {
                    streak++;
                  } else {
                    break;
                  }
                }
              }
            }
          }

          const name = profile.name || profile.email?.split('@')[0] || 'Anonymous Parent';

          return {
            userId,
            name,
            initials: getInitials(name),
            avatarColor: getAvatarColor(userId),
            brainType,
            score,
            streak,
            isCurrentUser: userId === currentUserId,
          } as Omit<LeaderboardEntry, 'rank'>;
        });

        const results = await Promise.all(leaderboardPromises);

        // Filter out nulls and sort by score
        const validResults = results.filter(r => r !== null) as Omit<LeaderboardEntry, 'rank'>[];
        validResults.sort((a, b) => b.score - a.score);

        // Add ranks
        const rankedResults: LeaderboardEntry[] = validResults.map((entry, index) => ({
          ...entry,
          rank: index + 1,
        }));

        // Find current user's rank
        const currentUserEntry = rankedResults.find(e => e.isCurrentUser);
        setUserRank(currentUserEntry?.rank || null);

        // Take top 10
        setLeaderboard(rankedResults.slice(0, 10));
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [currentUserId, leaderboardType, brainTypeFilter]);

  return {
    leaderboard,
    loading,
    userRank,
  };
}
