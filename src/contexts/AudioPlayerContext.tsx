import { createContext, useContext, useEffect, useRef, ReactNode, useState } from 'react';
import { useAudioPlayerStore } from '@/stores/audioPlayerStore';
import { useUpdateAudioProgress, useAudioProgress } from '@/hooks/useAudioProgress';
import { toast } from 'sonner';

const AudioPlayerContext = createContext<React.RefObject<HTMLAudioElement> | null>(null);

export function useAudioElement() {
  const ref = useContext(AudioPlayerContext);
  return ref?.current ?? null;
}

export function useAudioRef() {
  return useContext(AudioPlayerContext);
}

interface AudioPlayerProviderProps {
  children: ReactNode;
}

export function AudioPlayerProvider({ children }: AudioPlayerProviderProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const {
    currentTrack,
    isPlaying,
    currentTime,
    playbackRate,
    setTime,
    setDuration,
    pause,
    next,
  } = useAudioPlayerStore();

  const { mutate: updateProgress } = useUpdateAudioProgress();
  const { data: savedProgress } = useAudioProgress(currentTrack?.id);
  const lastSaveTimeRef = useRef(0);
  const hasResumedRef = useRef(false);
  const retryCountRef = useRef(0);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const MAX_RETRIES = 3;

  // Sync store with audio element - lifecycle events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const newTime = audio.currentTime;
      setTime(newTime);
      
      // Auto-save progress every 10 seconds
      if (currentTrack && newTime - lastSaveTimeRef.current >= 10) {
        lastSaveTimeRef.current = newTime;
        const isCompleted = newTime / audio.duration >= 0.95;
        updateProgress({
          trackId: currentTrack.id,
          progressSeconds: Math.floor(newTime),
          completed: isCompleted,
        });
      }
    };

    const handleLoadedMetadata = () => {
      console.log('[AudioPlayer] Metadata loaded, duration:', audio.duration);
      setDuration(audio.duration);
    };

    const handleCanPlayThrough = () => {
      console.log('[AudioPlayer] Can play through - audio ready');
      setIsAudioReady(true);
      retryCountRef.current = 0; // Reset retry count on success
    };

    const handleWaiting = () => {
      console.log('[AudioPlayer] Waiting for data...');
    };

    const handleStalled = () => {
      console.log('[AudioPlayer] Playback stalled');
    };

    const handleError = () => {
      const error = audio.error;
      console.error('[AudioPlayer] Error:', error?.code, error?.message);
      
      // Retry logic
      if (retryCountRef.current < MAX_RETRIES && currentTrack) {
        retryCountRef.current++;
        console.log(`[AudioPlayer] Retrying (${retryCountRef.current}/${MAX_RETRIES})...`);
        
        setTimeout(() => {
          audio.load();
        }, 1000 * retryCountRef.current); // Exponential backoff
      } else {
        toast.error('Failed to load audio. Please try again.');
        pause();
        setIsAudioReady(false);
      }
    };

    const handleEnded = () => {
      console.log('[AudioPlayer] Track ended');
      if (currentTrack) {
        updateProgress({
          trackId: currentTrack.id,
          progressSeconds: Math.floor(audio.duration),
          completed: true,
        });
      }
      pause();
      next();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('stalled', handleStalled);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('stalled', handleStalled);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, setTime, setDuration, pause, next, updateProgress]);

  // Load new track - ONLY when currentTrack changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    console.log('[AudioPlayer] Loading new track:', currentTrack.title);
    console.log('[AudioPlayer] URL:', currentTrack.audio_url);

    // Cancel any pending play promise
    if (playPromiseRef.current) {
      playPromiseRef.current.catch(() => {}).then(() => {
        playPromiseRef.current = null;
      });
    }

    // Pause and reset state before loading new track
    audio.pause();
    setIsAudioReady(false);
    hasResumedRef.current = false;
    retryCountRef.current = 0;

    // Load new track
    audio.src = currentTrack.audio_url;
    audio.load();
  }, [currentTrack]);

  // Control playback - single source of truth
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    // Wait for any pending play promise to resolve before taking action
    const handlePlayback = async () => {
      if (playPromiseRef.current) {
        try {
          await playPromiseRef.current;
        } catch (error) {
          // Ignore AbortError from interrupted playback
        }
        playPromiseRef.current = null;
      }

      if (isPlaying) {
        // Only play if audio is ready
        if (isAudioReady) {
          console.log('[AudioPlayer] Playing');
          playPromiseRef.current = audio.play().catch((error) => {
            console.error('[AudioPlayer] Play failed:', error.name, error.message);
            pause();
          });
        } else {
          console.log('[AudioPlayer] Waiting for audio ready...');
        }
      } else {
        console.log('[AudioPlayer] Pausing');
        audio.pause();
      }
    };

    handlePlayback();
  }, [isPlaying, isAudioReady, pause, currentTrack]);

  // Resume playback from saved progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack || !savedProgress || hasResumedRef.current || !isAudioReady) return;
    
    // Only resume if not completed and has meaningful progress (>5 seconds)
    if (!savedProgress.completed && savedProgress.progress_seconds > 5) {
      console.log('[AudioPlayer] Resuming from:', savedProgress.progress_seconds);
      audio.currentTime = savedProgress.progress_seconds;
      setTime(savedProgress.progress_seconds);
      hasResumedRef.current = true;
    }
  }, [currentTrack, savedProgress, setTime, isAudioReady]);

  // Sync playback rate separately (prevents re-setting audio.src)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.playbackRate = playbackRate;
  }, [playbackRate]);

  // Seek to time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (Math.abs(audio.currentTime - currentTime) > 1) {
      audio.currentTime = currentTime;
    }
  }, [currentTime]);

  return (
    <AudioPlayerContext.Provider value={audioRef}>
      <audio 
        ref={audioRef} 
        playsInline 
        webkit-playsinline="true"
        preload="auto"
        crossOrigin="anonymous"
      />
      {children}
    </AudioPlayerContext.Provider>
  );
}
