import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type AudioSeries = Database['public']['Tables']['audio_series']['Row'];
type AudioSeriesInsert = Database['public']['Tables']['audio_series']['Insert'];
type AudioSeriesUpdate = Database['public']['Tables']['audio_series']['Update'];

type AudioTrack = Database['public']['Tables']['audio_tracks']['Row'];
type AudioTrackInsert = Database['public']['Tables']['audio_tracks']['Insert'];
type AudioTrackUpdate = Database['public']['Tables']['audio_tracks']['Update'];

// ============= SERIES HOOKS =============

export const useAudioSeriesAdmin = () => {
  const queryClient = useQueryClient();

  const { data: series = [], isLoading } = useQuery({
    queryKey: ['admin-audio-series'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audio_series')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as AudioSeries[];
    },
  });

  const createSeries = useMutation({
    mutationFn: async (newSeries: AudioSeriesInsert) => {
      const { data, error } = await supabase
        .from('audio_series')
        .insert(newSeries)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-audio-series'] });
      toast.success('Series created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create series: ' + error.message);
    },
  });

  const updateSeries = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: AudioSeriesUpdate }) => {
      const { data, error } = await supabase
        .from('audio_series')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-audio-series'] });
      toast.success('Series updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update series: ' + error.message);
    },
  });

  const deleteSeries = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('audio_series')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-audio-series'] });
      queryClient.invalidateQueries({ queryKey: ['admin-audio-tracks'] });
      toast.success('Series deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete series: ' + error.message);
    },
  });

  const uploadCoverImage = async (file: File, seriesId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${seriesId}-${Date.now()}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('audio-covers')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('audio-covers')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  return {
    series,
    isLoading,
    createSeries,
    updateSeries,
    deleteSeries,
    uploadCoverImage,
  };
};

// ============= TRACKS HOOKS =============

export const useAudioTracksAdmin = () => {
  const queryClient = useQueryClient();

  const { data: tracks = [], isLoading } = useQuery({
    queryKey: ['admin-audio-tracks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audio_tracks')
        .select('*, series:audio_series(name)')
        .order('series_id', { ascending: true })
        .order('track_number', { ascending: true });

      if (error) throw error;
      return data as (AudioTrack & { series: { name: string } | null })[];
    },
  });

  const createTrack = useMutation({
    mutationFn: async (newTrack: AudioTrackInsert) => {
      const { data, error } = await supabase
        .from('audio_tracks')
        .insert(newTrack)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-audio-tracks'] });
      queryClient.invalidateQueries({ queryKey: ['admin-audio-series'] });
      toast.success('Track created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create track: ' + error.message);
    },
  });

  const updateTrack = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: AudioTrackUpdate }) => {
      const { data, error } = await supabase
        .from('audio_tracks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-audio-tracks'] });
      toast.success('Track updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update track: ' + error.message);
    },
  });

  const deleteTrack = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('audio_tracks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-audio-tracks'] });
      queryClient.invalidateQueries({ queryKey: ['admin-audio-series'] });
      toast.success('Track deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete track: ' + error.message);
    },
  });

  const uploadAudioFile = async (file: File): Promise<{ url: string; duration: number }> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `tracks/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('audio-tracks')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('audio-tracks')
      .getPublicUrl(filePath);

    // Get audio duration
    const duration = await getAudioDuration(file);

    return { url: data.publicUrl, duration };
  };

  return {
    tracks,
    isLoading,
    createTrack,
    updateTrack,
    deleteTrack,
    uploadAudioFile,
  };
};

// Helper function to get audio duration
const getAudioDuration = (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio.addEventListener('loadedmetadata', () => {
      resolve(Math.round(audio.duration));
      URL.revokeObjectURL(audio.src);
    });
  });
};
