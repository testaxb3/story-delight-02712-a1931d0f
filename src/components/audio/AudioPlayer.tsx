import { MiniPlayer } from './MiniPlayer';
import { FullscreenPlayer } from './FullscreenPlayer';
import { useAudioPlayerStore } from '@/stores/audioPlayerStore';

export function AudioPlayer() {
  const { isFullscreen, setFullscreen } = useAudioPlayerStore();

  return (
    <>
      <MiniPlayer onExpand={() => setFullscreen(true)} />
      <FullscreenPlayer
        isOpen={isFullscreen}
        onClose={() => setFullscreen(false)}
      />
    </>
  );
}
