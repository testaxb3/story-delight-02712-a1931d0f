import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PostFilters {
  searchQuery?: string;
  postType?: string | null;
  userId?: string;
}

export function useCommunityPosts(filters: PostFilters = {}) {
  return useQuery({
    queryKey: ['community-posts', filters],
    queryFn: async () => {
      let query = supabase
        .from('community_posts_with_stats')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (filters.searchQuery) {
        query = query.ilike('content', `%${filters.searchQuery}%`);
      }

      if (filters.postType && filters.postType !== 'all') {
        query = query.eq('post_type', filters.postType);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data || [];
    },
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
  });
}

export function usePostComments(postId: string) {
  return useQuery({
    queryKey: ['post-comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          *,
          profiles:user_id (
            name,
            email,
            photo_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      return data || [];
    },
    staleTime: 1 * 60 * 1000,
  });
}

export function usePostLikes(postId: string, userId?: string) {
  return useQuery({
    queryKey: ['post-likes', postId, userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('post_likes')
        .select('*')
        .eq('post_id', postId);

      if (error) throw error;

      const count = data?.length || 0;
      const liked = userId ? data?.some(like => like.user_id === userId) || false : false;
      
      return { count, liked };
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}
