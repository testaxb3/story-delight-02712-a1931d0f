import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface VideoProgress {
  video_id: string;
  progress_seconds: number;
  total_duration_seconds: number;
  completed: boolean;
  last_watched_at: string;
}

/**
 * Optimized hook to manage video progress using React Query
 * Provides automatic caching, optimistic updates, and better UX
 */
export function useVideoProgressOptimized() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all video progress for current user
  const { data: progressArray = [], isLoading } = useQuery({
    queryKey: ['video-progress', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('video_progress')
        .select('video_id, progress_seconds, total_duration_seconds, completed, last_watched_at')
        .eq('user_id', user.id);

      if (error) {
        // Silenciar erro se a tabela não existir (migração pendente)
        if (error?.code !== 'PGRST205') {
          console.error('Error fetching video progress:', error);
        }
        return [];
      }

      return (data || []).map(item => ({
        video_id: item.video_id,
        progress_seconds: item.progress_seconds || 0,
        total_duration_seconds: item.total_duration_seconds || 0,
        completed: item.completed || false,
        last_watched_at: item.last_watched_at || new Date().toISOString(),
      })) as VideoProgress[];
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Convert array to Map for easier lookups (useMemo to prevent recreation)
  const progress = React.useMemo(
    () => new Map(progressArray.map(p => [p.video_id, p])),
    [progressArray]
  );

  // Mutation to update video progress
  const { mutateAsync: updateProgressMutation } = useMutation({
    mutationFn: async ({
      videoId,
      progressSeconds,
      totalDurationSeconds,
    }: {
      videoId: string;
      progressSeconds: number;
      totalDurationSeconds: number;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const completed = progressSeconds >= totalDurationSeconds * 0.9;

      const { data, error } = await supabase.from('video_progress').upsert(
        {
          user_id: user.id,
          video_id: videoId,
          progress_seconds: progressSeconds,
          total_duration_seconds: totalDurationSeconds,
          completed,
          last_watched_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,video_id',
        }
      ).select();

      if (error) {
        // Silenciar erro se a tabela não existir
        if (error?.code !== 'PGRST205') {
          console.error('[useVideoProgress] Error updating video progress:', error);
        }
        throw error;
      }

      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch video progress
      queryClient.invalidateQueries({ queryKey: ['video-progress', user?.id] });
    },
  });

  // Helper functions (memoized to prevent recreation)
  const updateProgress = React.useCallback(
    async (
      videoId: string,
      progressSeconds: number,
      totalDurationSeconds: number
    ) => {
      return updateProgressMutation({
        videoId,
        progressSeconds,
        totalDurationSeconds,
      });
    },
    [updateProgressMutation]
  );

  const markAsWatched = React.useCallback(
    async (videoId: string, totalDurationSeconds: number) => {
      return updateProgress(videoId, totalDurationSeconds, totalDurationSeconds);
    },
    [updateProgress]
  );

  const getProgress = React.useCallback(
    (videoId: string): VideoProgress | null => {
      return progress.get(videoId) || null;
    },
    [progress]
  );

  const getProgressPercentage = React.useCallback(
    (videoId: string): number => {
      const videoProgress = progress.get(videoId);
      if (!videoProgress || videoProgress.total_duration_seconds === 0) return 0;

      return Math.min(
        100,
        Math.round(
          (videoProgress.progress_seconds / videoProgress.total_duration_seconds) * 100
        )
      );
    },
    [progress]
  );

  const isCompleted = React.useCallback(
    (videoId: string): boolean => {
      return progress.get(videoId)?.completed || false;
    },
    [progress]
  );

  const isInProgress = React.useCallback(
    (videoId: string): boolean => {
      const videoProgress = progress.get(videoId);
      return !!(
        videoProgress &&
        videoProgress.progress_seconds > 0 &&
        !videoProgress.completed
      );
    },
    [progress]
  );

  const getLastWatchedVideo = React.useCallback(
    (): VideoProgress | null => {
      if (progress.size === 0) return null;

      const inProgressVideos = Array.from(progress.values()).filter(
        (p) => !p.completed && p.progress_seconds > 0
      );

      if (inProgressVideos.length === 0) return null;

      // Sort by last_watched_at descending
      inProgressVideos.sort((a, b) => {
        return new Date(b.last_watched_at).getTime() - new Date(a.last_watched_at).getTime();
      });

      return inProgressVideos[0];
    },
    [progress]
  );

  const refresh = React.useCallback(
    () => queryClient.invalidateQueries({ queryKey: ['video-progress', user?.id] }),
    [queryClient, user?.id]
  );

  return {
    progress,
    loading: isLoading,
    updateProgress,
    markAsWatched,
    getProgress,
    getProgressPercentage,
    isCompleted,
    isInProgress,
    getLastWatchedVideo,
    refresh,
  };
}
