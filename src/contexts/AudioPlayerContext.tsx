import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { useAudioPlayerStore } from '@/stores/audioPlayerStore';
import { useUpdateAudioProgress } from '@/hooks/useAudioProgress';

const AudioPlayerContext = createContext<HTMLAudioElement | null>(null);

export function useAudioElement() {
  return useContext(AudioPlayerContext);
}

interface AudioPlayerProviderProps {
  children: ReactNode;
}

export function AudioPlayerProvider({ children }: AudioPlayerProviderProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
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
  const lastSaveTimeRef = useRef(0);

  // Sync store with audio element
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
      setDuration(audio.duration);
    };

    const handleEnded = () => {
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
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, setTime, setDuration, pause, next, updateProgress]);

  // Control playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => pause());
    } else {
      audio.pause();
    }
  }, [isPlaying, pause]);

  // Load new track
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.src = currentTrack.audio_url;
    audio.playbackRate = playbackRate;
    
    if (isPlaying) {
      audio.play().catch(() => pause());
    }
  }, [currentTrack, playbackRate, isPlaying, pause]);

  // Seek to time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (Math.abs(audio.currentTime - currentTime) > 1) {
      audio.currentTime = currentTime;
    }
  }, [currentTime]);

  return (
    <AudioPlayerContext.Provider value={audioRef.current}>
      <audio ref={audioRef} />
      {children}
    </AudioPlayerContext.Provider>
  );
}
