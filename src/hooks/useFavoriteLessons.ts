import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface FavoriteLesson {
  id: string;
  user_id: string;
  lesson_id: string;
  program_id: string;
  created_at: string;
  lesson?: {
    id: string;
    day_number: number;
    title: string;
    summary: string | null;
    image_url: string | null;
  };
}

export function useFavoriteLessons(programId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all favorites for current user, optionally filtered by program
  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorite-lessons', user?.id, programId],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from('favorite_lessons')
        .select(`
          id,
          user_id,
          lesson_id,
          program_id,
          created_at,
          lesson:lessons(id, day_number, title, summary, image_url)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (programId) {
        query = query.eq('program_id', programId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(item => ({
        ...item,
        lesson: Array.isArray(item.lesson) ? item.lesson[0] : item.lesson
      })) as FavoriteLesson[];
    },
    enabled: !!user,
  });

  // Toggle favorite mutation
  const toggleFavorite = useMutation({
    mutationFn: async ({ lessonId, programId }: { lessonId: string; programId: string }) => {
      if (!user) throw new Error('Must be logged in');

      // Check if already favorited
      const { data: existing } = await supabase
        .from('favorite_lessons')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single();

      if (existing) {
        // Remove favorite
        const { error } = await supabase
          .from('favorite_lessons')
          .delete()
          .eq('id', existing.id);
        if (error) throw error;
        return { action: 'removed' as const };
      } else {
        // Add favorite
        const { error } = await supabase
          .from('favorite_lessons')
          .insert({
            user_id: user.id,
            lesson_id: lessonId,
            program_id: programId
          });
        if (error) throw error;
        return { action: 'added' as const };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['favorite-lessons'] });
      toast.success(result.action === 'added' ? 'Added to favorites' : 'Removed from favorites');
    },
    onError: () => {
      toast.error('Failed to update favorites');
    }
  });

  // Check if a specific lesson is favorited
  const isFavorite = (lessonId: string) => {
    return favorites.some(f => f.lesson_id === lessonId);
  };

  return {
    favorites,
    isLoading,
    toggleFavorite,
    isFavorite
  };
}
