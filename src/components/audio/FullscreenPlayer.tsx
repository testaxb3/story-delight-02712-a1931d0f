import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play, Pause, RotateCcw, RotateCw } from 'lucide-react';
import { useAudioPlayerStore } from '@/stores/audioPlayerStore';
import { useAudioRef } from '@/contexts/AudioPlayerContext';
import { Slider } from '@/components/ui/slider';
import { LyricsDisplay, TranscriptData } from './LyricsDisplay';
import { MarqueeText } from './MarqueeText';

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
  const [showQueue, setShowQueue] = useState(false);
  
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

  const handlePlayPause = () => {
    if (audioRef?.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
    }
    togglePlayPause();
  };

  // Get transcript data from track
  const transcript = (currentTrack as any).transcript_segments as TranscriptData | null;
  const hasLyrics = transcript?.segments?.length > 0;

  const upNextTracks = queue.slice(currentQueueIndex + 1, currentQueueIndex + 4);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black overflow-hidden"
        >
          {/* Blurred artwork background */}
          {currentSeries.cover_image && (
            <img 
              src={currentSeries.cover_image} 
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-3xl scale-125 opacity-30"
            />
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/95" />
          
          {/* Main content container */}
          <div className="relative h-full flex flex-col">
            {/* Header */}
            <header 
              className="flex items-center justify-between px-4 py-3"
              style={{ paddingTop: 'max(0.75rem, calc(env(safe-area-inset-top) + 0.5rem))' }}
            >
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
                aria-label="Close"
              >
                <ChevronDown className="w-5 h-5 text-white" />
              </button>
              
              <p className="text-sm font-medium text-white/60 truncate max-w-[60%]">
                {currentSeries.name}
              </p>
              
              <div className="w-10" /> {/* Spacer for alignment */}
            </header>

            {/* Compact artwork at top */}
            <div className="flex justify-center py-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-24 h-24 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10"
              >
                {currentSeries.cover_image ? (
                  <img 
                    src={currentSeries.cover_image} 
                    alt={currentSeries.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                    <span className="text-4xl">{currentSeries.icon_name || '🎧'}</span>
                  </div>
                )}
              </motion.div>
            </div>

            {/* LYRICS ZONE - always visible, takes up main space */}
            <div className="flex-1 flex items-center justify-center min-h-0 px-4">
              {hasLyrics ? (
                <LyricsDisplay 
                  transcript={transcript} 
                  currentTime={currentTime} 
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-40 h-40 rounded-3xl overflow-hidden shadow-2xl"
                >
                  {currentSeries.cover_image ? (
                    <img 
                      src={currentSeries.cover_image} 
                      alt={currentSeries.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                      <span className="text-6xl">{currentSeries.icon_name || '🎧'}</span>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Track info with marquee title */}
            <div className="text-center px-8 pb-3">
              <MarqueeText 
                text={currentTrack.title} 
                className="text-xl font-bold text-white"
                speed={10}
              />
              <p className="text-sm text-white/50 mt-1">
                Track {currentTrack.track_number}
              </p>
            </div>

            {/* Controls Section */}
            <div 
              className="px-6 pb-4 space-y-4"
              style={{ paddingBottom: 'max(1.5rem, calc(env(safe-area-inset-bottom) + 1rem))' }}
            >
              {/* Progress */}
              <div className="w-full space-y-1">
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleSeek}
                  className="w-full [&_[role=slider]]:bg-white [&_[role=slider]]:border-0 [&_.bg-primary]:bg-white"
                />
                <div className="flex justify-between text-xs text-white/50">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={skipBackward}
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center active:scale-95 transition-transform"
                  aria-label="Rewind 15s"
                >
                  <RotateCcw className="w-5 h-5 text-white" />
                </button>

                <button
                  onClick={handlePlayPause}
                  className="w-16 h-16 rounded-full bg-white flex items-center justify-center active:scale-95 transition-transform shadow-lg"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 text-black fill-current" />
                  ) : (
                    <Play className="w-7 h-7 text-black fill-current ml-1" />
                  )}
                </button>

                <button
                  onClick={skipForward}
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center active:scale-95 transition-transform"
                  aria-label="Forward 15s"
                >
                  <RotateCw className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Speed + Queue row */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleRateChange}
                  className="px-4 py-2 rounded-full bg-white/10 active:scale-95 transition-transform"
                >
                  <span className="text-sm font-medium text-white">
                    {playbackRate}x
                  </span>
                </button>
                
                {upNextTracks.length > 0 && (
                  <button
                    onClick={() => setShowQueue(!showQueue)}
                    className={`px-4 py-2 rounded-full flex items-center gap-2 transition-colors ${
                      showQueue ? 'bg-white/20' : 'bg-white/10'
                    }`}
                  >
                    <span className="text-sm font-medium text-white">
                      Up Next ({upNextTracks.length})
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Queue drawer */}
            <AnimatePresence>
              {showQueue && upNextTracks.length > 0 && (
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="absolute bottom-0 inset-x-0 bg-black/90 backdrop-blur-xl rounded-t-3xl max-h-[50%] overflow-hidden"
                  style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
                >
                  <div className="flex justify-center py-3">
                    <div className="w-10 h-1 rounded-full bg-white/30" />
                  </div>
                  
                  <div className="px-4 pb-4">
                    <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
                      Up Next
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {upNextTracks.map((track) => (
                        <button
                          key={track.id}
                          onClick={() => {
                            play(track, currentSeries, queue);
                            setShowQueue(false);
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
                        >
                          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm">🎧</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {track.title}
                            </p>
                            <p className="text-xs text-white/50">
                              {formatTime(track.duration_seconds)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
