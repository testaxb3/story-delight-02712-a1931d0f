import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type ScriptRow = Database['public']['Tables']['scripts']['Row'];

interface UseScriptsOptions {
  brainProfile?: string | null;
  enabled?: boolean;
}

export function useScripts({ brainProfile, enabled = true }: UseScriptsOptions = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['scripts', brainProfile],
    queryFn: async () => {
      if (!brainProfile) {
        return [];
      }

      // ✅ PERFORMANCE: Filter by profile on server (saves ~66% data)
      const { data, error } = await supabase
        .from('scripts')
        .select('*')
        .eq('profile', brainProfile.toUpperCase())
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Failed to load scripts:', error);
        throw error;
      }

      return (data ?? []) as ScriptRow[];
    },
    enabled: enabled && !!brainProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes - scripts don't change often
    cacheTime: 10 * 60 * 1000, // 10 minutes - keep in cache
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Use cache if available
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['scripts', brainProfile] });
  };

  const prefetch = async (profile: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['scripts', profile],
      queryFn: async () => {
        const { data } = await supabase
          .from('scripts')
          .select('*')
          .eq('profile', profile.toUpperCase())
          .order('created_at', { ascending: false })
          .limit(100);
        return data ?? [];
      },
    });
  };

  return {
    scripts: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    invalidate,
    prefetch,
  };
}
