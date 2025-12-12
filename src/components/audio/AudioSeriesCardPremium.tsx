import { motion } from 'framer-motion';
import { Play, Headphones, CheckCircle2, Lock, Clock, Sparkles } from 'lucide-react';
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
  const hasProgress = progress && progress.percent > 0 && !isCompleted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6 }}
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
        relative overflow-hidden rounded-[18px] cursor-pointer 
        bg-white dark:bg-card border transition-all duration-300 shadow-sm
        hover:shadow-xl hover:shadow-orange-500/10 active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-[#FF6631]/50
        ${isCompleted
          ? 'border-green-400/50'
          : hasProgress
            ? 'border-[#FF6631]/30'
            : 'border-border hover:border-[#FF6631]/30'
        }
      `}
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full ${isCompleted
        ? 'bg-gradient-to-r from-green-500 to-emerald-400'
        : isLocked
          ? 'bg-gradient-to-r from-amber-500 to-orange-400'
          : 'bg-gradient-to-r from-[#FF6631] to-[#FFA300]'
        }`} />

      {/* 16:9 Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden">
        {series.cover_image ? (
          <img
            src={series.cover_image}
            alt={series.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isLocked ? 'opacity-90' : ''}`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#FF6631]/15 to-[#FFA300]/10 flex items-center justify-center">
            <Headphones className="w-14 h-14 text-[#FF6631]/25" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Top badges row */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          {/* Status badge */}
          {isLocked ? (
            <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-lg">
              <Lock className="w-3 h-3" />
              Premium
            </span>
          ) : isFree ? (
            <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 text-white text-[10px] font-bold shadow-lg">
              Free
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#FF6631] to-[#FFA300] text-white text-[10px] font-bold flex items-center gap-1 shadow-lg">
              <Sparkles className="w-3 h-3" />
              Unlocked
            </span>
          )}

          {/* Duration badge */}
          <span className="px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDuration(series.total_duration, 'short')}
          </span>
        </div>

        {/* Completed checkmark */}
        {isCompleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="absolute top-2.5 right-2.5 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center shadow-lg"
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
          </motion.div>
        )}

        {/* Icon overlay */}
        {series.icon_name && (
          <div className="absolute bottom-2.5 left-2.5 text-2xl drop-shadow-lg">
            {series.icon_name}
          </div>
        )}

        {/* Play button overlay */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`
            absolute bottom-2.5 right-2.5 w-11 h-11 rounded-full flex items-center justify-center
            shadow-lg transition-all
            ${isLocked
              ? 'bg-gradient-to-br from-amber-500 to-orange-500'
              : isCompleted
                ? 'bg-gradient-to-br from-green-500 to-emerald-400'
                : 'bg-gradient-to-br from-[#FF6631] to-[#FFA300]'
            }
          `}
        >
          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
        </motion.div>

        {/* Progress bar at bottom of thumbnail */}
        {progress && progress.percent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40">
            <motion.div
              className={`h-full ${isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-[#FF6631] to-[#FFA300]'}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress.percent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        )}
      </div>

      {/* Info section */}
      <div className="p-4 space-y-2">
        <h3 className="text-[15px] font-bold text-foreground line-clamp-2 leading-snug">
          {series.name}
        </h3>

        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          <span className="font-medium">{series.track_count} episodes</span>

          {/* Free previews badge for premium series */}
          {isLocked && freeTracksCount > 0 && (
            <>
              <span className="text-border">•</span>
              <span className="text-[#FF6631] font-semibold">
                {freeTracksCount} free
              </span>
            </>
          )}

          {/* Progress text */}
          {hasProgress && (
            <>
              <span className="text-border">•</span>
              <span className="text-[#FF6631] font-semibold">
                {progress.completed}/{progress.total} done
              </span>
            </>
          )}

          {isCompleted && (
            <>
              <span className="text-border">•</span>
              <span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Completed
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
