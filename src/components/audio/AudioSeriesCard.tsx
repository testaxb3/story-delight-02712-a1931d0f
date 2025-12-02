import { motion } from 'framer-motion';
import { Play, Clock, ChevronRight } from 'lucide-react';
import type { AudioSeries } from '@/stores/audioPlayerStore';

interface AudioSeriesCardProps {
  series: AudioSeries;
  onClick?: () => void;
}

export function AudioSeriesCard({ series, onClick }: AudioSeriesCardProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-card to-card border border-border/50 backdrop-blur-sm cursor-pointer hover:scale-[1.02] transition-transform active:scale-[0.98]"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
      
      <div className="relative p-6">
        {/* Header with icon */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {series.cover_image && (
              <img
                src={series.cover_image}
                alt={series.name}
                className="w-16 h-16 rounded-xl object-cover shadow-lg flex-shrink-0"
              />
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
                  <span>{formatDuration(series.total_duration)}</span>
                </div>
              </div>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </div>
      </div>
    </motion.div>
  );
}
