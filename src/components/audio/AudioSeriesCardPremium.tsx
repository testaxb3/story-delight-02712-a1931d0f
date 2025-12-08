import { motion } from 'framer-motion';
import { Play, Headphones, CheckCircle2, Lock, Clock } from 'lucide-react';
import type { AudioSeries } from '@/stores/audioPlayerStore';
import { formatDuration } from '@/lib/formatters';

interface AudioSeriesCardPremiumProps {
  series: AudioSeries;
  onClick?: () => void;
  isLocked?: boolean;
  progress?: { completed: number; total: number; percent: number };
  index?: number;
  freeTracksCount?: number;
}

export function AudioSeriesCardPremium({ 
  series, 
  onClick, 
  isLocked, 
  progress,
  index = 0,
  freeTracksCount = 0
}: AudioSeriesCardPremiumProps) {
  const handleClick = () => {
    onClick?.();
  };

  const isCompleted = progress && progress.percent === 100;
  const isFree = !series.unlock_key;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className={`
        relative overflow-hidden rounded-2xl cursor-pointer 
        bg-card border transition-all duration-300
        hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-primary/50
        ${isCompleted ? 'border-green-500/30' : 'border-border/50 hover:border-primary/30'}
      `}
    >
      {/* Large 16:9 Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden">
        {series.cover_image ? (
          <img
            src={series.cover_image}
            alt={series.name}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${isLocked ? 'opacity-90' : ''}`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Headphones className="w-16 h-16 text-primary/30" />
          </div>
        )}
        
        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top badges row */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {/* Status badge */}
          {isLocked ? (
            <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-amber-400 text-xs font-semibold flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              Premium
            </span>
          ) : isFree ? (
            <span className="px-2.5 py-1 rounded-full bg-green-500/90 text-white text-xs font-semibold">
              Free
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-semibold">
              Unlocked
            </span>
          )}

          {/* Duration badge */}
          <span className="px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDuration(series.total_duration, 'short')}
          </span>
        </div>

        {/* Completed checkmark */}
        {isCompleted && (
          <div className="absolute top-3 right-3 bg-green-500 rounded-full p-1.5 shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
        )}

        {/* Icon overlay */}
        {series.icon_name && (
          <div className="absolute bottom-3 left-3 text-2xl drop-shadow-lg">
            {series.icon_name}
          </div>
        )}

        {/* Play button overlay */}
        <motion.div 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`
            absolute bottom-3 right-3 w-12 h-12 rounded-full flex items-center justify-center
            shadow-lg backdrop-blur-sm transition-colors
            ${isLocked 
              ? 'bg-amber-500/90 text-white' 
              : isCompleted 
                ? 'bg-green-500/90 text-white'
                : 'bg-primary/90 text-primary-foreground'
            }
          `}
        >
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </motion.div>

        {/* Progress bar at bottom of thumbnail */}
        {progress && progress.percent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
            <motion.div
              className={`h-full ${isCompleted ? 'bg-green-500' : 'bg-primary'}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress.percent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        )}
      </div>

      {/* Info section */}
      <div className="p-4 space-y-2">
        <h3 className="text-base font-semibold text-foreground line-clamp-2 leading-snug">
          {series.name}
        </h3>
        
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{series.track_count} episodes</span>
          
          {/* Free previews badge for premium series */}
          {isLocked && freeTracksCount > 0 && (
            <>
              <span>•</span>
              <span className="text-primary font-medium">
                {freeTracksCount} free
              </span>
            </>
          )}

          {/* Progress text */}
          {progress && progress.percent > 0 && !isCompleted && (
            <>
              <span>•</span>
              <span className="text-primary font-medium">
                {progress.completed}/{progress.total} done
              </span>
            </>
          )}

          {isCompleted && (
            <>
              <span>•</span>
              <span className="text-green-600 dark:text-green-400 font-medium">
                Completed
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
