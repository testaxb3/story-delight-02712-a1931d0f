import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useFavoriteScripts() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // PERFORMANCE FIX: Track component mount status to prevent memory leaks
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadFavorites = useCallback(async () => {
    if (!user?.profileId) {
      if (isMountedRef.current) {
        setFavorites([]);
        setLoading(false);
      }
      return;
    }

    try {
      const { data, error } = await supabase
        .from('favorite_scripts')
        .select('script_id')
        .eq('user_id', user.profileId);

      // PERFORMANCE FIX: Only update state if component is still mounted
      if (!isMountedRef.current) return;

      if (error) {
        // If table doesn't exist, use localStorage as fallback
        if (error.code === 'PGRST205') {
          console.warn('favorite_scripts table not found - using localStorage fallback');
          const stored = localStorage.getItem(`favorites_${user.profileId}`);
          setFavorites(stored ? JSON.parse(stored) : []);
          setLoading(false);
          return;
        }
        throw error;
      }

      setFavorites(data?.map(f => f.script_id) || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
      // PERFORMANCE FIX: Only update state if component is still mounted
      if (!isMountedRef.current) return;

      // Fallback to localStorage
      const stored = localStorage.getItem(`favorites_${user.profileId}`);
      setFavorites(stored ? JSON.parse(stored) : []);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [user?.profileId]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const toggleFavorite = async (scriptId: string) => {
    if (!user?.profileId) {
      toast.error('Please sign in to save favorites');
      return false;
    }

    // PERFORMANCE FIX: Don't start operation if component is unmounted
    if (!isMountedRef.current) return false;

    const isFavorite = favorites.includes(scriptId);

    try {
      if (isFavorite) {
        // Remove favorite
        const { error } = await supabase
          .from('favorite_scripts')
          .delete()
          .eq('user_id', user.profileId)
          .eq('script_id', scriptId);

        if (error && error.code !== 'PGRST205') throw error;

        // PERFORMANCE FIX: Only update state if component is still mounted
        if (!isMountedRef.current) return false;

        const newFavorites = favorites.filter(id => id !== scriptId);
        setFavorites(newFavorites);
        localStorage.setItem(`favorites_${user.profileId}`, JSON.stringify(newFavorites));
        toast.success('Removed from favorites');
      } else {
        // Add favorite
        const { error } = await supabase
          .from('favorite_scripts')
          .insert({
            user_id: user.profileId,
            script_id: scriptId
          });

        if (error && error.code !== 'PGRST205') throw error;

        // PERFORMANCE FIX: Only update state if component is still mounted
        if (!isMountedRef.current) return false;

        const newFavorites = [...favorites, scriptId];
        setFavorites(newFavorites);
        localStorage.setItem(`favorites_${user.profileId}`, JSON.stringify(newFavorites));
        toast.success('Added to favorites ⭐');
      }

      return true;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      if (isMountedRef.current) {
        toast.error('Could not update favorite');
      }
      return false;
    }
  };

  const isFavorite = (scriptId: string) => favorites.includes(scriptId);

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
    reload: loadFavorites
  };
}
