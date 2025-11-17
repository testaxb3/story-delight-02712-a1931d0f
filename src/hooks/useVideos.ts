import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type VideoRow = Database['public']['Tables']['videos']['Row'];

/**
 * Optimized hook to fetch all videos using React Query
 * Provides automatic caching, background refetching, and better UX
 */
export function useVideos() {
  return useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Failed to load videos', error);
        throw error;
      }

      return data as VideoRow[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - videos don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes - keep in cache longer
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnMount: false, // Don't refetch if data is fresh
  });
}
