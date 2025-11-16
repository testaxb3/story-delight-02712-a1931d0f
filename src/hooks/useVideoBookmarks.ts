import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useVideoBookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = useCallback(async () => {
    if (!user) {
      setBookmarks(new Set());
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('video_bookmarks')
        .select('video_id')
        .eq('user_id', user.id);

      if (error) throw error;

      setBookmarks(new Set(data?.map(b => b.video_id) || []));
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const toggleBookmark = async (videoId: string) => {
    if (!user) {
      toast.error('Please sign in to bookmark videos');
      return;
    }

    const isBookmarked = bookmarks.has(videoId);

    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from('video_bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('video_id', videoId);

        if (error) throw error;

        setBookmarks(prev => {
          const next = new Set(prev);
          next.delete(videoId);
          return next;
        });
        toast.success('Bookmark removed');
      } else {
        const { error } = await supabase
          .from('video_bookmarks')
          .insert({ user_id: user.id, video_id: videoId });

        if (error) throw error;

        setBookmarks(prev => new Set(prev).add(videoId));
        toast.success('Video bookmarked');
      }
    } catch (error: any) {
      console.error('Error toggling bookmark:', error);
      toast.error(error.message || 'Failed to update bookmark');
    }
  };

  const isBookmarked = (videoId: string) => bookmarks.has(videoId);

  return {
    bookmarks,
    loading,
    toggleBookmark,
    isBookmarked,
  };
}
