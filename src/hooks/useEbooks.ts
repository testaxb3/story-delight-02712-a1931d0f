import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Ebook {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  content: any; // JSONB
  markdown_source: string | null;
  thumbnail_url: string | null;
  cover_color: string;
  total_chapters: number;
  estimated_reading_time: number | null;
  total_words: number | null;
  bonus_id: string | null;
  metadata: any;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Stats from view
  total_readers?: number;
  avg_reading_time?: number;
  completed_count?: number;
  completion_rate?: number;
}

/**
 * Hook to list and fetch ebooks
 */
export function useEbooks() {
  const { data: ebooks, isLoading, error, refetch } = useQuery({
    queryKey: ['ebooks'],
    queryFn: async () => {
      // ✅ PERFORMANCE: ebooks_with_stats is a view - select * is acceptable here
      const { data, error } = await supabase
        .from('ebooks_with_stats')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Ebook[];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return {
    ebooks: ebooks || [],
    isLoading,
    error,
    refetch
  };
}

/**
 * Hook to fetch a single ebook by ID
 */
export function useEbook(ebookId: string | undefined) {
  const { data: ebook, isLoading, error } = useQuery({
    queryKey: ['ebook', ebookId],
    queryFn: async () => {
      if (!ebookId) return null;
      
      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .eq('id', ebookId)
        .is('deleted_at', null)
        .single();
      
      if (error) throw error;
      return data as Ebook;
    },
    enabled: !!ebookId,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });

  return { ebook, isLoading, error };
}

/**
 * Hook to fetch ebook by slug
 */
export function useEbookBySlug(slug: string | undefined) {
  const { data: ebook, isLoading, error } = useQuery({
    queryKey: ['ebook-slug', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .eq('slug', slug)
        .is('deleted_at', null)
        .single();
      
      if (error) throw error;
      return data as Ebook;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  });

  return { ebook, isLoading, error };
}

/**
 * Hook to fetch ebook by bonus ID
 */
export function useEbookByBonusId(bonusId: string | undefined) {
  const { data: ebook, isLoading, error } = useQuery({
    queryKey: ['ebook-bonus', bonusId],
    queryFn: async () => {
      if (!bonusId) return null;
      
      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .eq('bonus_id', bonusId)
        .is('deleted_at', null)
        .single();
      
      if (error) throw error;
      return data as Ebook;
    },
    enabled: !!bonusId,
    staleTime: 1000 * 60 * 10,
  });

  return { ebook, isLoading, error };
}

/**
 * Hook to update an ebook
 */
export function useUpdateEbook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Ebook> }) => {
      const { data, error } = await supabase
        .from('ebooks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Ebook;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ebooks'] });
      queryClient.invalidateQueries({ queryKey: ['ebook', data.id] });
      queryClient.invalidateQueries({ queryKey: ['ebook-slug', data.slug] });
      if (data.bonus_id) {
        queryClient.invalidateQueries({ queryKey: ['ebook-bonus', data.bonus_id] });
      }
    },
  });
}

/**
 * Hook to delete an ebook (soft delete)
 */
export function useDeleteEbook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ebooks')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ebooks'] });
    },
  });
}
