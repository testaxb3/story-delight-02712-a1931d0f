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
      
      // Parse JSONB content - handle multiple possible structures
      let rawChapters: any[] = [];
      
      console.log('📦 Parsing ebook content:', {
        contentType: typeof data.content,
        isArray: Array.isArray(data.content),
        hasChaptersProperty: data.content?.chapters !== undefined,
        contentKeys: data.content ? Object.keys(data.content) : [],
        firstItem: Array.isArray(data.content) ? data.content[0] : null
      });
      
      if (Array.isArray(data.content)) {
        // Direct array format - this is what we have
        rawChapters = data.content;
        console.log('✅ Using direct array format, chapters count:', rawChapters.length);
      } else if (data.content?.chapters && Array.isArray(data.content.chapters)) {
        // Object with chapters property (alternative format)
        rawChapters = data.content.chapters;
        console.log('✅ Using object.chapters format, chapters count:', rawChapters.length);
      } else {
        console.error('❌ Unknown ebook content format:', data.content);
      }
      
      // Ensure each chapter has required fields
      const chapters: Chapter[] = rawChapters.map((chapter: any, index: number) => {
        // Handle different content field names - prioritize V2 blocks format
        const content = chapter.blocks || chapter.sections || chapter.content || [];
        
        console.log(`📖 Chapter ${index + 1} "${chapter.title}":`, {
          title: chapter.title,
          subtitle: chapter.subtitle,
          hasSections: !!chapter.sections,
          hasContent: !!chapter.content,
          contentLength: Array.isArray(content) ? content.length : 0,
          firstContentBlock: Array.isArray(content) && content[0] ? {
            type: content[0].type,
            hasContent: !!content[0].content
          } : null
        });
        
        return {
          ...chapter,
          id: chapter.id || chapter.number?.toString() || `chapter-${index + 1}`,
          title: (chapter.title || `Chapter ${index + 1}`).trim(),
          subtitle: chapter.subtitle ? chapter.subtitle.trim() : undefined,
          content: Array.isArray(content) ? content : [],
        };
      });
      
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
