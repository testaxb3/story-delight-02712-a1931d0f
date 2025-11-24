import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Member {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  name: string;
  username: string | null;
  photo_url: string | null;
  brain_profile: string | null;
  score?: number;
}

export function useCommunityMembers(communityId: string | null, userId: string | null) {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLeader, setIsLeader] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadMembers = useCallback(async () => {
    if (!communityId) {
      setLoading(false);
      return;
    }

    try {
      // Fetch members with their scores from leaderboard_cache
      const { data, error } = await supabase
        .from('community_members')
        .select(`
          id,
          user_id,
          role,
          joined_at,
          profiles:user_id (
            name,
            username,
            photo_url,
            brain_profile
          )
        `)
        .eq('community_id', communityId);

      if (error) throw error;

      // Now fetch scores from leaderboard_cache
      const userIds = data?.map(m => m.user_id) || [];
      const { data: scores } = await supabase
        .from('leaderboard_cache')
        .select('id, current_streak')
        .in('id', userIds);

      // Map scores to members
      const scoreMap = new Map(scores?.map(s => [s.id, s.current_streak]) || []);

      const membersData = data?.map(member => ({
        id: member.id,
        user_id: member.user_id,
        role: member.role,
        joined_at: member.joined_at,
        name: (member.profiles as any)?.name || 'Unknown',
        username: (member.profiles as any)?.username || null,
        photo_url: (member.profiles as any)?.photo_url || null,
        brain_profile: (member.profiles as any)?.brain_profile || null,
        score: scoreMap.get(member.user_id) || 0,
      })) || [];

      setMembers(membersData);
    } catch (error) {
      console.error('Error loading members:', error);
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  }, [communityId]);

  const checkLeaderStatus = useCallback(async () => {
    if (!communityId || !userId) return;

    try {
      const { data } = await supabase
        .from('community_members')
        .select('role')
        .eq('community_id', communityId)
        .eq('user_id', userId)
        .single();

      setIsLeader(data?.role === 'leader');
    } catch (error) {
      console.error('Error checking leader status:', error);
    }
  }, [communityId, userId]);

  useEffect(() => {
    if (communityId) {
      loadMembers();
      checkLeaderStatus();
    }
  }, [communityId, loadMembers, checkLeaderStatus]);

  return {
    members,
    isLeader,
    loading,
    loadMembers,
  };
}
