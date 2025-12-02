import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AudioProgress {
  id: string;
  user_id: string;
  track_id: string;
  progress_seconds: number;
  completed: boolean;
  last_played_at: string;
}

export const useAudioProgress = (trackId: string | undefined) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['audio-progress', trackId, user?.id],
    queryFn: async () => {
      if (!trackId || !user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_audio_progress')
        .select('*')
        .eq('track_id', trackId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as AudioProgress | null;
    },
    enabled: !!trackId && !!user?.id,
  });
};

export const useUpdateAudioProgress = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      trackId,
      progressSeconds,
      completed,
    }: {
      trackId: string;
      progressSeconds: number;
      completed?: boolean;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_audio_progress')
        .upsert({
          user_id: user.id,
          track_id: trackId,
          progress_seconds: progressSeconds,
          completed: completed ?? false,
          last_played_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,track_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['audio-progress', variables.trackId],
      });
    },
  });
};
