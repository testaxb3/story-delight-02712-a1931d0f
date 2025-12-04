import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play, Pause, RotateCcw, RotateCw, Gauge, ListMusic } from 'lucide-react';
import { useAudioPlayerStore } from '@/stores/audioPlayerStore';
import { useAudioRef } from '@/contexts/AudioPlayerContext';
import { Slider } from '@/components/ui/slider';
import { TeleprompterLyrics, TranscriptData } from './TeleprompterLyrics';

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
          className="fixed inset-0 z-[200] overflow-hidden"
        >
          {/* Immersive ambient background */}
          <div className="absolute inset-0 bg-black">
            {currentSeries.cover_image && (
              <>
                {/* Cover image with heavy blur for ambient color */}
                <img 
                  src={currentSeries.cover_image} 
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ 
                    filter: 'blur(80px) saturate(1.4) brightness(0.6)',
                    transform: 'scale(1.5)',
                  }}
                />
              </>
            )}
            {/* Dark gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
          </div>
          
          {/* Main content container */}
          <div className="relative h-full flex flex-col">
            {/* Minimalist Header */}
            <header 
              className="flex items-center justify-between px-4 py-3 relative z-20"
              style={{ paddingTop: 'max(0.75rem, calc(env(safe-area-inset-top) + 0.5rem))' }}
            >
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform"
                aria-label="Close"
              >
                <ChevronDown className="w-6 h-6 text-white" />
              </button>
              
              {/* Series name - small and discrete */}
              <p 
                className="text-xs font-medium text-white/50 uppercase tracking-wider truncate max-w-[50%]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                {currentSeries.name}
              </p>
              
              <div className="w-10" /> {/* Spacer for alignment */}
            </header>

            {/* Compact artwork + track info at top */}
            <div className="flex items-center gap-4 px-6 py-3 relative z-20">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-14 h-14 rounded-xl shadow-2xl overflow-hidden ring-1 ring-white/20 flex-shrink-0"
              >
                {currentSeries.cover_image ? (
                  <img 
                    src={currentSeries.cover_image} 
                    alt={currentSeries.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                    <span className="text-2xl">{currentSeries.icon_name || '🎧'}</span>
                  </div>
                )}
              </motion.div>
              <div className="min-w-0 flex-1">
                <p 
                  className="text-sm font-medium text-white/60"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  Track {currentTrack.track_number}
                </p>
                <p 
                  className="text-base font-semibold text-white truncate"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                >
                  {currentTrack.title}
                </p>
              </div>
            </div>

            {/* TELEPROMPTER LYRICS ZONE - takes up main space */}
            <div className="flex-1 min-h-0 relative z-10">
              {hasLyrics ? (
                <TeleprompterLyrics 
                  transcript={transcript} 
                  currentTime={currentTime} 
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-48 h-48 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10"
                  >
                    {currentSeries.cover_image ? (
                      <img 
                        src={currentSeries.cover_image} 
                        alt={currentSeries.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                        <span className="text-7xl">{currentSeries.icon_name || '🎧'}</span>
                      </div>
                    )}
                  </motion.div>
                </div>
              )}
            </div>

            {/* Controls Section */}
            <div 
              className="px-6 pb-4 space-y-3 relative z-20"
              style={{ paddingBottom: 'max(1.5rem, calc(env(safe-area-inset-bottom) + 1rem))' }}
            >
              {/* Progress - thin and elegant */}
              <div className="w-full space-y-1">
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleSeek}
                  className="w-full [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:bg-white [&_[role=slider]]:border-0 [&_.bg-primary]:bg-white/90"
                />
                <div className="flex justify-between text-[11px] text-white/40 font-medium tabular-nums">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Playback Controls - centered and clean */}
              <div className="flex items-center justify-center gap-8">
                <button
                  onClick={skipBackward}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform"
                  aria-label="Rewind 15s"
                >
                  <RotateCcw className="w-5 h-5 text-white" />
                </button>

                <button
                  onClick={handlePlayPause}
                  className="w-18 h-18 w-[72px] h-[72px] rounded-full bg-white flex items-center justify-center active:scale-95 transition-transform shadow-xl"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-black fill-current" />
                  ) : (
                    <Play className="w-8 h-8 text-black fill-current ml-1" />
                  )}
                </button>

                <button
                  onClick={skipForward}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform"
                  aria-label="Forward 15s"
                >
                  <RotateCw className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Secondary controls - icons only */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleRateChange}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 active:scale-95 transition-transform"
                >
                  <Gauge className="w-4 h-4 text-white/70" />
                  <span className="text-xs font-medium text-white/70">
                    {playbackRate}x
                  </span>
                </button>
                
                {upNextTracks.length > 0 && (
                  <button
                    onClick={() => setShowQueue(!showQueue)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors active:scale-95 ${
                      showQueue ? 'bg-white/20' : 'bg-white/10'
                    }`}
                  >
                    <ListMusic className="w-4 h-4 text-white/70" />
                    <span className="text-xs font-medium text-white/70">
                      {upNextTracks.length}
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
                  className="absolute bottom-0 inset-x-0 bg-black/95 backdrop-blur-xl rounded-t-3xl max-h-[50%] overflow-hidden"
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
                          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {currentSeries.cover_image ? (
                              <img 
                                src={currentSeries.cover_image} 
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-sm">🎧</span>
                            )}
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
