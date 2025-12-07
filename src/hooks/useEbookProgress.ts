import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface EbookProgress {
  id: string;
  user_id: string;
  ebook_id: string;
  current_chapter: number;
  completed_chapters: number[];
  scroll_position: number;
  last_read_at: string;
  first_read_at: string;
  reading_time_minutes: number;
  sessions_count: number;
  bookmarks: any[];
  notes: Record<string, any[]>;
  highlights: Record<string, any[]>;
  reading_preferences: {
    fontSize?: number;
    theme?: string;
    continuousScroll?: boolean;
  };
}

/**
 * Hook to manage ebook reading progress
 */
export function useEbookProgress(ebookId: string | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Load progress
  const { data: progress, isLoading } = useQuery({
    queryKey: ['ebook-progress', ebookId, user?.id],
    queryFn: async () => {
      if (!ebookId || !user) return null;
      
      const { data, error } = await supabase
        .from('user_ebook_progress')
        .select('*')
        .eq('ebook_id', ebookId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as EbookProgress | null;
    },
    enabled: !!ebookId && !!user,
  });

  // Update current chapter
  const updateCurrentChapter = useMutation({
    mutationFn: async (chapterIndex: number) => {
      if (!ebookId || !user) throw new Error('Missing required data');

      const { error } = await supabase
        .from('user_ebook_progress')
        .upsert({
          user_id: user.id,
          ebook_id: ebookId,
          current_chapter: chapterIndex,
          last_read_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,ebook_id',
        });

      if (error) throw error;
    },
    onSuccess: (_, chapterIndex) => {
      if (import.meta.env.DEV) console.log('✅ Chapter progress saved:', chapterIndex);
      // Don't invalidate immediately - it causes remounting
      // queryClient.invalidateQueries({ queryKey: ['ebook-progress', ebookId] });
    },
    onError: (error, chapterIndex) => {
      if (import.meta.env.DEV) console.error('❌ Failed to save chapter progress:', { chapterIndex, error });
      toast.error('Failed to save progress. Please try again.');
    },
  });

  // Mark chapter as complete
  const markChapterComplete = useMutation({
    mutationFn: async (chapterIndex: number) => {
      if (!ebookId || !user) throw new Error('Missing required data');

      const { error } = await supabase.rpc('mark_chapter_complete', {
        p_ebook_id: ebookId,
        p_chapter_index: chapterIndex,
      });

      if (error) throw error;
    },
    onSuccess: (_, chapterIndex) => {
      if (import.meta.env.DEV) console.log('✅ Chapter marked complete:', chapterIndex);
      // Don't invalidate immediately - it causes remounting
      // queryClient.invalidateQueries({ queryKey: ['ebook-progress', ebookId] });
      toast.success('Chapter marked as complete! 🎉');
    },
    onError: (error, chapterIndex) => {
      if (import.meta.env.DEV) console.error('❌ Failed to mark chapter complete:', { chapterIndex, error });
      toast.error('Failed to mark chapter complete.');
    },
  });

  // Update scroll position
  const updateScrollPosition = useMutation({
    mutationFn: async (scrollPosition: number) => {
      if (!ebookId || !user) throw new Error('Missing required data');

      const { error } = await supabase
        .from('user_ebook_progress')
        .upsert({
          user_id: user.id,
          ebook_id: ebookId,
          scroll_position: scrollPosition,
          last_read_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,ebook_id',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      // Don't invalidate scroll position updates - too frequent and causes remounting
    },
    onError: (error) => {
      if (import.meta.env.DEV) console.error('❌ Failed to save scroll position:', error);
      // Don't show toast for scroll errors as they happen frequently
    },
  });

  // Update reading time
  const updateReadingTime = useMutation({
    mutationFn: async (minutesDelta: number) => {
      if (!ebookId || !user) throw new Error('Missing required data');

      const { error } = await supabase.rpc('update_reading_time', {
        p_ebook_id: ebookId,
        p_minutes_delta: minutesDelta,
      });

      if (error) throw error;
    },
    onSuccess: (_, minutesDelta) => {
      if (import.meta.env.DEV) console.log('✅ Reading time updated:', minutesDelta, 'minutes');
      queryClient.invalidateQueries({ queryKey: ['ebook-progress', ebookId] });
    },
    onError: (error) => {
      if (import.meta.env.DEV) console.error('❌ Failed to update reading time:', error);
    },
  });

  // Save note
  const saveNote = useMutation({
    mutationFn: async ({ chapterId, note }: { chapterId: string; note: string }) => {
      if (!ebookId || !user) throw new Error('Missing required data');

      const currentNotes = progress?.notes || {};
      const chapterNotes = currentNotes[chapterId] || [];
      
      const updatedNotes = {
        ...currentNotes,
        [chapterId]: [
          ...chapterNotes,
          {
            text: note,
            timestamp: new Date().toISOString(),
          },
        ],
      };

      const { error } = await supabase
        .from('user_ebook_progress')
        .upsert({
          user_id: user.id,
          ebook_id: ebookId,
          notes: updatedNotes,
          last_read_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,ebook_id',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      if (import.meta.env.DEV) console.log('✅ Note saved');
      queryClient.invalidateQueries({ queryKey: ['ebook-progress', ebookId] });
      toast.success('Nota salva! 📝');
    },
    onError: (error) => {
      if (import.meta.env.DEV) console.error('❌ Failed to save note:', error);
      toast.error('Failed to save note.');
    },
  });

  // Save highlight
  const saveHighlight = useMutation({
    mutationFn: async ({ chapterId, text, color }: { chapterId: string; text: string; color: string }) => {
      if (!ebookId || !user) throw new Error('Missing required data');

      const currentHighlights = progress?.highlights || {};
      const chapterHighlights = currentHighlights[chapterId] || [];
      
      const updatedHighlights = {
        ...currentHighlights,
        [chapterId]: [
          ...chapterHighlights,
          { text, color, timestamp: new Date().toISOString() },
        ],
      };

      const { error } = await supabase
        .from('user_ebook_progress')
        .upsert({
          user_id: user.id,
          ebook_id: ebookId,
          highlights: updatedHighlights,
          last_read_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,ebook_id',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      if (import.meta.env.DEV) console.log('✅ Highlight saved');
      queryClient.invalidateQueries({ queryKey: ['ebook-progress', ebookId] });
      toast.success('Texto destacado! ✨');
    },
    onError: (error) => {
      if (import.meta.env.DEV) console.error('❌ Failed to save highlight:', error);
      toast.error('Failed to save highlight.');
    },
  });

  // Add bookmark
  const addBookmark = useMutation({
    mutationFn: async ({ chapter, position, label }: { chapter: number; position: number; label?: string }) => {
      if (!ebookId || !user) throw new Error('Missing required data');

      const { error } = await supabase.rpc('add_bookmark', {
        p_ebook_id: ebookId,
        p_chapter: chapter,
        p_position: position,
        p_label: label || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      if (import.meta.env.DEV) console.log('✅ Bookmark added');
      queryClient.invalidateQueries({ queryKey: ['ebook-progress', ebookId] });
      toast.success('Marcador adicionado! 🔖');
    },
    onError: (error) => {
      if (import.meta.env.DEV) console.error('❌ Failed to add bookmark:', error);
      toast.error('Failed to add bookmark.');
    },
  });

  // Update reading preferences
  const updatePreferences = useMutation({
    mutationFn: async (preferences: Partial<EbookProgress['reading_preferences']>) => {
      if (!ebookId || !user) throw new Error('Missing required data');

      const currentPrefs = progress?.reading_preferences || {};
      const updatedPrefs = { ...currentPrefs, ...preferences };

      const { error } = await supabase
        .from('user_ebook_progress')
        .upsert({
          user_id: user.id,
          ebook_id: ebookId,
          reading_preferences: updatedPrefs,
          last_read_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,ebook_id',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ebook-progress', ebookId] });
    },
  });

  return {
    progress,
    isLoading,
    updateCurrentChapter,
    markChapterComplete,
    updateScrollPosition,
    updateReadingTime,
    saveNote,
    saveHighlight,
    addBookmark,
    updatePreferences,
  };
}
