import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

export interface RecentScript {
  id: string;
  scriptTitle: string;
  scriptCategory: string;
  usedAt: string;
  timeAgo: string;
  profile: string | null;
}

export function useRecentScriptUsageOptimized(userId: string | undefined, limit: number = 5) {
  return useQuery({
    queryKey: ['recent-scripts', userId, limit],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('script_usage')
        .select(`
          id,
          used_at,
          scripts (
            title,
            category,
            profile
          )
        `)
        .eq('user_id', userId)
        .order('used_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map((item: any) => ({
        id: item.id,
        scriptTitle: item.scripts?.title || 'Unknown Script',
        scriptCategory: item.scripts?.category || 'general',
        usedAt: item.used_at,
        timeAgo: formatDistanceToNow(new Date(item.used_at), { addSuffix: true }),
        profile: item.scripts?.profile || null
      })) as RecentScript[];
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes cache
  });
}
