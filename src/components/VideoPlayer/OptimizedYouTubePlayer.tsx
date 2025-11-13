import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import ReactPlayer from 'react-player/youtube';
import { useVideoProgress } from '@/hooks/useVideoProgress';
import { Loader2 } from 'lucide-react';
import { createPortal } from 'react-dom';

interface OptimizedYouTubePlayerProps {
  videoUrl: string;
  videoId: string;
  thumbnail?: string; // Optional custom thumbnail URL
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onPlaybackRateChange?: (rate: number) => void;
  playbackRate?: number; // Playback speed
  showFullscreenHint?: boolean; // Show fullscreen hint message (default: true)
}

// Helper to detect if device is mobile
const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Helper to detect iOS devices
const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

// Helper to detect Android devices
const isAndroid = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android/i.test(navigator.userAgent);
};

// Helper to detect if running as PWA
const isPWA = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true ||
         document.referrer.includes('android-app://');
};

// Check if running in development mode
const isDev = import.meta.env.DEV;

export const OptimizedYouTubePlayer: React.FC<OptimizedYouTubePlayerProps> = ({
  videoUrl,
  videoId,
  thumbnail,
  onTimeUpdate,
  onPlaybackRateChange,
  playbackRate = 1,
  showFullscreenHint = true
}) => {
  // Use custom controls for ALL devices - clean player everywhere
  const [useCustomControls] = useState(true);

  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true); // Start as buffering
  const lastSavedProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const errorCountRef = useRef<number>(0);
  const bufferTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isBufferingRef = useRef<boolean>(false);
  const lastClickTime = useRef<number>(0);
  const wasPlayingBeforeFullscreen = useRef<boolean>(false);

  // Hook existente para progresso
  const {
    getProgress,
    updateProgress,
    loading: isLoadingProgress
  } = useVideoProgress();

  const videoProgress = getProgress(videoId);

  // Reset state when videoId changes
  useEffect(() => {
    // Pause player before switching videos to prevent branding flash
    if (playerRef.current) {
      try {
        playerRef.current.pauseVideo();
      } catch (error) {
        console.error('[OptimizedYouTubePlayer] Error pausing video on switch:', error);
      }
    }

    setIsReady(false);
    setHasError(false);
    setDuration(0);
    setIsBuffering(true); // Reset to buffering state
    setIsPlaying(false); // Reset playing state
    lastSavedProgressRef.current = 0;
    currentProgressRef.current = 0;
    errorCountRef.current = 0;
    isBufferingRef.current = false;

    if (bufferTimeoutRef.current) {
      clearTimeout(bufferTimeoutRef.current);
      bufferTimeoutRef.current = null;
    }
  }, [videoId]);

  // Apply playback rate when it changes
  useEffect(() => {
    if (playerRef.current && isReady) {
      try {
        const player = playerRef.current.getInternalPlayer();
        if (player && typeof player.setPlaybackRate === 'function') {
          player.setPlaybackRate(playbackRate);
        }
      } catch (error) {
        if (isDev) console.error('[VideoPlayer] Playback rate error:', error);
      }
    }
  }, [playbackRate, isReady]);

  // Save progress function
  const saveProgress = useCallback(async (progressSeconds: number, forceUpdate = false) => {
    if (!duration || duration === 0) return;

    // Only save if progress has changed by at least 3 seconds or force update
    const progressDiff = Math.abs(progressSeconds - lastSavedProgressRef.current);
    if (!forceUpdate && progressDiff < 3) return;

    lastSavedProgressRef.current = progressSeconds;
    await updateProgress(videoId, Math.floor(progressSeconds), Math.floor(duration));
  }, [videoId, duration, updateProgress]);

  // Quando o player estiver pronto, busca o tempo salvo
  const handleReady = () => {
    setIsReady(true);
    errorCountRef.current = 0;

    // Hide loading overlay after a delay to let YouTube UI disappear
    setTimeout(() => {
      setIsBuffering(false);
    }, 500);

    // Seek to saved position if progress > 10 seconds
    const skipSeek = errorCountRef.current > 2;

    if (!skipSeek && playerRef.current && videoProgress && videoProgress.progress_seconds > 10) {
      // Optimized delays: 300ms mobile, 200ms desktop
      const seekDelay = isMobileDevice() ? 300 : 200;

      setTimeout(() => {
        try {
          if (playerRef.current) {
            const player = playerRef.current.getInternalPlayer();
            if (player && typeof player.seekTo === 'function') {
              playerRef.current.seekTo(videoProgress.progress_seconds, 'seconds');
            }
          }
        } catch (error) {
          if (isDev) console.error('[VideoPlayer] Seek error:', error);
          errorCountRef.current++;
        }
      }, seekDelay);
    }
  };

  // Captura duração total do vídeo
  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  // Salva o progresso no Supabase periodically
  const handleProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    currentProgressRef.current = playedSeconds;

    // Call onTimeUpdate callback for external progress display
    if (onTimeUpdate && duration > 0) {
      onTimeUpdate(playedSeconds, duration);
    }

    if (isReady && !isLoadingProgress && duration > 0) {
      saveProgress(playedSeconds, false);
    }
  };

  // Save progress when pausing
  const handlePause = () => {
    setIsPlaying(false);
    saveProgress(currentProgressRef.current, true);
  };

  // Handle play
  const handlePlay = () => {
    setIsPlaying(true);
    setIsBuffering(false); // Hide loading when playing
  };

  // Handle video end
  const handleEnded = () => {
    setIsPlaying(false);
    saveProgress(duration, true); // Mark as 100% complete
  };

  // Toggle fullscreen - ONLY allowed when video is paused
  const toggleFullscreen = async () => {
    // Block fullscreen toggle if video is playing (both entering AND exiting)
    if (isPlaying) {
      // Don't allow entering OR exiting fullscreen while playing
      return;
    }

    // All devices - use CSS-based fullscreen (works perfectly)
    if (useCustomControls) {
      setIsFullscreen(!isFullscreen);
      return;
    }

    // Desktop - use standard fullscreen API (not used since useCustomControls = true for all)
    if (!containerRef.current) return;

    const elem = containerRef.current as any;

    if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
      // Not in fullscreen - enter fullscreen
      try {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else {
          // Fallback: CSS fullscreen
          setIsFullscreen(true);
        }
      } catch (err) {
        if (isDev) console.error('[VideoPlayer] Fullscreen error:', err);
        // Fallback: CSS fullscreen
        setIsFullscreen(true);
      }
    } else {
      // Already in fullscreen - exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  };

  // Listen for fullscreen changes and escape key
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        !!(document.fullscreenElement || (document as any).webkitFullscreenElement)
      );
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    // Listen to both standard and webkit fullscreen events
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isFullscreen]);

  // Add CSS to hide YouTube UI elements - ONLY on mobile
  useEffect(() => {
    // Only apply CSS hiding on mobile with custom controls
    if (!useCustomControls) return;

    // Inject global CSS to hide YouTube UI elements
    const styleId = 'youtube-player-hide-ui';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        /* Hide YouTube branding and controls completely */
        .ytp-chrome-top,
        .ytp-chrome-bottom,
        .ytp-gradient-top,
        .ytp-gradient-bottom,
        .ytp-title,
        .ytp-title-text,
        .ytp-watermark,
        .ytp-pause-overlay,
        .ytp-scroll-min,
        .ytp-show-cards-title,
        .ytp-cards-teaser,
        .ytp-endscreen,
        .ytp-ce-element,
        .ytp-impression-link {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }

        /* Force black background instead of thumbnail - ALL variants */
        .ytp-cued-thumbnail-overlay,
        .ytp-cued-thumbnail-overlay-image,
        .ytp-thumbnail-overlay,
        .ytp-large-play-button,
        .ytp-show-tiles,
        .ytp-videwall-still {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }

        /* Hide any text overlays */
        .ytp-title-channel,
        .ytp-title-link {
          display: none !important;
        }

        /* Ensure video element is always visible */
        .html5-video-container,
        .html5-main-video {
          display: block !important;
          opacity: 1 !important;
          visibility: visible !important;
        }
      `;
      document.head.appendChild(style);
    }

    if (!containerRef.current) return;

    // Add inline style to iframe to ensure YouTube UI is hidden
    const iframe = containerRef.current.querySelector('iframe');
    if (iframe) {
      // Force hide any YouTube overlays via CSS
      iframe.style.setProperty('pointer-events', 'none', 'important');

      // Re-enable pointer events on our overlay
      const overlay = containerRef.current.querySelector('[data-player-overlay]');
      if (overlay) {
        (overlay as HTMLElement).style.setProperty('pointer-events', 'auto', 'important');
      }
    }
  }, [isReady, isFullscreen, useCustomControls, videoId]);

  // Resume playback after Portal change and fullscreen transitions
  useEffect(() => {
    // When entering fullscreen, if video was playing, resume playback
    if (isFullscreen && wasPlayingBeforeFullscreen.current && playerRef.current) {
      // Delay to let Portal render and state stabilize
      const timer = setTimeout(() => {
        const player = playerRef.current?.getInternalPlayer();
        if (player && typeof player.playVideo === 'function') {
          player.playVideo();
          // Force state update
          setIsPlaying(true);
        }
      }, 100); // Increased delay for smoother transition
      return () => clearTimeout(timer);
    }
  }, [isFullscreen]);

  // Handle click with double-click detection
  const handleVideoClick = () => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime.current;
    lastClickTime.current = now;

    // Double-click (less than 300ms between clicks)
    if (timeSinceLastClick < 300) {
      toggleFullscreen();
    } else {
      // Single click - toggle play/pause
      if (playerRef.current) {
        const player = playerRef.current.getInternalPlayer();
        if (player) {
          if (isPlaying) {
            player.pauseVideo();
            setIsPlaying(false); // Update state immediately
          } else {
            player.playVideo();
            setIsPlaying(true); // Update state immediately
          }
        }
      }
    }
  };

  // Save progress when component unmounts (user closes modal)
  useEffect(() => {
    return () => {
      if (currentProgressRef.current > 0 && duration > 0) {
        updateProgress(videoId, Math.floor(currentProgressRef.current), Math.floor(duration));
      }
    };
  }, [videoId, duration, updateProgress]);

  // Handle player errors
  const handleError = (error: any) => {
    // Ignore browser extension and postMessage errors
    if (error?.message && (
      error.message.includes('browser is not defined') ||
      error.message.includes('chrome.runtime') ||
      error.message.includes('message port closed') ||
      error.message.includes('postMessage') ||
      error.message.includes('target origin')
    )) {
      return;
    }

    if (isDev) console.error('[VideoPlayer] Error:', error);
    errorCountRef.current++;

    // Try to recover (max 2 attempts)
    if (playerRef.current && errorCountRef.current <= 2) {
      setIsReady(false);
      setTimeout(() => {
        setIsReady(true);
        setHasError(false);
      }, 1500);
    } else {
      setHasError(true);
    }
  };

  // Handle buffer start (loading)
  const handleBuffer = () => {
    isBufferingRef.current = true;
    setIsBuffering(true); // Show loading overlay

    // On mobile, force play after 2 seconds if still buffering
    if (isMobileDevice()) {
      if (bufferTimeoutRef.current) {
        clearTimeout(bufferTimeoutRef.current);
      }

      bufferTimeoutRef.current = setTimeout(() => {
        if (isBufferingRef.current && playerRef.current) {
          try {
            const player = playerRef.current.getInternalPlayer();
            if (player && typeof player.playVideo === 'function') {
              player.playVideo();
            }
          } catch (error) {
            if (isDev) console.error('[VideoPlayer] Buffer recovery error:', error);
          }
        }
      }, 2000); // 2 seconds - optimized for speed
    }
  };

  const handleBufferEnd = () => {
    isBufferingRef.current = false;
    setIsBuffering(false); // Hide loading overlay

    if (bufferTimeoutRef.current) {
      clearTimeout(bufferTimeoutRef.current);
      bufferTimeoutRef.current = null;
    }
  };

  // Ultra minimal config - adapts based on platform
  const playerConfig = {
    youtube: {
      playerVars: {
        rel: 0,              // No related videos
        modestbranding: 1,   // Minimal branding
        controls: useCustomControls ? 0 : 1,  // Custom controls on iOS PWA, native elsewhere
        disablekb: useCustomControls ? 1 : 0, // Disable keyboard only if using custom controls
        iv_load_policy: 3,   // No annotations
        cc_load_policy: 0,   // No captions
        fs: useCustomControls ? 0 : 1,        // Custom fullscreen on iOS PWA, native elsewhere
        autohide: 1,         // Auto-hide UI
        playsinline: 1,      // Play inline on mobile
        enablejsapi: 1,      // Enable API
        autoplay: 0,         // Don't autoplay (we control it)
        color: 'white',      // Progress bar color (minimal)
        // Additional parameters to hide everything
        annotations: 0,      // No annotations
        logo: 0,             // No YouTube logo
      }
    }
  };

  if (isLoadingProgress) {
    return (
      <div className="aspect-video w-full flex flex-col items-center justify-center bg-muted rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mt-2 text-sm text-muted-foreground">
          Loading your progress...
        </span>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="aspect-video w-full flex flex-col items-center justify-center bg-muted rounded-lg gap-3">
        <div className="text-destructive mb-2">⚠️</div>
        <span className="text-sm text-muted-foreground text-center px-4">
          Unable to load video player
        </span>
        <button
          onClick={() => {
            setHasError(false);
            setIsReady(false);
          }}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Calculate if we should show the black blocker
  // Only show when paused and using custom controls
  const shouldShowBlocker = useCustomControls && !isPlaying;

  // Render player content
  const playerContent = (
    <div
      ref={containerRef}
      className={`
        ${isFullscreen
          ? 'fixed inset-0 w-screen h-screen'
          : 'aspect-video w-full relative'
        }
        bg-black overflow-hidden group transition-all duration-300
      `}
      style={isFullscreen ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999
      } : undefined}
    >
      {/* Fullscreen hints - shows when video is playing */}
      {useCustomControls && isPlaying && showFullscreenHint && (
        <div
          className="absolute top-4 left-4 right-16 z-50 bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2 text-white text-sm animate-in fade-in slide-in-from-top-2 duration-300"
          style={{ pointerEvents: 'none' }}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{isFullscreen ? "Pause to exit fullscreen" : "Pause the video to enter fullscreen"}</span>
        </div>
      )}

      {/* Custom fullscreen button */}
      {useCustomControls && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleFullscreen();
          }}
          disabled={isPlaying}
          className={`absolute top-4 right-4 z-50 w-10 h-10 rounded-lg bg-black/70 backdrop-blur-sm flex items-center justify-center transition-all duration-200 ${
            isPlaying
              ? 'opacity-40 cursor-not-allowed'
              : isFullscreen
              ? 'opacity-100 hover:bg-black/90'
              : 'sm:opacity-0 sm:group-hover:opacity-100 opacity-80 hover:bg-black/90'
          }`}
          aria-label={isFullscreen ? (isPlaying ? "Pause to exit fullscreen" : "Exit fullscreen") : "Open in fullscreen"}
          style={{ pointerEvents: 'auto', touchAction: 'manipulation' }}
        >
          {isFullscreen ? (
            // Exit fullscreen icon (X) - disabled style when playing
            <svg className={`w-5 h-5 ${isPlaying ? 'text-white/50' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Enter fullscreen icon - disabled style when playing
            <svg className={`w-5 h-5 ${isPlaying ? 'text-white/50' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
        </button>
      )}

      {/* Custom play/pause overlay */}
      {useCustomControls && (
        <div
          data-player-overlay="true"
          className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors"
          onClick={handleVideoClick}
          style={{ pointerEvents: 'auto' }}
        >
          {/* Only show play button when NOT in fullscreen (to avoid overlap with exit instructions) */}
          {!isPlaying && !isFullscreen && (
            <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-2xl animate-in fade-in zoom-in duration-200">
              <svg className="w-10 h-10 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          )}
        </div>
      )}

      {/* YouTube Player - pointer-events disabled ONLY when using custom controls */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: useCustomControls ? 'none' : 'auto' }}
      >
        <ReactPlayer
          key={videoId}
          ref={playerRef}
          url={videoUrl}
          width="100%"
          height="100%"
          controls={!useCustomControls}
          playing={false}
          config={playerConfig}
          onReady={handleReady}
          onDuration={handleDuration}
          onProgress={handleProgress}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onError={handleError}
          onBuffer={handleBuffer}
          onBufferEnd={handleBufferEnd}
          progressInterval={3000}
          style={{ backgroundColor: '#000' }}
        />
      </div>

      {/* Opaque blocker when paused - ONLY for custom controls */}
      {shouldShowBlocker && (
        <div
          className="absolute inset-0 w-full h-full bg-black"
          style={{
            pointerEvents: 'none',
            zIndex: 5
          }}
        />
      )}

      {/* Invisible blocker to prevent YouTube UI from being clickable - ONLY for custom controls */}
      {useCustomControls && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            pointerEvents: 'none',
            zIndex: 6,
            background: 'transparent'
          }}
        />
      )}

      {/* Custom thumbnail when paused - shows premium custom thumbnail OR fullscreen exit instructions */}
      {!isPlaying && isReady && !isBuffering && (
        <div
          className="absolute inset-0 w-full h-full bg-black flex items-center justify-center"
          style={{
            pointerEvents: 'none',
            zIndex: 7
          }}
        >
          {isFullscreen ? (
            // Fullscreen exit instructions - simplified
            <div className="flex flex-col items-center justify-center gap-4 px-8 text-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-lg font-medium text-white drop-shadow-lg">
                Pause video to exit
              </p>
            </div>
          ) : thumbnail ? (
            // Custom thumbnail for normal paused state
            <>
              <img
                src={thumbnail}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
                style={{ objectFit: 'cover' }}
              />
              {/* Gradient overlay for better play button visibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
            </>
          ) : (
            // Black screen if no thumbnail
            <div className="w-full h-full bg-black" />
          )}
        </div>
      )}

      {/* Loading overlay - covers YouTube UI during initial load and buffering */}
      {(!isReady || isBuffering) && (
        <div
          className="absolute inset-0 w-full h-full bg-black flex items-center justify-center"
          style={{
            pointerEvents: 'none',
            zIndex: 10
          }}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <span className="text-sm text-white/90">
              The video is loading...
            </span>
          </div>
        </div>
      )}
    </div>
  );

  // When fullscreen, render via Portal to escape Dialog z-index
  if (isFullscreen && typeof document !== 'undefined') {
    return createPortal(playerContent, document.body);
  }

  return playerContent;
};
