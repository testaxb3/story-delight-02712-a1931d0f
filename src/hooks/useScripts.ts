import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type ScriptRow = Database['public']['Tables']['scripts']['Row'];

interface UseScriptsOptions {
  brainProfile?: string | null;
  childAge?: number | null;
  enabled?: boolean;
}

export function useScripts({ brainProfile, childAge, enabled = true }: UseScriptsOptions = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['scripts', brainProfile, childAge],
    queryFn: async () => {
      if (!brainProfile) {
        return [];
      }

      // Build query with profile filter
      let queryBuilder = supabase
        .from('scripts')
        .select('*')
        .eq('profile', brainProfile.toUpperCase())
        .order('created_at', { ascending: false })
        .limit(100);

      // Add age filtering if childAge is provided
      if (childAge !== null && childAge !== undefined) {
        queryBuilder = queryBuilder
          .lte('age_min', childAge)  // age_min <= childAge
          .gte('age_max', childAge); // age_max >= childAge
      }

      const { data, error } = await queryBuilder;

      if (error) {
        console.error('Failed to load scripts:', error);
        throw error;
      }

      return (data ?? []) as ScriptRow[];
    },
    enabled: enabled && !!brainProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes - scripts don't change often
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Use cache if available
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['scripts', brainProfile, childAge] });
  };

  const prefetch = async (profile: string, age?: number | null) => {
    await queryClient.prefetchQuery({
      queryKey: ['scripts', profile, age],
      queryFn: async () => {
        let queryBuilder = supabase
          .from('scripts')
          .select('*')
          .eq('profile', profile.toUpperCase())
          .order('created_at', { ascending: false })
          .limit(100);

        if (age !== null && age !== undefined) {
          queryBuilder = queryBuilder
            .lte('age_min', age)
            .gte('age_max', age);
        }

        const { data } = await queryBuilder;
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
