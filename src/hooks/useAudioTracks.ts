import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AudioTrack } from '@/stores/audioPlayerStore';

export const useAudioTracks = (seriesId: string | undefined) => {
  return useQuery({
    queryKey: ['audio-tracks', seriesId],
    queryFn: async () => {
      if (!seriesId) return [];
      
      const { data, error } = await supabase
        .from('audio_tracks')
        .select('*')
        .eq('series_id', seriesId)
        .order('track_number', { ascending: true });

      if (error) throw error;
      return data as AudioTrack[];
    },
    enabled: !!seriesId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
