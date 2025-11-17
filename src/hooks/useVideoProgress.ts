import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface VideoProgress {
  video_id: string;
  progress_seconds: number;
  total_duration_seconds: number;
  completed: boolean;
  last_watched_at: string;
}

export function useVideoProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Map<string, VideoProgress>>(new Map());
  const [loading, setLoading] = useState(true);

  // Fetch all video progress for current user
  const fetchProgress = useCallback(async () => {
    if (!user) {
      setProgress(new Map());
      setLoading(false);
      return;
    }

    try {
      // ✅ PERFORMANCE: Only select needed columns
      const { data, error } = await supabase
        .from('video_progress')
        .select('video_id, progress_seconds, total_duration_seconds, completed, last_watched_at')
        .eq('user_id', user.id);

      if (error) throw error;

      const progressMap = new Map<string, VideoProgress>();
      data?.forEach((item) => {
        progressMap.set(item.video_id, {
          video_id: item.video_id,
          progress_seconds: item.progress_seconds || 0,
          total_duration_seconds: item.total_duration_seconds || 0,
          completed: item.completed || false,
          last_watched_at: item.last_watched_at || new Date().toISOString(),
        });
      });

      setProgress(progressMap);
    } catch (error: any) {
      // Silenciar erro se a tabela não existir (migração pendente)
      if (error?.code !== 'PGRST205') {
        console.error('Error fetching video progress:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Update progress for a video
  const updateProgress = useCallback(
    async (
      videoId: string,
      progressSeconds: number,
      totalDurationSeconds: number
    ) => {
      if (!user) {
        console.warn('[useVideoProgress] No user found, cannot save progress');
        return;
      }

      const completed = progressSeconds >= totalDurationSeconds * 0.9; // 90% = completed

      console.log('[useVideoProgress] Updating progress in Supabase:', {
        user_id: user.id,
        video_id: videoId,
        progress_seconds: progressSeconds,
        total_duration_seconds: totalDurationSeconds,
        completed
      });

      try {
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

        if (error) throw error;

        console.log('[useVideoProgress] Progress saved successfully:', data);

        // Update local state
        setProgress((prev) => {
          const newMap = new Map(prev);
          newMap.set(videoId, {
            video_id: videoId,
            progress_seconds: progressSeconds,
            total_duration_seconds: totalDurationSeconds,
            completed,
            last_watched_at: new Date().toISOString(),
          });
          return newMap;
        });
      } catch (error: any) {
        console.error('[useVideoProgress] Error updating video progress:', error);
        // Silenciar erro se a tabela não existir (migração pendente)
        if (error?.code !== 'PGRST205') {
          console.error('[useVideoProgress] Error details:', {
            code: error?.code,
            message: error?.message,
            details: error?.details
          });
        }
      }
    },
    [user]
  );

  // Mark video as watched (completed)
  const markAsWatched = useCallback(
    async (videoId: string, totalDurationSeconds: number) => {
      await updateProgress(videoId, totalDurationSeconds, totalDurationSeconds);
    },
    [updateProgress]
  );

  // Get progress for a specific video
  const getProgress = useCallback(
    (videoId: string): VideoProgress | null => {
      return progress.get(videoId) || null;
    },
    [progress]
  );

  // Get progress percentage (0-100)
  const getProgressPercentage = useCallback(
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

  // Check if video is completed
  const isCompleted = useCallback(
    (videoId: string): boolean => {
      return progress.get(videoId)?.completed || false;
    },
    [progress]
  );

  // Check if video is in progress (started but not completed)
  const isInProgress = useCallback(
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

  // Get last watched video (for "Continue watching")
  const getLastWatchedVideo = useCallback((): VideoProgress | null => {
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
  }, [progress]);

  return {
    progress,
    loading,
    updateProgress,
    markAsWatched,
    getProgress,
    getProgressPercentage,
    isCompleted,
    isInProgress,
    getLastWatchedVideo,
    refresh: fetchProgress,
  };
}
