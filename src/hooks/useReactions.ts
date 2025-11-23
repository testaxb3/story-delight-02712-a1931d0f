import React, { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ReactionType } from '@/components/Community/ReactionPicker';
import { ReactionCount } from '@/components/Community/ReactionsList';

interface UseReactionsProps {
  postId: string;
  userId: string | null;
}

export function useReactions({ postId, userId }: UseReactionsProps) {
  const [reactions, setReactions] = useState<ReactionCount[]>([]);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // PERFORMANCE FIX: Track component mount status to prevent memory leaks
  // Prevents setState calls on unmounted components
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Fetch reactions for a post
  const fetchReactions = useCallback(async () => {
    if (!postId) return;

    try {
      const { data, error } = await supabase
        .from('post_likes')
        .select('reaction_type, user_id')
        .eq('post_id', postId);

      if (error) throw error;

      // PERFORMANCE FIX: Only update state if component is still mounted
      if (!isMountedRef.current) return;

      // Count reactions by type
      const reactionCounts: Record<ReactionType, number> = {
        like: 0,
        love: 0,
        strong: 0,
        empathy: 0,
        celebrate: 0,
        insightful: 0,
        helpful: 0,
      };

      let userReactionType: ReactionType | null = null;

      data?.forEach((like) => {
        const reactionType = (like.reaction_type || 'like') as ReactionType;
        reactionCounts[reactionType]++;

        if (userId && like.user_id === userId) {
          userReactionType = reactionType;
        }
      });

      // Convert to array
      const reactionsArray: ReactionCount[] = Object.entries(reactionCounts)
        .filter(([_, count]) => count > 0)
        .map(([type, count]) => ({
          type: type as ReactionType,
          count,
        }));

      setReactions(reactionsArray);
      setUserReaction(userReactionType);
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  }, [postId, userId]);

  // Add or update reaction
  const addReaction = useCallback(
    async (reactionType: ReactionType) => {
      if (!userId) {
        toast.error('You must be signed in to react');
        return;
      }

      // PERFORMANCE FIX: Don't start operation if component is unmounted
      if (!isMountedRef.current) return;

      setIsLoading(true);

      try {
        // If user already reacted, update the reaction
        if (userReaction) {
          const { error } = await supabase
            .from('post_likes')
            .update({ reaction_type: reactionType })
            .eq('post_id', postId)
            .eq('user_id', userId);

          if (error) throw error;
        } else {
          // Insert new reaction
          const { error } = await supabase
            .from('post_likes')
            .insert({
              post_id: postId,
              user_id: userId,
              reaction_type: reactionType,
            });

          if (error) throw error;
        }

        // PERFORMANCE FIX: Only update state if component is still mounted
        if (!isMountedRef.current) return;

        // Update local state
        await fetchReactions();
      } catch (error: any) {
        console.error('Error adding reaction:', error);
        if (isMountedRef.current) {
          toast.error('Failed to add reaction');
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    [postId, userId, userReaction, fetchReactions]
  );

  // Remove reaction
  const removeReaction = useCallback(async () => {
    if (!userId || !userReaction) return;

    // PERFORMANCE FIX: Don't start operation if component is unmounted
    if (!isMountedRef.current) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (error) throw error;

      // PERFORMANCE FIX: Only update state if component is still mounted
      if (!isMountedRef.current) return;

      // Update local state
      await fetchReactions();
    } catch (error: any) {
      console.error('Error removing reaction:', error);
      if (isMountedRef.current) {
        toast.error('Failed to remove reaction');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [postId, userId, userReaction, fetchReactions]);

  // Toggle reaction (same reaction = remove, different = change)
  const toggleReaction = useCallback(
    async (reactionType: ReactionType) => {
      if (userReaction === reactionType) {
        await removeReaction();
      } else {
        await addReaction(reactionType);
      }
    },
    [userReaction, addReaction, removeReaction]
  );

  // Get total reaction count
  const totalCount = reactions.reduce((sum, r) => sum + r.count, 0);

  return {
    reactions,
    userReaction,
    totalCount,
    isLoading,
    fetchReactions,
    addReaction,
    removeReaction,
    toggleReaction,
  };
}
