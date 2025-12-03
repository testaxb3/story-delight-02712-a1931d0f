import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Play, Clock, FileText, Loader2, Check } from 'lucide-react';
import { useAudioTracksAdmin } from '@/hooks/useAdminAudio';
import type { Database } from '@/integrations/supabase/types';
import { formatTime } from '@/lib/formatters';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type AudioTrack = Database['public']['Tables']['audio_tracks']['Row'];

interface AudioTrackRowProps {
  track: AudioTrack;
  onEdit: (track: AudioTrack) => void;
}

export function AudioTrackRow({ track, onEdit }: AudioTrackRowProps) {
  const { deleteTrack } = useAudioTracksAdmin();
  const [isTranscribing, setIsTranscribing] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Delete this track?')) return;
    deleteTrack.mutate(track.id);
  };

  const handleTranscribe = async () => {
    setIsTranscribing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast.error('Please sign in again');
        return;
      }

      const response = await fetch(
        `https://iogceaotdodvugrmogpp.supabase.co/functions/v1/transcribe-audio`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ track_id: track.id }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to transcribe');
      }

      toast.success(`Transcript generated with ${result.segments_count} segments`);
      // Invalidate queries to refresh the data
      window.location.reload();
    } catch (error) {
      console.error('Transcription error:', error);
      toast.error(error instanceof Error ? error.message : 'Transcription failed');
    } finally {
      setIsTranscribing(false);
    }
  };

  const hasTranscript = !!(track as any).transcript_segments?.segments?.length;

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
      {/* Track Number */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
        {track.track_number}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-sm line-clamp-1">{track.title}</h4>
          {track.is_preview && (
            <span className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
              Preview
            </span>
          )}
          {hasTranscript && (
            <span className="text-xs bg-blue-500/10 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full flex items-center gap-1">
              <FileText className="w-3 h-3" />
              Lyrics
            </span>
          )}
        </div>
        {track.description && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {track.description}
          </p>
        )}
      </div>

      {/* Duration */}
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        {formatTime(track.duration_seconds)}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleTranscribe}
          disabled={isTranscribing}
          title={hasTranscript ? 'Regenerate transcript' : 'Generate transcript'}
          className={hasTranscript ? 'text-blue-600' : ''}
        >
          {isTranscribing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : hasTranscript ? (
            <Check className="w-4 h-4" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(track.audio_url, '_blank')}
          title="Play preview"
        >
          <Play className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(track)}
        >
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={deleteTrack.isPending}
        >
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
