import { motion } from 'framer-motion';
import { Play, Check, Lock, Pause, Clock, Crown } from 'lucide-react';
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

// Animated playing bars component - Premium version
function PlayingBars() {
  return (
    <div className="flex items-end gap-[2px] h-4">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-[3px] bg-gradient-to-t from-[#FF6631] to-[#FFA300] rounded-full"
          animate={{
            height: ['5px', '14px', '7px', '12px', '5px'],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
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

  const isCompleted = progress?.completed;

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
      return (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
          <Lock className="w-4 h-4 text-amber-600" />
        </div>
      );
    }

    if (isCurrent && isPlaying) {
      return (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6631]/15 to-[#FFA300]/15 flex items-center justify-center">
          <PlayingBars />
        </div>
      );
    }

    if (isCurrent) {
      return (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6631] to-[#FFA300] flex items-center justify-center shadow-lg shadow-orange-500/30">
          <Pause className="w-4 h-4 text-white" />
        </div>
      );
    }

    if (isCompleted) {
      return (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500/15 to-emerald-500/15 flex items-center justify-center">
          <Check className="w-4 h-4 text-green-600" />
        </div>
      );
    }

    // Default: Track number with subtle styling
    return (
      <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#FF6631]/10 group-hover:to-[#FFA300]/10 transition-all">
        <span className="text-sm text-muted-foreground font-semibold group-hover:text-[#FF6631] transition-colors">
          {track.track_number}
        </span>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ x: 4 }}
      className="group"
    >
      <button
        onClick={handleClick}
        className={`
          w-full p-3 rounded-[14px] flex items-center gap-3 transition-all relative overflow-hidden
          ${isCurrent
            ? 'bg-gradient-to-r from-amber-50 to-white dark:from-amber-900/20 dark:to-card border-2 border-[#FF6631]/30 shadow-md'
            : isLocked
              ? 'bg-white/60 dark:bg-gray-800/60 border border-border hover:bg-white dark:hover:bg-gray-800 hover:border-amber-300/50'
              : isCompleted
                ? 'bg-gradient-to-r from-green-50 to-white dark:from-green-900/20 dark:to-card border border-green-200/50 dark:border-green-800/50 hover:border-green-300'
                : 'bg-white dark:bg-card border border-border hover:border-[#FF6631]/30 hover:shadow-md'
          }
        `}
      >
        {/* Progress background for current track */}
        {isCurrent && progressPercentage > 0 && (
          <div
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#FF6631]/5 to-transparent transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        )}

        {/* Indicator area */}
        <div className="relative z-10 flex-shrink-0">
          {renderIndicator()}
        </div>

        {/* Track info */}
        <div className="relative z-10 flex-1 min-w-0 text-left">
          <h3 className={`
            text-[15px] font-semibold truncate leading-tight
            ${isCurrent
              ? 'text-[#FF6631]'
              : isCompleted
                ? 'text-green-700 dark:text-green-400'
                : 'text-foreground group-hover:text-[#FF6631]'
            } transition-colors
          `}>
            {track.title}
          </h3>

          {/* Progress bar for tracks with progress */}
          {progress && !isCompleted && progressPercentage > 0 && !isCurrent && (
            <div className="mt-2 w-24 h-1.5 bg-[#F0E6DF] rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#FF6631] to-[#FFA300] rounded-full"
              />
            </div>
          )}

          {/* Duration for non-current tracks */}
          {!isCurrent && !isLocked && (
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{formatTime(track.duration_seconds)}</span>
              {isCompleted && (
                <span className="ml-1 text-green-600 dark:text-green-400 font-medium">• Completed</span>
              )}
            </div>
          )}
        </div>

        {/* Right side: Duration/Premium badge */}
        <div className="relative z-10 flex-shrink-0 ml-auto">
          {isLocked ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-700 text-xs font-semibold">
              <Crown className="w-3.5 h-3.5" />
              Premium
            </span>
          ) : isCurrent ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#FF6631] font-semibold">
                {formatTime(progress?.progress_seconds || 0)}
              </span>
              <span className="text-xs text-muted-foreground">/</span>
              <span className="text-xs text-muted-foreground">
                {formatTime(track.duration_seconds)}
              </span>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6631] to-[#FFA300] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md"
            >
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </motion.div>
          )}
        </div>

        {/* Hover accent line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 rounded-r-full bg-gradient-to-b from-[#FF6631] to-[#FFA300] transition-all duration-300 group-hover:h-[60%]" />
      </button>
    </motion.div>
  );
}
