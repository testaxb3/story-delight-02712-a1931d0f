import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, X, ChevronLeft, ChevronRight } from 'lucide-react';
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
    isMiniPlayerMinimized,
    togglePlayPause,
    next,
    previous,
    setMiniPlayerVisible,
    setMiniPlayerMinimized,
    pause,
  } = useAudioPlayerStore();

  if (!isMiniPlayerVisible || !currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleDragEnd = (_: any, info: PanInfo) => {
    // If dragged more than 100px to the right, minimize
    if (info.offset.x > 100) {
      setMiniPlayerMinimized(true);
    }
    // Framer Motion handles the animation automatically via animate prop
  };

  const handleExpandFromMinimized = () => {
    setMiniPlayerMinimized(false);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Pause audio and hide mini player
    if (audioRef?.current) {
      audioRef.current.pause();
    }
    pause();
    setMiniPlayerVisible(false);
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMiniPlayerMinimized(true);
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef?.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
    }
    togglePlayPause();
  };

  // Minimized state - just a small pill on the edge
  if (isMiniPlayerMinimized) {
    return (
      <motion.div
        initial={{ x: 'calc(100% - 56px)', opacity: 1 }}
        animate={{ x: 'calc(100% - 56px)', opacity: 1 }}
        className="fixed right-0 z-[90]"
        style={{ bottom: `calc(env(safe-area-inset-bottom, 0px) + 5rem)` }}
      >
        <motion.button
          onClick={handleExpandFromMinimized}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-primary/90 backdrop-blur-xl rounded-l-2xl pl-3 pr-4 py-3 shadow-2xl"
        >
          <ChevronLeft className="w-4 h-4 text-primary-foreground" />
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            {currentSeries?.cover_image ? (
              <img 
                src={currentSeries.cover_image} 
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-white/20 flex items-center justify-center">
                <span className="text-sm">🎧</span>
              </div>
            )}
          </div>
          {isPlaying && (
            <div className="flex items-end gap-0.5 h-4">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-primary-foreground rounded-full"
                  animate={{
                    height: ['40%', '100%', '60%', '80%', '40%'],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
          )}
        </motion.button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          x: isMiniPlayerMinimized ? 'calc(100% - 56px)' : 0, 
          y: 0, 
          opacity: 1 
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        drag="x"
        dragConstraints={{ left: 0, right: 200 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="fixed left-0 right-0 z-[90] px-2"
        style={{ bottom: `calc(env(safe-area-inset-bottom, 0px) + 4.5rem)` }}
      >
        {/* Glassmorphism container */}
        <div
          onClick={onExpand}
          className="bg-card/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50 overflow-hidden cursor-pointer relative"
        >
          {/* Minimize button - iOS style */}
          <button
            onClick={handleMinimize}
            className="absolute top-1 left-1 z-10 w-6 h-6 rounded-full bg-muted/80 flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Minimize player"
          >
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-1 right-1 z-10 w-6 h-6 rounded-full bg-muted/80 flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Close player"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          {/* Progress bar - thin line at top */}
          <div className="h-[2px] bg-muted/30 relative">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Player content - compact */}
          <div className="px-3 py-2.5 flex items-center gap-3 pr-10 pl-10">
            {/* Artwork - smaller */}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {currentSeries?.cover_image ? (
                <img 
                  src={currentSeries.cover_image} 
                  alt={currentSeries.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg">{currentSeries?.icon_name || '🎧'}</span>
              )}
            </div>

            {/* Track info - compact */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate leading-tight">
                {currentTrack.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentSeries?.name}
              </p>
            </div>

            {/* Controls - inline */}
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  previous();
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted/50 transition-colors"
                aria-label="Previous track"
              >
                <SkipBack className="w-4 h-4 text-foreground" />
              </button>

              <button
                onClick={handlePlayPause}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-primary-foreground fill-current" />
                ) : (
                  <Play className="w-4 h-4 text-primary-foreground fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted/50 transition-colors"
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
