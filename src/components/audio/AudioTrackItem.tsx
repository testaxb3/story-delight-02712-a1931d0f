import { motion } from 'framer-motion';
import { Play, Pause, Check } from 'lucide-react';
import { useAudioProgress } from '@/hooks/useAudioProgress';
import type { AudioTrack } from '@/stores/audioPlayerStore';
import { formatTime } from '@/lib/formatters';

interface AudioTrackItemProps {
  track: AudioTrack;
  isPlaying: boolean;
  isCurrent: boolean;
  onPlay: () => void;
  index: number;
}

export function AudioTrackItem({ track, isPlaying, isCurrent, onPlay, index }: AudioTrackItemProps) {
  const { data: progress } = useAudioProgress(track.id);

  const progressPercentage = progress
    ? Math.round((progress.progress_seconds / track.duration_seconds) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <button
        onClick={onPlay}
        className={`
          w-full p-4 rounded-2xl flex items-center gap-4 transition-all
          ${isCurrent 
            ? 'bg-primary/10 border border-primary/20' 
            : 'bg-card hover:bg-muted/50 border border-transparent'
          }
        `}
      >
        {/* Play/Pause button or track number */}
        <div className="relative flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          {isCurrent && isPlaying ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-primary"
            >
              <Pause className="w-5 h-5 fill-current" />
            </motion.div>
          ) : isCurrent ? (
            <Play className="w-5 h-5 fill-current text-primary" />
          ) : progress?.completed ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <span className="text-sm font-semibold text-muted-foreground">
              {track.track_number}
            </span>
          )}
        </div>

        {/* Track info */}
        <div className="flex-1 min-w-0 text-left">
          <h3 className={`
            text-sm font-semibold truncate
            ${isCurrent ? 'text-primary' : 'text-foreground'}
          `}>
            {track.title}
          </h3>
          
          {progress && !progress.completed && progressPercentage > 0 && (
            <div className="mt-1.5">
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          )}
        </div>

        {/* Duration */}
        <span className="text-xs text-muted-foreground font-mono flex-shrink-0">
          {formatTime(track.duration_seconds)}
        </span>
      </button>
    </motion.div>
  );
}
