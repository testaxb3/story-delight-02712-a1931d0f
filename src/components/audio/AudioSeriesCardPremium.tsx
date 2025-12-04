import { motion } from 'framer-motion';
import { Play, Headphones, CheckCircle2, Lock } from 'lucide-react';
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
  // Always navigate - locked tracks are handled at track level (freemium model)
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
        hover:shadow-lg active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-primary/50
        ${isCompleted ? 'border-green-500/30' : 'border-border/50 hover:border-primary/30'}
      `}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Cover with linear progress bar */}
        <div className="relative flex-shrink-0">
          {series.cover_image ? (
            <img
              src={series.cover_image}
              alt={series.name}
              className={`w-16 h-16 rounded-xl object-cover shadow-md ${isLocked ? 'opacity-90' : ''}`}
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Headphones className="w-8 h-8 text-primary/50" />
            </div>
          )}
          
          {/* Locked overlay - subtle padlock */}
          {isLocked && (
            <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              {/* Padlock icon */}
              <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <Lock className="w-2.5 h-2.5 text-white/90" />
              </div>
              
              {/* Tap to unlock - pulsating */}
              <motion.div 
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-white/90 font-medium whitespace-nowrap"
              >
                Tap to unlock
              </motion.div>
            </div>
          )}

          {/* Completed checkmark */}
          {isCompleted && (
            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 shadow-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </div>
          )}

          {/* Linear progress bar below cover */}
          {progress && progress.percent > 0 && (
            <div className="absolute -bottom-0.5 left-0.5 right-0.5 h-1 bg-muted/40 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${isCompleted ? 'bg-green-500' : 'bg-primary'}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress.percent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-1">
          {series.icon_name && (
            <span className="text-sm">{series.icon_name}</span>
          )}
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-tight">
            {series.name}
          </h3>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{series.track_count} episodes</span>
            <span>•</span>
            <span>{formatDuration(series.total_duration, 'short')}</span>
          </div>

          {/* Badges row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Free series → "Unlocked ✓" */}
            {isFree && !isLocked && (
              <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-semibold">
                Unlocked ✓
              </span>
            )}
            
            {/* Premium series → subtle badge, no crown emoji */}
            {isLocked && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-semibold">
                Premium
              </span>
            )}
            
            {/* Free previews badge for premium series */}
            {isLocked && freeTracksCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-medium">
                {freeTracksCount} previews
              </span>
            )}

            {/* Progress text */}
            {progress && progress.percent > 0 && !isCompleted && (
              <span className="text-[10px] text-muted-foreground">
                {progress.completed}/{progress.total}
              </span>
            )}

            {isCompleted && (
              <span className="text-[10px] text-green-600 dark:text-green-400 font-medium">
                Completed
              </span>
            )}
          </div>
        </div>

        {/* Play button */}
        <motion.div 
          whileTap={{ scale: 0.9 }}
          className={`
            flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center
            ${isLocked 
              ? 'bg-amber-500/15 text-amber-500' 
              : isCompleted 
                ? 'bg-green-500/15 text-green-500'
                : 'bg-primary/10 text-primary'
            }
          `}
        >
          <Play className="w-4 h-4 fill-current ml-0.5" />
        </motion.div>
      </div>
    </motion.div>
  );
}
