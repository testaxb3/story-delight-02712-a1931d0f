import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface EbookStats {
  totalReaders: number;
  completionRate: number;
  avgTime: number;
  totalNotes: number;
  readingsOverTime: Array<{ date: string; readers: number }>;
  chapterStats: Array<{
    title: string;
    readers: number;
    completionRate: number;
    avgTime: number;
    abandonmentRate: number;
  }>;
}

/**
 * Hook to fetch ebook analytics (for admin)
 */
export function useEbookStats(ebookId: string | undefined) {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['ebook-stats', ebookId],
    queryFn: async () => {
      if (!ebookId) return null;

      // Get basic stats from view
      const { data: ebookData, error: ebookError } = await supabase
        .from('ebooks_with_stats')
        .select('*')
        .eq('id', ebookId)
        .single();

      if (ebookError) throw ebookError;

      // Get detailed progress data
      const { data: progressData, error: progressError } = await supabase
        .from('user_ebook_progress')
        .select('*')
        .eq('ebook_id', ebookId);

      if (progressError) throw progressError;

      // Calculate stats
      const totalReaders = ebookData.total_readers || 0;
      const completionRate = ebookData.completion_rate || 0;
      const avgTime = ebookData.avg_reading_time || 0;

      // Count total notes
      let totalNotes = 0;
      progressData?.forEach(p => {
        if (p.notes) {
          Object.values(p.notes as Record<string, any[]>).forEach(chapterNotes => {
            totalNotes += chapterNotes.length;
          });
        }
      });

      // Get readings over time (last 30 days)
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toISOString().split('T')[0];
      });

      const readingsOverTime = last30Days.map(date => {
        const readersOnDay = progressData?.filter(p => {
          const lastRead = new Date(p.last_read_at).toISOString().split('T')[0];
          return lastRead === date;
        }).length || 0;

        return { date, readers: readersOnDay };
      });

      // Get chapter-specific stats
      const ebook = JSON.parse(ebookData.content || '[]');
      const chapterStats = ebook.map((chapter: any, index: number) => {
        const readersWhoReached = progressData?.filter(p => 
          p.current_chapter >= index || p.completed_chapters?.includes(index)
        ).length || 0;

        const readersWhoCompleted = progressData?.filter(p => 
          p.completed_chapters?.includes(index)
        ).length || 0;

        const completionRate = readersWhoReached > 0 
          ? (readersWhoCompleted / readersWhoReached) * 100 
          : 0;

        const avgTime = progressData?.length > 0
          ? progressData.reduce((sum, p) => sum + (p.reading_time_minutes || 0), 0) / progressData.length
          : 0;

        const abandonmentRate = readersWhoReached > 0
          ? ((readersWhoReached - readersWhoCompleted) / readersWhoReached) * 100
          : 0;

        return {
          title: chapter.title || `Capítulo ${index + 1}`,
          readers: readersWhoReached,
          completionRate,
          avgTime: Math.round(avgTime),
          abandonmentRate,
        };
      });

      return {
        totalReaders,
        completionRate,
        avgTime: Math.round(avgTime),
        totalNotes,
        readingsOverTime,
        chapterStats,
      } as EbookStats;
    },
    enabled: !!ebookId,
    staleTime: 1000 * 60 * 2, // Cache for 2 minutes
  });

  return { stats, isLoading, error };
}

/**
 * Hook to fetch global ebook analytics
 */
export function useGlobalEbookStats() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['global-ebook-stats'],
    queryFn: async () => {
      // Get all ebooks with stats
      const { data: ebooks, error: ebooksError } = await supabase
        .from('ebooks_with_stats')
        .select('*')
        .is('deleted_at', null);

      if (ebooksError) throw ebooksError;

      // Calculate global stats
      const totalEbooks = ebooks?.length || 0;
      const totalReaders = ebooks?.reduce((sum, e) => sum + (e.total_readers || 0), 0) || 0;
      const avgCompletionRate = ebooks?.length > 0
        ? ebooks.reduce((sum, e) => sum + (e.completion_rate || 0), 0) / ebooks.length
        : 0;

      return {
        totalEbooks,
        totalReaders,
        avgCompletionRate: Math.round(avgCompletionRate),
        mostReadEbooks: ebooks?.sort((a, b) => (b.total_readers || 0) - (a.total_readers || 0)).slice(0, 5) || [],
      };
    },
    staleTime: 1000 * 60 * 5,
  });

  return { stats, isLoading, error };
}
