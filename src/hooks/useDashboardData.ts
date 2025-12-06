import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ChildProfile } from '@/contexts/ChildProfilesContext';

interface DashboardData {
  scripts: any[];
  ebooks: any[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Optimized Dashboard Data Hook
 * Fetches scripts and ebooks in parallel with caching
 */
export function useDashboardData(
  activeChild: ChildProfile | null,
  userId: string | undefined
): DashboardData {
  // Scripts Query
  const scriptsQuery = useQuery({
    queryKey: ['dashboard-scripts', activeChild?.brain_profile],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scripts')
        .select('*')
        .eq('profile', activeChild?.brain_profile || 'INTENSE')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data ?? [];
    },
    enabled: !!activeChild,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Ebooks Query with Progress
  const ebooksQuery = useQuery({
    queryKey: ['dashboard-ebooks', userId],
    queryFn: async () => {
      if (!userId) return [];

      // Fetch ebooks
      const { data: ebookData, error: ebookError } = await supabase
        .from('ebooks')
        .select('id, title, slug, thumbnail_url')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(5);

      if (ebookError) throw ebookError;

      // Fetch progress
      const { data: progressData } = await supabase
        .from('user_ebook_progress')
        .select('ebook_id, current_chapter, completed_chapters')
        .eq('user_id', userId)
        .in(
          'ebook_id',
          ebookData?.map((e) => e.id) || []
        );

      // Merge progress info
      const ebooksWithProgress = ebookData?.map((ebook) => {
        const progress = progressData?.find((p) => p.ebook_id === ebook.id);
        const isStarted =
          progress &&
          (progress.current_chapter > 0 ||
            (progress.completed_chapters && progress.completed_chapters.length > 0));
        return {
          ...ebook,
          isStarted: !!isStarted,
          thumbnail: ebook.thumbnail_url,
        };
      });

      return ebooksWithProgress || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const refetch = async () => {
    await Promise.all([scriptsQuery.refetch(), ebooksQuery.refetch()]);
  };

  return {
    scripts: scriptsQuery.data || [],
    ebooks: ebooksQuery.data || [],
    isLoading: scriptsQuery.isLoading || ebooksQuery.isLoading,
    error: (scriptsQuery.error || ebooksQuery.error) as Error | null,
    refetch,
  };
}
