import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function usePostActions() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  const addReaction = useCallback(async (postId: string, emoji: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to react');
        return false;
      }

      // Check if reaction already exists
      const { data: existing, error: checkError } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError) {
        console.error('Check error:', checkError);
        throw checkError;
      }

      if (existing) {
        // Remove existing reaction
        const { error: deleteError } = await supabase
          .from('post_likes')
          .delete()
          .eq('id', existing.id);

        if (deleteError) {
          console.error('Delete error:', deleteError);
          throw deleteError;
        }
        toast.success('Reaction removed');
        
        // Trigger a reload by invalidating queries
        window.dispatchEvent(new CustomEvent('reload-posts'));
        return true;
      } else {
        // Add new reaction
        const { error: insertError } = await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id,
            reaction_type: 'like'
          });

        if (insertError) {
          console.error('Insert error:', insertError);
          throw insertError;
        }
        toast.success('Reaction added');
        
        // Trigger a reload by invalidating queries
        window.dispatchEvent(new CustomEvent('reload-posts'));
        return true;
      }
    } catch (error: any) {
      console.error('Reaction error:', error);
      toast.error(`Error: ${error.message}`);
      return false;
    }
  }, []);

  const deletePost = useCallback(async (postId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return false;

    setDeletingPostId(postId);

    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast.success('Post deleted successfully!');
      return true;
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast.error(`Failed to delete post: ${error.message}`);
      return false;
    } finally {
      setDeletingPostId(null);
    }
  }, []);

  const createPost = useCallback(async (
    communityId: string,
    userId: string,
    postData: {
      title: string;
      content: string;
      image?: File | null;
      script_used?: string;
      duration_minutes?: number;
      result_type?: 'success' | 'partial' | 'needs_practice';
    }
  ) => {
    if (!postData.title.trim()) {
      toast.error('Title is required');
      return false;
    }

    setIsSubmitting(true);

    try {
      // Upload image if exists
      let imageUrl: string | null = null;
      if (postData.image) {
        toast.info('📤 Uploading image...');
        imageUrl = await uploadImage(userId, postData.image);
      }

      const { error } = await supabase
        .from('community_posts')
        .insert({
          community_id: communityId,
          user_id: userId,
          title: postData.title.trim(),
          content: postData.content.trim() || null,
          image_url: imageUrl,
          script_used: postData.script_used?.trim() || null,
          duration_minutes: postData.duration_minutes || null,
          result_type: postData.result_type || 'success',
        });

      if (error) throw error;

      toast.success('✅ Post created!');
      return true;
    } catch (error: any) {
      toast.error(`❌ Failed: ${error.message}`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    addReaction,
    deletePost,
    createPost,
    isSubmitting,
    deletingPostId,
  };
}

async function uploadImage(userId: string, file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('community-posts')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('community-posts')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}
