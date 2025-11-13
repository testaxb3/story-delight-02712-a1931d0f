import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserEbookProgressSummary {
  ebook_id: string;
  current_chapter: number;
  completed_chapters: number[];
  total_chapters: number;
  progress_percentage: number;
  last_read_at: string;
}

/**
 * Hook to fetch all ebook progress for the current user
 */
export function useUserEbooksProgress() {
  const { user } = useAuth();

  const { data: progressData, isLoading } = useQuery({
    queryKey: ['user-ebooks-progress', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_ebook_progress')
        .select(`
          ebook_id,
          current_chapter,
          completed_chapters,
          last_read_at,
          ebooks!inner(total_chapters)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Failed to fetch ebook progress:', error);
        return [];
      }

      return (data || []).map((item: any) => {
        const totalChapters = item.ebooks?.total_chapters || 1;
        const completedCount = item.completed_chapters?.length || 0;
        const progressPercentage = Math.round((completedCount / totalChapters) * 100);

        return {
          ebook_id: item.ebook_id,
          current_chapter: item.current_chapter,
          completed_chapters: item.completed_chapters || [],
          total_chapters: totalChapters,
          progress_percentage: progressPercentage,
          last_read_at: item.last_read_at,
        } as UserEbookProgressSummary;
      });
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Create a map for easy lookup
  const progressMap = new Map<string, UserEbookProgressSummary>();
  (progressData || []).forEach((progress) => {
    progressMap.set(progress.ebook_id, progress);
  });

  return {
    progressData: progressData || [],
    progressMap,
    isLoading,
  };
}
