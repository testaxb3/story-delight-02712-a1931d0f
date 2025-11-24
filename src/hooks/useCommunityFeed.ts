import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Post {
  id: string;
  title: string | null;
  content: string;
  image_url: string | null;
  script_used: string | null;
  duration_minutes: number | null;
  result_type: 'success' | 'partial' | 'needs_practice' | null;
  created_at: string;
  user_id: string;
  profiles: {
    username: string | null;
    name: string;
    photo_url: string | null;
    brain_profile: string | null;
  };
}

export interface PostReaction {
  emoji: string;
  count: number;
}

export function useCommunityFeed(communityId: string | null) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postReactions, setPostReactions] = useState<Record<string, PostReaction[]>>({});
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    if (!communityId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('id, title, content, image_url, script_used, duration_minutes, result_type, created_at, user_id, profiles:user_id(username, name, photo_url, brain_profile)')
        .eq('community_id', communityId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPosts((data || []) as any);

      // Load reactions for all posts
      if (data && data.length > 0) {
        await loadPostReactions(data.map(p => p.id));
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [communityId]);

  const loadPostReactions = useCallback(async (postIds: string[]) => {
    if (postIds.length === 0) return;

    try {
      const { data, error } = await supabase
        .from('post_likes')
        .select('post_id, reaction_type, user_id')
        .in('post_id', postIds);

      if (error) throw error;

      // Map reaction types to emojis
      const reactionTypeToEmoji: Record<string, string> = {
        'love': '❤️',
        'like': '👍',
        'celebrate': '🎉',
        'strong': '💪',
        'insightful': '💡',
        'helpful': '🤝',
        'empathy': '🙏',
      };

      // Group reactions by post_id
      const reactionsByPost: Record<string, PostReaction[]> = {};
      
      (data || []).forEach((reaction: any) => {
        if (!reactionsByPost[reaction.post_id]) {
          reactionsByPost[reaction.post_id] = [];
        }
        
        const emoji = reactionTypeToEmoji[reaction.reaction_type] || '❤️';
        const existingReaction = reactionsByPost[reaction.post_id].find(r => r.emoji === emoji);
        if (existingReaction) {
          existingReaction.count++;
        } else {
          reactionsByPost[reaction.post_id].push({ emoji, count: 1 });
        }
      });

      setPostReactions(reactionsByPost);
    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!communityId) return;

    loadPosts();

    // Subscribe to post changes
    const postsChannel = supabase
      .channel(`community_posts:${communityId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_posts',
          filter: `community_id=eq.${communityId}`,
        },
        () => {
          loadPosts();
        }
      )
      .subscribe();

    // Subscribe to reaction changes
    const reactionsChannel = supabase
      .channel(`post_likes:${communityId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_likes',
        },
        () => {
          const postIds = posts.map(p => p.id);
          if (postIds.length > 0) {
            loadPostReactions(postIds);
          }
        }
      )
      .subscribe();

    // Listen for manual reload events
    const handleReload = () => {
      loadPosts();
    };
    window.addEventListener('reload-posts', handleReload);

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(reactionsChannel);
      window.removeEventListener('reload-posts', handleReload);
    };
  }, [communityId, loadPosts, posts]);

  return {
    posts,
    postReactions,
    loading,
    loadPosts,
  };
}
