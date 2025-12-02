import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AudioSeries } from '@/stores/audioPlayerStore';

export const useAudioSeries = () => {
  return useQuery({
    queryKey: ['audio-series'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audio_series')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as AudioSeries[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAudioSeriesById = (seriesId: string | undefined) => {
  return useQuery({
    queryKey: ['audio-series', seriesId],
    queryFn: async () => {
      if (!seriesId) return null;
      
      const { data, error } = await supabase
        .from('audio_series')
        .select('*')
        .eq('id', seriesId)
        .single();

      if (error) throw error;
      return data as AudioSeries;
    },
    enabled: !!seriesId,
    staleTime: 5 * 60 * 1000,
  });
};
