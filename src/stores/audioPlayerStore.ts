import { create } from 'zustand';

export interface AudioTrack {
  id: string;
  series_id: string;
  title: string;
  description: string | null;
  track_number: number;
  duration_seconds: number;
  audio_url: string;
  thumbnail: string | null;
  is_preview: boolean;
  tags: string[] | null;
}

export interface AudioSeries {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  icon_name: string | null;
  display_order: number;
  total_duration: number;
  track_count: number;
}

interface AudioPlayerState {
  // Current state
  currentTrack: AudioTrack | null;
  currentSeries: AudioSeries | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  queue: AudioTrack[];
  currentQueueIndex: number;
  
  // UI state
  isFullscreen: boolean;
  isMiniPlayerVisible: boolean;
  
  // Actions
  play: (track: AudioTrack, series: AudioSeries, queue?: AudioTrack[]) => void;
  pause: () => void;
  togglePlayPause: () => void;
  setTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setRate: (rate: number) => void;
  skipForward: () => void;
  skipBackward: () => void;
  next: () => void;
  previous: () => void;
  setFullscreen: (fullscreen: boolean) => void;
  setMiniPlayerVisible: (visible: boolean) => void;
  reset: () => void;
}

export const useAudioPlayerStore = create<AudioPlayerState>((set, get) => ({
  currentTrack: null,
  currentSeries: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  playbackRate: 1,
  queue: [],
  currentQueueIndex: 0,
  isFullscreen: false,
  isMiniPlayerVisible: false,

  play: (track, series, queue) => {
    const newQueue = queue || [track];
    const queueIndex = newQueue.findIndex(t => t.id === track.id);
    
    set({
      currentTrack: track,
      currentSeries: series,
      isPlaying: true,
      queue: newQueue,
      currentQueueIndex: queueIndex,
      isMiniPlayerVisible: true,
    });
  },

  pause: () => set({ isPlaying: false }),

  togglePlayPause: () => set(state => ({ isPlaying: !state.isPlaying })),

  setTime: (time) => set({ currentTime: time }),

  setDuration: (duration) => set({ duration }),

  setRate: (rate) => set({ playbackRate: rate }),

  skipForward: () => {
    const { currentTime, duration } = get();
    const newTime = Math.min(currentTime + 15, duration);
    set({ currentTime: newTime });
  },

  skipBackward: () => {
    const { currentTime } = get();
    const newTime = Math.max(currentTime - 15, 0);
    set({ currentTime: newTime });
  },

  next: () => {
    const { queue, currentQueueIndex, currentSeries } = get();
    if (currentQueueIndex < queue.length - 1) {
      const nextTrack = queue[currentQueueIndex + 1];
      set({
        currentTrack: nextTrack,
        currentQueueIndex: currentQueueIndex + 1,
        currentTime: 0,
        isPlaying: true,
      });
    }
  },

  previous: () => {
    const { queue, currentQueueIndex, currentTime } = get();
    
    // If more than 3 seconds played, restart current track
    if (currentTime > 3) {
      set({ currentTime: 0 });
      return;
    }
    
    // Otherwise go to previous track
    if (currentQueueIndex > 0) {
      const prevTrack = queue[currentQueueIndex - 1];
      set({
        currentTrack: prevTrack,
        currentQueueIndex: currentQueueIndex - 1,
        currentTime: 0,
        isPlaying: true,
      });
    }
  },

  setFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),

  setMiniPlayerVisible: (visible) => set({ isMiniPlayerVisible: visible }),

  reset: () => set({
    currentTrack: null,
    currentSeries: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1,
    queue: [],
    currentQueueIndex: 0,
    isFullscreen: false,
    isMiniPlayerVisible: false,
  }),
}));
