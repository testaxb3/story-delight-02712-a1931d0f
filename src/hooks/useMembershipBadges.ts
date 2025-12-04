import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Fixed badge IDs from migration
const NEP_MEMBER_BADGE_ID = 'a1b2c3d4-5678-90ab-cdef-111111111111';
const NEP_LISTEN_BADGE_ID = 'a1b2c3d4-5678-90ab-cdef-222222222222';

interface MembershipBadges {
  isNepMember: boolean;
  isNepListen: boolean;
  isLoading: boolean;
  nepMemberUnlockedAt: string | null;
  nepListenUnlockedAt: string | null;
}

/**
 * Hook to check user's membership badges (NEP Member, NEP Listen)
 * Used for conditional UI (upsell banners, premium features)
 */
export function useMembershipBadges(): MembershipBadges {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['membership-badges', user?.profileId],
    queryFn: async () => {
      if (!user?.profileId) return { member: null, listen: null };

      const { data, error } = await supabase
        .from('user_badges')
        .select('badge_id, unlocked_at')
        .eq('user_id', user.profileId)
        .in('badge_id', [NEP_MEMBER_BADGE_ID, NEP_LISTEN_BADGE_ID]);

      if (error) {
        console.error('Error fetching membership badges:', error);
        return { member: null, listen: null };
      }

      const memberBadge = data?.find(b => b.badge_id === NEP_MEMBER_BADGE_ID);
      const listenBadge = data?.find(b => b.badge_id === NEP_LISTEN_BADGE_ID);

      return {
        member: memberBadge || null,
        listen: listenBadge || null,
      };
    },
    enabled: !!user?.profileId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  return {
    isNepMember: !!data?.member,
    isNepListen: !!data?.listen,
    isLoading,
    nepMemberUnlockedAt: data?.member?.unlocked_at || null,
    nepListenUnlockedAt: data?.listen?.unlocked_at || null,
  };
}
