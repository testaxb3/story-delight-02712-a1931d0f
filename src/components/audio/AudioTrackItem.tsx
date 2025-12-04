import { motion } from 'framer-motion';
import { Play, Check, Lock } from 'lucide-react';
import { useAudioProgress } from '@/hooks/useAudioProgress';
import { useAudioRef } from '@/contexts/AudioPlayerContext';
import type { AudioTrack } from '@/stores/audioPlayerStore';
import { formatTime } from '@/lib/formatters';

interface AudioTrackItemProps {
  track: AudioTrack;
  isPlaying: boolean;
  isCurrent: boolean;
  onPlay: () => void;
  index: number;
  isLocked?: boolean;
  onLockedClick?: () => void;
}

// Animated playing bars component
function PlayingBars() {
  return (
    <div className="flex items-end gap-[3px] h-4">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-[3px] bg-primary rounded-full"
          animate={{
            height: ['6px', '14px', '8px', '12px', '6px'],
          }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.12,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function AudioTrackItem({ track, isPlaying, isCurrent, onPlay, index, isLocked = false, onLockedClick }: AudioTrackItemProps) {
  const { data: progress } = useAudioProgress(track.id);
  const audioRef = useAudioRef();

  const progressPercentage = progress
    ? Math.round((progress.progress_seconds / track.duration_seconds) * 100)
    : 0;

  const handleClick = () => {
    if (isLocked && onLockedClick) {
      onLockedClick();
    } else if (!isLocked) {
      onPlay();
      // iOS: Trigger play directly from user gesture for compliance
      if (audioRef?.current && !isCurrent) {
        audioRef.current.play().catch((error) => {
          console.error('[AudioTrackItem] Direct play failed:', error.name);
        });
      }
    }
  };

  // Determine what to show in the number/indicator area
  const renderIndicator = () => {
    if (isLocked) {
      return <Lock className="w-4 h-4 text-[#D4A574]" />;
    }
    
    if (isCurrent && isPlaying) {
      return <PlayingBars />;
    }
    
    if (isCurrent) {
      return <Play className="w-4 h-4 text-primary fill-primary" />;
    }
    
    if (progress?.completed) {
      return <Check className="w-4 h-4 text-green-500" />;
    }
    
    // Minimalist number - no circle background
    return (
      <span className="text-sm text-muted-foreground font-medium tabular-nums">
        {track.track_number}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group border-b border-border/40 last:border-0 relative mb-1"
    >
      <button
        onClick={handleClick}
        className={`
          w-full py-4 px-2 rounded-lg flex items-center gap-3 transition-all relative
          ${isCurrent
            ? 'bg-primary/8'
            : isLocked
            ? 'opacity-50 hover:opacity-60'
            : 'hover:bg-muted/30'
          }
        `}
      >
        {/* Indicator area - fixed width, no background */}
        <div className="w-8 flex items-center justify-center flex-shrink-0">
          {renderIndicator()}
        </div>

        {/* Track info */}
        <div className="flex-1 min-w-0 text-left">
          <h3 className={`
            text-sm font-bold truncate leading-none
            ${isCurrent ? 'text-primary' : 'text-black dark:text-white'}
          `} style={{ textShadow: 'none', WebkitTextStroke: '0px' }}>
            {track.title}
          </h3>
          
          {/* Fixed Progress Bar - Visual Fix requested */}
          {progress && !progress.completed && progressPercentage > 0 && (
            <div className="mt-2 w-[100px] h-[2px] bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-black dark:bg-white rounded-full"
              />
            </div>
          )}
        </div>

        {/* Duration or Premium badge - right aligned */}
        <div className="flex-shrink-0 ml-auto">
          {isLocked ? (
            <span className="text-[11px] text-[#D4A574] font-medium flex items-center gap-1">
              <span>👑</span>
              <span>Premium</span>
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground/70 font-mono">
              {formatTime(track.duration_seconds)}
            </span>
          )}
        </div>
      </button>
    </motion.div>
  );
}
