import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AudioSeries } from '@/stores/audioPlayerStore';

export const useAudioSeries = () => {
  return useQuery({
    queryKey: ['audio-series'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audio_series')
        .select('*, unlock_key')
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
        .select('*, unlock_key')
        .eq('id', seriesId)
        .single();

      if (error) throw error;
      return data as AudioSeries;
    },
    enabled: !!seriesId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAudioSeriesBySlug = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['audio-series', 'slug', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from('audio_series')
        .select('*, unlock_key')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data as AudioSeries;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};
