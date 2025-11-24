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
      // Use RPC function for better performance
      const { data, error } = await supabase.rpc('get_community_members', {
        p_community_id: communityId
      });

      if (error) throw error;

      setMembers((data || []) as any);
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
