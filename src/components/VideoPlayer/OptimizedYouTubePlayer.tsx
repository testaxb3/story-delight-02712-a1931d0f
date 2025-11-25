import React, { useRef, useState, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player/youtube';
import { useVideoProgressOptimized } from '@/hooks/useVideoProgressOptimized';
import { Loader2, Play } from 'lucide-react';

interface OptimizedYouTubePlayerProps {
  videoUrl: string;
  videoId: string;
  thumbnail?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onPlaybackRateChange?: (rate: number) => void;
  playbackRate?: number;
}

const isDev = import.meta.env.DEV;

export const OptimizedYouTubePlayer: React.FC<OptimizedYouTubePlayerProps> = ({
  videoUrl,
  videoId,
  thumbnail,
  onTimeUpdate,
  playbackRate = 1,
}) => {
  const playerRef = useRef<ReactPlayer>(null);
  
  // Simplified State
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true); // Try autoplay
  const [duration, setDuration] = useState(0);
  const [hasStarted, setHasStarted] = useState(false); // Track if video actually started frames
  
  // Progress Refs
  const lastSavedProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  
  const {
    getProgress,
    updateProgress: updateProgressFn,
  } = useVideoProgressOptimized();

  const videoProgress = getProgress(videoId);
  const updateProgressRef = useRef(updateProgressFn);

  useEffect(() => {
    updateProgressRef.current = updateProgressFn;
  }, [updateProgressFn]);

  // Playback Rate
  useEffect(() => {
    if (playerRef.current && isReady) {
      try {
        const player = playerRef.current.getInternalPlayer();
        if (player && typeof player.setPlaybackRate === 'function') {
          player.setPlaybackRate(playbackRate);
        }
      } catch (e) { /* ignore */ }
    }
  }, [playbackRate, isReady]);

  // Auto-Resume & Ready
  const handleReady = () => {
    setIsReady(true);
    
    // Resume logic
    if (videoProgress && videoProgress.progress_seconds > 5) {
      const timeToSeek = videoProgress.progress_seconds;
      if (duration > 0 && (duration - timeToSeek) < 10) return;
      playerRef.current?.seekTo(timeToSeek, 'seconds');
    }
  };

  // Progress Tracking
  const handleProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    currentProgressRef.current = playedSeconds;
    
    // Detect if video actually started playing (passed 0.5s)
    if (!hasStarted && playedSeconds > 0.2) {
      setHasStarted(true);
    }

    if (onTimeUpdate && duration > 0) onTimeUpdate(playedSeconds, duration);
    
    // Save every 5s
    const progressDiff = Math.abs(playedSeconds - lastSavedProgressRef.current);
    if (progressDiff > 5) {
      saveProgress(playedSeconds);
    }
  };

  const saveProgress = async (seconds: number) => {
    if (!duration) return;
    lastSavedProgressRef.current = seconds;
    await updateProgressRef.current(videoId, Math.floor(seconds), Math.floor(duration));
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Player Config - Hide EVERYTHING
  const playerConfig = {
    youtube: {
      playerVars: {
        rel: 0, modestbranding: 1, controls: 0, disablekb: 1, fs: 0,
        playsinline: 1, autoplay: 1, iv_load_policy: 3, showinfo: 0
      }
    }
  };

  return (
    <div 
      className="relative w-full h-full bg-black overflow-hidden group cursor-pointer"
      onClick={togglePlay}
    >
      {/* 1. The Player (Hidden UI via Zoom) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-full transform scale-[1.35]">
          <ReactPlayer
            ref={playerRef}
            url={videoUrl}
            width="100%"
            height="100%"
            playing={isPlaying}
            controls={false}
            config={playerConfig}
            onReady={handleReady}
            onDuration={setDuration}
            onProgress={handleProgress}
            onEnded={() => saveProgress(duration)}
            style={{ backgroundColor: '#000' }}
          />
        </div>
      </div>

      {/* 2. Solid Black Overlay (Hides YouTube Thumbnail until video starts) */}
      {!hasStarted && (
        <div className="absolute inset-0 z-10 bg-black" />
      )}

      {/* 3. Controls / Status Overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        {!isReady ? (
          // Loading Spinner
          <div className="bg-white/10 backdrop-blur-md rounded-full p-4 shadow-xl">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        ) : !isPlaying ? (
          // Play Button (Paused)
          <div className="bg-white/20 backdrop-blur-md rounded-full p-5 shadow-2xl hover:bg-white/30 transition-all transform hover:scale-110">
            <Play className="w-10 h-10 text-white fill-white ml-1" />
          </div>
        ) : !hasStarted ? (
          // Buffering/Starting (Playing but no frames yet)
          <div className="bg-white/10 backdrop-blur-md rounded-full p-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        ) : null}
      </div>
    </div>
  );
};
