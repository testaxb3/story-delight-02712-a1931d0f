import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Chapter } from '@/data/ebookContent';

export interface EbookWithChapters {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  chapters: Chapter[];
  thumbnail_url: string | null;
  cover_color: string;
  total_chapters: number;
  estimated_reading_time: number | null;
  bonus_id: string | null;
}

/**
 * Hook to load ebook content (parsed chapters)
 */
export function useEbookContent(ebookId: string | undefined) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['ebook-content', ebookId],
    queryFn: async () => {
      if (!ebookId) return null;
      
      // Check if ebookId is UUID or slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ebookId);
      
      const { data, error } = await supabase
        .from('ebooks')
        .select('id, title, subtitle, slug, content, thumbnail_url, cover_color, total_chapters, estimated_reading_time, bonus_id')
        .eq(isUUID ? 'id' : 'slug', ebookId)
        .is('deleted_at', null)
        .maybeSingle();
      
      if (error) {
        console.error('Failed to fetch ebook:', error);
        return null;
      }

      if (!data) return null;
      
      // Parse JSONB content to Chapter[]
      let rawChapters = Array.isArray(data.content) 
        ? (data.content as any) 
        : (data.content?.chapters || []);
      
      // Ensure each chapter has an id field
      const chapters: Chapter[] = rawChapters.map((chapter: any, index: number) => ({
        ...chapter,
        id: chapter.id || chapter.number?.toString() || `chapter-${index + 1}`,
      }));
      
      return {
        ...data,
        chapters,
      } as EbookWithChapters;
    },
    enabled: !!ebookId,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });

  return { 
    ebook: data,
    chapters: data?.chapters || [],
    isLoading, 
    error 
  };
}
