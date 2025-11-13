import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import type { Database } from '@/integrations/supabase/types';

type ScriptRow = Database['public']['Tables']['scripts']['Row'];

interface RecentScript extends ScriptRow {
  used_at: string;
  days_ago: number;
}

/**
 * Hook to fetch the last 3 scripts used by the current user and active child
 * Uses React Query for caching and automatic refetching
 */
export function useRecentScripts() {
  const { user } = useAuth();
  const { activeChild } = useChildProfiles();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['recent-scripts', user?.id, activeChild?.id],
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }

      // Fetch recent script usage with joined script data
      const { data: usageData, error: usageError } = await supabase
        .from('script_usage')
        .select(`
          used_at,
          script_id,
          scripts (*)
        `)
        .eq('user_id', user.id)
        .order('used_at', { ascending: false })
        .limit(3);

      if (usageError) {
        console.error('Error fetching recent scripts:', usageError);
        throw usageError;
      }

      if (!usageData || usageData.length === 0) {
        return [];
      }

      // Transform data to include days_ago
      const scriptsWithUsage: RecentScript[] = usageData
        .filter((item) => item.scripts) // Filter out any null scripts
        .map((item) => {
          const usedAt = new Date(item.used_at);
          const now = new Date();
          const days_ago = Math.floor((now.getTime() - usedAt.getTime()) / (1000 * 60 * 60 * 24));

          return {
            ...(item.scripts as ScriptRow),
            used_at: item.used_at,
            days_ago,
          };
        });

      // Remove duplicates - keep only the most recent usage of each unique script
      const uniqueScripts = new Map<string, RecentScript>();
      scriptsWithUsage.forEach((script) => {
        if (!uniqueScripts.has(script.id)) {
          uniqueScripts.set(script.id, script);
        }
      });

      return Array.from(uniqueScripts.values());
    },
    enabled: !!user?.id,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
  });

  return {
    recentScripts: data || [],
    isLoading,
    error,
    refetch,
  };
}
