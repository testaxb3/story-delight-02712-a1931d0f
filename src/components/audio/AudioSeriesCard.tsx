import { motion } from 'framer-motion';
import { Play, Clock, ChevronRight, Headphones } from 'lucide-react';
import type { AudioSeries } from '@/stores/audioPlayerStore';
import { formatDuration } from '@/lib/formatters';

interface AudioSeriesCardProps {
  series: AudioSeries;
  onClick?: () => void;
  isLocked?: boolean;
  onLockedClick?: () => void;
}

export function AudioSeriesCard({ series, onClick, isLocked, onLockedClick }: AudioSeriesCardProps) {
  const handleClick = () => {
    if (isLocked && onLockedClick) {
      onLockedClick();
    } else {
      onClick?.();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${series.name} series with ${series.track_count} episodes`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-card to-card border backdrop-blur-sm cursor-pointer hover:scale-[1.02] transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/50 ${isLocked ? 'border-[#D4A574]/40 hover:border-[#D4A574]/60' : 'border-border/50'}`}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
      
      <div className={`relative p-6 ${isLocked ? 'pointer-events-none' : ''}`}>
        {/* Header with icon */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {series.cover_image ? (
              <img
                src={series.cover_image}
                alt={series.name}
                className="w-16 h-16 rounded-xl object-cover shadow-lg flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-8 h-8 text-primary/60" />
              </div>
            )}
            
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                {series.icon_name && (
                  <span className="text-xl flex-shrink-0">{series.icon_name}</span>
                )}
                <h2 className="text-lg font-bold text-foreground truncate">
                  {series.name}
                </h2>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Play className="w-3 h-3" />
                  <span>{series.track_count} episodes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatDuration(series.total_duration, 'long')}</span>
                </div>
              </div>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </div>
      </div>

      {/* Premium Badge Overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Gradient overlay - não opaco */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-3 p-4 pointer-events-auto">
            {/* Premium badge com glow */}
            <div 
              className="px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #D4A574 0%, #B8864A 100%)',
                boxShadow: '0 0 20px rgba(212, 165, 116, 0.4)',
              }}
            >
              <span className="text-lg">👑</span>
              <span className="text-sm font-bold text-white">Premium</span>
            </div>
            
            {/* CTA com pulse */}
            <motion.span 
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xs text-white/90 font-medium"
            >
              Tap to unlock
            </motion.span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
