import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useAudioPlayerStore } from '@/stores/audioPlayerStore';
import { useAudioRef } from '@/contexts/AudioPlayerContext';

interface MiniPlayerProps {
  onExpand: () => void;
}

export function MiniPlayer({ onExpand }: MiniPlayerProps) {
  const audioRef = useAudioRef();
  const {
    currentTrack,
    currentSeries,
    isPlaying,
    currentTime,
    duration,
    isMiniPlayerVisible,
    togglePlayPause,
    next,
    previous,
  } = useAudioPlayerStore();

  if (!isMiniPlayerVisible || !currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed left-4 right-4 z-[90] pointer-events-auto"
        style={{ bottom: `calc(env(safe-area-inset-bottom, 0px) + 5rem)` }}
      >
        <div 
          onClick={onExpand}
          className="bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border overflow-hidden cursor-pointer"
        >
          {/* Progress bar */}
          <div className="h-1 bg-muted relative">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Player content */}
          <div className="px-4 py-3 flex items-center gap-3">
            {/* Artwork */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">{currentSeries?.icon_name || '🎧'}</span>
            </div>

            {/* Track info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {currentTrack.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentSeries?.name}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  previous();
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="Previous track"
              >
                <SkipBack className="w-4 h-4 text-foreground" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // iOS: Call play/pause DIRECTLY for user gesture compliance
                  if (audioRef?.current) {
                    if (isPlaying) {
                      audioRef.current.pause();
                    } else {
                      audioRef.current.play().catch(console.error);
                    }
                  }
                  // Sync store
                  togglePlayPause();
                }}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-primary-foreground fill-current" />
                ) : (
                  <Play className="w-5 h-5 text-primary-foreground fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="Next track"
              >
                <SkipForward className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
