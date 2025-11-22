import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useScriptsByProfile(brainProfile: string | undefined) {
  return useQuery({
    queryKey: ['scripts-count', brainProfile],
    queryFn: async () => {
      if (!brainProfile) return 0;

      const { count, error } = await supabase
        .from('scripts')
        .select('*', { count: 'exact', head: true })
        .or(`profile.eq.${brainProfile},profile.eq.UNIVERSAL`);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!brainProfile,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
