import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, SkipBack, SkipForward, RotateCcw, RotateCw, Music2, ListMusic } from 'lucide-react';
import { useAudioPlayerStore } from '@/stores/audioPlayerStore';
import { useAudioRef } from '@/contexts/AudioPlayerContext';
import { Slider } from '@/components/ui/slider';
import { SyncedLyrics, TranscriptData } from './SyncedLyrics';

interface FullscreenPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function FullscreenPlayer({ isOpen, onClose }: FullscreenPlayerProps) {
  const audioRef = useAudioRef();
  const [showLyrics, setShowLyrics] = useState(false);
  
  const {
    currentTrack,
    currentSeries,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    queue,
    currentQueueIndex,
    togglePlayPause,
    skipForward,
    skipBackward,
    setRate,
    setTime,
    play,
  } = useAudioPlayerStore();

  if (!currentTrack || !currentSeries) return null;

  const rates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const currentRateIndex = rates.indexOf(playbackRate);

  const handleRateChange = () => {
    const nextIndex = (currentRateIndex + 1) % rates.length;
    setRate(rates[nextIndex]);
  };

  const handleSeek = (value: number[]) => {
    setTime(value[0]);
  };

  // Get transcript data from track
  const transcript = (currentTrack as any).transcript_segments as TranscriptData | null;
  const hasLyrics = transcript?.segments?.length > 0;

  // Immersive lyrics mode - minimal UI
  if (showLyrics) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black"
          >
            {/* Lyrics take full screen */}
            <SyncedLyrics
              transcript={transcript}
              currentTime={currentTime}
              artwork={currentSeries.cover_image || undefined}
            />
            
            {/* Minimal overlay controls */}
            <div className="absolute inset-x-0 top-0 z-10" style={{ paddingTop: 'max(1rem, calc(env(safe-area-inset-top) + 0.5rem))' }}>
              <div className="flex items-center justify-between px-4">
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => setShowLyrics(false)}
                  className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm"
                >
                  <span className="text-white text-sm font-medium">Track Info</span>
                </button>
              </div>
            </div>
            
            {/* Bottom controls - minimal */}
            <div 
              className="absolute inset-x-0 bottom-0 z-10 px-6 pb-4"
              style={{ paddingBottom: 'max(1.5rem, calc(env(safe-area-inset-bottom) + 1rem))' }}
            >
              {/* Progress bar - thin and minimal */}
              <div className="mb-4">
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleSeek}
                  className="w-full [&_[role=slider]]:bg-white [&_[role=slider]]:border-0 [&_.bg-primary]:bg-white"
                />
                <div className="flex justify-between text-xs text-white/60 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
              
              {/* Single play button centered */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    if (audioRef?.current) {
                      if (isPlaying) {
                        audioRef.current.pause();
                      } else {
                        audioRef.current.play().catch(console.error);
                      }
                    }
                    togglePlayPause();
                  }}
                  className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 text-white fill-current" />
                  ) : (
                    <Play className="w-7 h-7 text-white fill-current ml-1" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Normal player mode
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-background"
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ paddingTop: 'max(1rem, calc(env(safe-area-inset-top) + 1rem))' }}>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
              <p className="text-sm font-medium text-muted-foreground">Now Playing</p>
              <div className="w-10" />
            </div>

            {/* Track Info */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 space-y-8">
              {/* Artwork */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-64 h-64 rounded-3xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shadow-2xl overflow-hidden"
              >
                {currentSeries.cover_image ? (
                  <img 
                    src={currentSeries.cover_image} 
                    alt={currentSeries.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-8xl">{currentSeries.icon_name || '🎧'}</span>
                )}
              </motion.div>

              {/* Track info */}
              <div className="text-center space-y-2 w-full">
                <h2 className="text-2xl font-bold text-foreground">
                  {currentTrack.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {currentSeries.name}
                </p>
              </div>
            </div>

            {/* Controls Section */}
            <div className="px-6 pb-4 space-y-6">
              {/* Progress */}
              <div className="w-full space-y-2">
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleSeek}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={skipBackward}
                  className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                  aria-label="Skip backward 15s"
                >
                  <RotateCcw className="w-5 h-5 text-foreground" />
                </button>

                <button
                  onClick={() => {
                    if (audioRef?.current) {
                      if (isPlaying) {
                        audioRef.current.pause();
                      } else {
                        audioRef.current.play().catch(console.error);
                      }
                    }
                    togglePlayPause();
                  }}
                  className="w-16 h-16 rounded-full bg-primary flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 text-primary-foreground fill-current" />
                  ) : (
                    <Play className="w-7 h-7 text-primary-foreground fill-current ml-1" />
                  )}
                </button>

                <button
                  onClick={skipForward}
                  className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                  aria-label="Skip forward 15s"
                >
                  <RotateCw className="w-5 h-5 text-foreground" />
                </button>
              </div>

              {/* Speed + Lyrics Toggle */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleRateChange}
                  className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">
                    {playbackRate}x
                  </span>
                </button>
                
                {/* Lyrics Toggle */}
                <button
                  onClick={() => setShowLyrics(true)}
                  className={`px-4 py-2 rounded-full flex items-center gap-2 transition-colors ${
                    hasLyrics 
                      ? 'bg-muted hover:bg-muted/80 text-foreground'
                      : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
                  }`}
                  disabled={!hasLyrics}
                  aria-label="Show lyrics"
                >
                  <Music2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Lyrics</span>
                </button>
              </div>
            </div>

            {/* Queue preview */}
            <div className="px-6 pb-8 space-y-3" style={{ paddingBottom: 'max(2rem, calc(env(safe-area-inset-bottom) + 2rem))' }}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Up Next
              </p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {queue.slice(currentQueueIndex + 1, currentQueueIndex + 4).map((track) => (
                  <button
                    key={track.id}
                    onClick={() => play(track, currentSeries, queue)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">🎧</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {track.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(track.duration_seconds)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
