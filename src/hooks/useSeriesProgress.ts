import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TrackProgress {
  track_id: string;
  progress_seconds: number;
  completed: boolean;
  last_played_at: string;
}

interface SeriesProgress {
  seriesId: string;
  completedTracks: number;
  totalTracks: number;
  progressPercent: number;
  lastPlayedTrack: {
    trackId: string;
    trackTitle: string;
    trackNumber: number;
    progressSeconds: number;
    durationSeconds: number;
    seriesName: string;
    seriesSlug: string;
    coverImage: string | null;
  } | null;
}

export const useSeriesProgress = (seriesId: string | undefined) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['series-progress', seriesId, user?.id],
    queryFn: async (): Promise<SeriesProgress | null> => {
      if (!seriesId || !user?.id) return null;

      // Get all tracks for this series
      const { data: tracks, error: tracksError } = await supabase
        .from('audio_tracks')
        .select('id, title, track_number, duration_seconds')
        .eq('series_id', seriesId)
        .order('track_number');

      if (tracksError) throw tracksError;
      if (!tracks || tracks.length === 0) return null;

      // Get user progress for these tracks
      const { data: progress, error: progressError } = await supabase
        .from('user_audio_progress')
        .select('track_id, progress_seconds, completed, last_played_at')
        .eq('user_id', user.id)
        .in('track_id', tracks.map(t => t.id));

      if (progressError) throw progressError;

      const progressMap = new Map<string, TrackProgress>(
        (progress || []).map(p => [p.track_id, p])
      );

      const completedTracks = tracks.filter(t => progressMap.get(t.id)?.completed).length;
      
      // Find most recently played track
      let lastPlayedTrack = null;
      if (progress && progress.length > 0) {
        const mostRecent = progress.sort(
          (a, b) => new Date(b.last_played_at).getTime() - new Date(a.last_played_at).getTime()
        )[0];
        
        const track = tracks.find(t => t.id === mostRecent.track_id);
        if (track && !mostRecent.completed) {
          // Get series info
          const { data: series } = await supabase
            .from('audio_series')
            .select('name, slug, cover_image')
            .eq('id', seriesId)
            .single();

          lastPlayedTrack = {
            trackId: track.id,
            trackTitle: track.title,
            trackNumber: track.track_number,
            progressSeconds: mostRecent.progress_seconds,
            durationSeconds: track.duration_seconds,
            seriesName: series?.name || '',
            seriesSlug: series?.slug || '',
            coverImage: series?.cover_image || null,
          };
        }
      }

      return {
        seriesId,
        completedTracks,
        totalTracks: tracks.length,
        progressPercent: Math.round((completedTracks / tracks.length) * 100),
        lastPlayedTrack,
      };
    },
    enabled: !!seriesId && !!user?.id,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Hook to get continue listening across all series
export const useContinueListening = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['continue-listening', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Get most recent incomplete track progress
      const { data: progress, error } = await supabase
        .from('user_audio_progress')
        .select('track_id, progress_seconds, last_played_at')
        .eq('user_id', user.id)
        .eq('completed', false)
        .gt('progress_seconds', 5) // At least 5 seconds listened
        .order('last_played_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (!progress) return null;

      // Get track details
      const { data: track, error: trackError } = await supabase
        .from('audio_tracks')
        .select('id, title, track_number, duration_seconds, series_id, audio_url, thumbnail, is_preview, description, tags, transcript_segments')
        .eq('id', progress.track_id)
        .single();

      if (trackError || !track) return null;

      // Get series details
      const { data: series, error: seriesError } = await supabase
        .from('audio_series')
        .select('*')
        .eq('id', track.series_id)
        .single();

      if (seriesError || !series) return null;

      return {
        track: {
          ...track,
          description: track.description || null,
          tags: track.tags || null,
        },
        series,
        progressSeconds: progress.progress_seconds,
        lastPlayedAt: progress.last_played_at,
      };
    },
    enabled: !!user?.id,
    staleTime: 30 * 1000,
  });
};

// Hook to get total listening time in minutes
export const useTotalListeningTime = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['total-listening-time', user?.id],
    queryFn: async (): Promise<number> => {
      if (!user?.id) return 0;

      const { data, error } = await supabase
        .from('user_audio_progress')
        .select('progress_seconds')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const totalSeconds = (data || []).reduce((sum, p) => sum + (p.progress_seconds || 0), 0);
      return Math.round(totalSeconds / 60);
    },
    enabled: !!user?.id,
    staleTime: 60 * 1000,
  });
};

// Hook to get free tracks count per series
export const useSeriesFreeTracksCount = () => {
  return useQuery({
    queryKey: ['series-free-tracks-count'],
    queryFn: async (): Promise<Map<string, number>> => {
      const { data, error } = await supabase
        .from('audio_tracks')
        .select('series_id')
        .eq('is_preview', true);

      if (error) throw error;

      const countMap = new Map<string, number>();
      (data || []).forEach(track => {
        if (track.series_id) {
          countMap.set(track.series_id, (countMap.get(track.series_id) || 0) + 1);
        }
      });
      return countMap;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to get progress for all series at once
export const useAllSeriesProgress = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['all-series-progress', user?.id],
    queryFn: async (): Promise<Map<string, { completed: number; total: number; percent: number }>> => {
      if (!user?.id) return new Map();

      // Get all series with their track counts
      const { data: series, error: seriesError } = await supabase
        .from('audio_series')
        .select('id, track_count');

      if (seriesError) throw seriesError;

      // Get all user progress
      const { data: progress, error: progressError } = await supabase
        .from('user_audio_progress')
        .select('track_id, completed')
        .eq('user_id', user.id)
        .eq('completed', true);

      if (progressError) throw progressError;

      // Get track to series mapping
      const { data: tracks, error: tracksError } = await supabase
        .from('audio_tracks')
        .select('id, series_id');

      if (tracksError) throw tracksError;

      const trackToSeries = new Map(tracks?.map(t => [t.id, t.series_id]) || []);
      
      // Count completed tracks per series
      const completedPerSeries = new Map<string, number>();
      (progress || []).forEach(p => {
        const seriesId = trackToSeries.get(p.track_id);
        if (seriesId) {
          completedPerSeries.set(seriesId, (completedPerSeries.get(seriesId) || 0) + 1);
        }
      });

      // Build result map
      const result = new Map<string, { completed: number; total: number; percent: number }>();
      (series || []).forEach(s => {
        const completed = completedPerSeries.get(s.id) || 0;
        const total = s.track_count || 0;
        result.set(s.id, {
          completed,
          total,
          percent: total > 0 ? Math.round((completed / total) * 100) : 0,
        });
      });

      return result;
    },
    enabled: !!user?.id,
    staleTime: 60 * 1000,
  });
};
