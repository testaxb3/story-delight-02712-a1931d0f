import { motion } from 'framer-motion';
import { Play, Clock } from 'lucide-react';
import type { AudioSeries } from '@/stores/audioPlayerStore';

interface AudioSeriesCardProps {
  series: AudioSeries;
  onPlay: () => void;
}

export function AudioSeriesCard({ series, onPlay }: AudioSeriesCardProps) {
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
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-card to-card border border-border/50 backdrop-blur-sm"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
      
      <div className="relative p-6 space-y-4">
        {/* Header with icon */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              {series.icon_name && (
                <span className="text-2xl">{series.icon_name}</span>
              )}
              <h2 className="text-2xl font-bold text-foreground">
                {series.name}
              </h2>
            </div>
            
            {series.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {series.description}
              </p>
            )}
          </div>

          {series.cover_image && (
            <img
              src={series.cover_image}
              alt={series.name}
              className="w-20 h-20 rounded-2xl object-cover shadow-lg"
            />
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Play className="w-4 h-4" />
            <span>{series.track_count} episodes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(series.total_duration)}</span>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onPlay}
          className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-95"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Play All</span>
        </button>
      </div>
    </motion.div>
  );
}
