import { AudioTrackItem } from './AudioTrackItem';
import type { AudioTrack, AudioSeries } from '@/stores/audioPlayerStore';
import { useAudioPlayerStore } from '@/stores/audioPlayerStore';

interface AudioTrackListProps {
  tracks: AudioTrack[];
  series: AudioSeries;
  hasAccess: boolean;
}

export function AudioTrackList({ tracks, series, hasAccess }: AudioTrackListProps) {
  const { currentTrack, isPlaying, play } = useAudioPlayerStore();

  const handlePlayTrack = (track: AudioTrack) => {
    play(track, series, tracks);
  };

  if (!tracks || tracks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No tracks available in this series yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-foreground px-1 mb-4">
        Episodes
      </h3>
      
      <div className="space-y-2">
        {tracks.map((track, index) => {
          const isLocked = !track.is_preview && !hasAccess;
          
          return (
            <AudioTrackItem
              key={track.id}
              track={track}
              isPlaying={isPlaying && currentTrack?.id === track.id}
              isCurrent={currentTrack?.id === track.id}
              onPlay={() => handlePlayTrack(track)}
              index={index}
              isLocked={isLocked}
            />
          );
        })}
      </div>
    </div>
  );
}
