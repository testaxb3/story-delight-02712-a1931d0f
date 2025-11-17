import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type ScriptRow = Database['public']['Tables']['scripts']['Row'];

interface ScriptFilters {
  category?: string | null;
  profile?: string | null;
  searchQuery?: string;
}

const PAGE_SIZE = 50;

export function useScriptsInfinite(filters: ScriptFilters) {
  return useInfiniteQuery({
    queryKey: ['scripts-infinite', filters],
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from('scripts')
        .select('*', { count: 'exact' })
        .range(pageParam, pageParam + PAGE_SIZE - 1)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.profile) {
        query = query.eq('profile', filters.profile);
      }
      if (filters.searchQuery) {
        query = query.or(`title.ilike.%${filters.searchQuery}%,the_situation.ilike.%${filters.searchQuery}%`);
      }

      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return {
        data: data as ScriptRow[],
        nextPage: data.length === PAGE_SIZE ? pageParam + PAGE_SIZE : null,
        count: count || 0,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
