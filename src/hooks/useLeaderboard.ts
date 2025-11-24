import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  initials: string;
  avatarColor: string;
  photoUrl?: string;
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
  leaderboardType: LeaderboardType = 'xp',
  brainTypeFilter?: 'INTENSE' | 'DISTRACTED' | 'DEFIANT' | null
) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);

      try {
        const { data: cachedData, error: cacheError } = await supabase
          .from('leaderboard_cache')
          .select('*')
          .limit(100);

        if (cacheError) {
          console.error('Error fetching leaderboard cache:', cacheError);
          setLoading(false);
          return;
        }

        if (!cachedData || cachedData.length === 0) {
          setLoading(false);
          return;
        }

        const { data: childProfiles } = await supabase
          .from('child_profiles')
          .select('user_id, brain_profile')
          .eq('is_active', true);

        const brainTypeMap = new Map<string, 'INTENSE' | 'DISTRACTED' | 'DEFIANT'>();
        childProfiles?.forEach(cp => {
          if (cp.brain_profile && !brainTypeMap.has(cp.user_id)) {
            brainTypeMap.set(cp.user_id, cp.brain_profile as 'INTENSE' | 'DISTRACTED' | 'DEFIANT');
          }
        });

        let entries: LeaderboardEntry[] = cachedData.map((entry, index) => {
          const brainType = brainTypeMap.get(entry.id);
          
          let score = 0;
          switch (leaderboardType) {
            case 'xp':
              score = entry.total_xp || 0;
              break;
            case 'scripts':
              score = entry.scripts_used || 0;
              break;
            case 'streak':
              score = entry.longest_streak || 0; // Use longest_streak instead of current_streak
              break;
          }

          return {
            rank: index + 1,
            userId: entry.id,
            name: entry.full_name || 'Anonymous',
            initials: getInitials(entry.full_name || 'Anonymous'),
            avatarColor: getAvatarColor(entry.id),
            photoUrl: entry.photo_url || undefined,
            brainType,
            score,
            streak: entry.longest_streak || 0, // Use longest_streak for display
            isCurrentUser: entry.id === currentUserId,
          };
        });

        if (brainTypeFilter) {
          entries = entries.filter(e => e.brainType === brainTypeFilter);
        }

        entries.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return b.streak - a.streak;
        });

        entries = entries.map((entry, index) => ({
          ...entry,
          rank: index + 1,
        }));

        setLeaderboard(entries);

        const userEntry = entries.find(e => e.isCurrentUser);
        setUserRank(userEntry ? userEntry.rank : null);

      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();

    const interval = setInterval(fetchLeaderboard, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentUserId, leaderboardType, brainTypeFilter]);

  return { leaderboard, loading, userRank };
}
