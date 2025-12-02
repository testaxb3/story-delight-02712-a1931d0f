import { useState } from 'react';
import { MiniPlayer } from './MiniPlayer';
import { FullscreenPlayer } from './FullscreenPlayer';

export function AudioPlayer() {
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  return (
    <>
      <MiniPlayer onExpand={() => setIsFullscreenOpen(true)} />
      <FullscreenPlayer 
        isOpen={isFullscreenOpen} 
        onClose={() => setIsFullscreenOpen(false)} 
      />
    </>
  );
}
