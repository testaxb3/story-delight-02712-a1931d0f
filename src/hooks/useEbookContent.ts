import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Chapter } from '@/data/ebookContent';

export interface ChapterMarkdown {
  title: string;
  markdown: string;
}

export interface EbookWithChapters {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  chapters: Chapter[];
  chaptersMarkdown: ChapterMarkdown[];
  markdown_source: string | null;
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
      
      const { data, error } = await supabase
        .from('ebooks')
        .select('id, title, subtitle, slug, content, markdown_source, thumbnail_url, cover_color, total_chapters, estimated_reading_time, bonus_id')
        .eq('id', ebookId)
        .is('deleted_at', null)
        .maybeSingle();
      
      if (error) {
        console.error('Failed to fetch ebook:', error);
        return null;
      }

      if (!data) return null;
      
      // Parse JSONB content to Chapter[]
      const chapters: Chapter[] = Array.isArray(data.content) ? (data.content as any) : [];
      
      // Parse markdown into chapters (split by ## headings)
      const chaptersMarkdown: ChapterMarkdown[] = [];
      if (data.markdown_source) {
        // Split by headings (##, ###, etc) at the start of a line
        const markdownChapters = data.markdown_source
          .split(/(?=^#{2,3}\s)/gm)
          .filter(chunk => chunk.trim().length > 0);
        
        markdownChapters.forEach((chapterMd, index) => {
          // Extract title from the chapter markdown
          const titleMatch = chapterMd.match(/^#{2,3}\s+(.+)$/m);
          let title = titleMatch ? titleMatch[1].trim() : `Chapter ${index + 1}`;
          
          // If no title found, try to get from first line
          if (!titleMatch) {
            const firstLine = chapterMd.split('\n')[0]?.trim();
            if (firstLine && firstLine.length > 0 && firstLine.length < 100) {
              title = firstLine.replace(/^#+\s*/, '').trim();
            }
          }
          
          chaptersMarkdown.push({ title, markdown: chapterMd });
        });
      }
      
      return {
        ...data,
        chapters,
        chaptersMarkdown,
      } as EbookWithChapters;
    },
    enabled: !!ebookId,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });

  return { 
    ebook: data,
    chapters: data?.chapters || [],
    chaptersMarkdown: data?.chaptersMarkdown || [],
    markdown_source: data?.markdown_source || null,
    isLoading, 
    error 
  };
}
