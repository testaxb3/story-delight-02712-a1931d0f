import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useProfileStats(brainProfile: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile-stats', user?.id, brainProfile],
    queryFn: async () => {
      if (!user?.id || !brainProfile) {
        return { totalScripts: 0, scriptsMastered: 0 };
      }

      // 1. Get Total Scripts for this profile
      const { count: totalCount, error: totalError } = await supabase
        .from('scripts')
        .select('*', { count: 'exact', head: true })
        .eq('profile', brainProfile);

      if (totalError) throw totalError;

      // 2. Get Mastered Scripts (unique usage) for this profile
      // We need to join script_usage with scripts to filter by profile
      const { count: masteredCount, error: masteredError } = await supabase
        .from('script_usage')
        .select('script_id, scripts!inner(profile)', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('scripts.profile', brainProfile);

      if (masteredError) throw masteredError;

      return {
        totalScripts: totalCount || 0,
        scriptsMastered: masteredCount || 0,
      };
    },
    enabled: !!user?.id && !!brainProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
