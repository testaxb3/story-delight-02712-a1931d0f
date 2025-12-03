import { motion } from 'framer-motion';
import { Play, Headphones, CheckCircle2 } from 'lucide-react';
import type { AudioSeries } from '@/stores/audioPlayerStore';
import { formatDuration } from '@/lib/formatters';

interface AudioSeriesCardPremiumProps {
  series: AudioSeries;
  onClick?: () => void;
  isLocked?: boolean;
  onLockedClick?: () => void;
  progress?: { completed: number; total: number; percent: number };
  index?: number;
}

export function AudioSeriesCardPremium({ 
  series, 
  onClick, 
  isLocked, 
  onLockedClick,
  progress,
  index = 0
}: AudioSeriesCardPremiumProps) {
  const handleClick = () => {
    if (isLocked && onLockedClick) {
      onLockedClick();
    } else {
      onClick?.();
    }
  };

  const isCompleted = progress && progress.percent === 100;
  const isFree = !series.unlock_key;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
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
        ${isLocked ? 'border-amber-500/30' : 'border-border/50 hover:border-primary/30'}
        ${isCompleted ? 'border-green-500/30' : ''}
      `}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Cover with progress ring */}
        <div className="relative flex-shrink-0">
          {series.cover_image ? (
            <img
              src={series.cover_image}
              alt={series.name}
              className="w-20 h-20 rounded-xl object-cover shadow-md"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Headphones className="w-10 h-10 text-primary/50" />
            </div>
          )}
          
          {/* Progress ring */}
          {progress && progress.percent > 0 && (
            <svg className="absolute inset-0 w-20 h-20 -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="38"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-muted/30"
              />
              <circle
                cx="40"
                cy="40"
                r="38"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${progress.percent * 2.39} 239`}
                strokeLinecap="round"
                className={isCompleted ? 'text-green-500' : 'text-primary'}
              />
            </svg>
          )}

          {/* Completed checkmark */}
          {isCompleted && (
            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-1">
          {series.icon_name && (
            <span className="text-base">{series.icon_name}</span>
          )}
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-tight">
            {series.name}
          </h3>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{series.track_count} episodes</span>
            <span>•</span>
            <span>{formatDuration(series.total_duration, 'short')}</span>
          </div>

          {/* Progress text or badge */}
          <div className="flex items-center gap-2">
            {isFree && !isLocked && (
              <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-semibold uppercase">
                Free
              </span>
            )}
            
            {isLocked && (
              <span 
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase flex items-center gap-1"
                style={{
                  background: 'linear-gradient(135deg, rgba(212,165,116,0.2) 0%, rgba(184,134,74,0.2) 100%)',
                  color: '#D4A574',
                }}
              >
                <span>👑</span>
                <span>Premium</span>
              </span>
            )}

            {progress && progress.percent > 0 && !isCompleted && (
              <span className="text-[10px] text-muted-foreground">
                {progress.completed} of {progress.total} completed
              </span>
            )}

            {isCompleted && (
              <span className="text-[10px] text-green-600 dark:text-green-400 font-medium">
                Completed ✓
              </span>
            )}
          </div>
        </div>

        {/* Play button */}
        <motion.div 
          whileTap={{ scale: 0.9 }}
          className={`
            flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
            ${isLocked 
              ? 'bg-amber-500/20 text-amber-500' 
              : isCompleted 
                ? 'bg-green-500/20 text-green-500'
                : 'bg-primary/10 text-primary'
            }
          `}
        >
          <Play className="w-4 h-4 fill-current ml-0.5" />
        </motion.div>
      </div>

      {/* Locked overlay */}
      {isLocked && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-amber-500/10 pointer-events-none"
        />
      )}
    </motion.div>
  );
}
