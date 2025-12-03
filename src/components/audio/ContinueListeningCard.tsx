import { motion } from 'framer-motion';
import { Play, Headphones } from 'lucide-react';
import { useAudioPlayerStore } from '@/stores/audioPlayerStore';
import { useUserProducts } from '@/hooks/useUserProducts';
import { formatTime } from '@/lib/formatters';

interface ContinueListeningProps {
  track: {
    id: string;
    title: string;
    track_number: number;
    duration_seconds: number;
    audio_url: string;
    thumbnail: string | null;
    is_preview: boolean;
    description: string | null;
    tags: string[] | null;
    series_id: string;
  };
  series: {
    id: string;
    name: string;
    slug: string;
    cover_image: string | null;
    icon_name: string | null;
    description: string | null;
    display_order: number;
    total_duration: number;
    track_count: number;
    unlock_key: string | null;
  };
  progressSeconds: number;
}

export function ContinueListeningCard({ track, series, progressSeconds }: ContinueListeningProps) {
  const { play } = useAudioPlayerStore();
  const { hasUnlock } = useUserProducts();
  
  const hasAccess = track.is_preview || !series.unlock_key || hasUnlock(series.unlock_key);
  const progressPercent = Math.round((progressSeconds / track.duration_seconds) * 100);

  const handleResume = () => {
    if (!hasAccess) return;
    
    play(
      {
        id: track.id,
        series_id: track.series_id,
        title: track.title,
        description: track.description,
        track_number: track.track_number,
        duration_seconds: track.duration_seconds,
        audio_url: track.audio_url,
        thumbnail: track.thumbnail,
        is_preview: track.is_preview,
        tags: track.tags,
      },
      series,
      undefined,
      progressSeconds
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-card to-card border border-primary/20 p-4"
    >
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
      
      <div className="relative flex items-center gap-4">
        {/* Cover image */}
        <div className="relative flex-shrink-0">
          {series.cover_image ? (
            <img
              src={series.cover_image}
              alt={series.name}
              className="w-16 h-16 rounded-xl object-cover shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
              <Headphones className="w-8 h-8 text-primary/60" />
            </div>
          )}
          
          {/* Progress ring overlay */}
          <svg className="absolute inset-0 w-16 h-16 -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="30"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-primary/20"
            />
            <circle
              cx="32"
              cy="32"
              r="30"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${progressPercent * 1.88} 188`}
              className="text-primary"
            />
          </svg>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-primary mb-0.5">Continue Listening</p>
          <h3 className="text-sm font-semibold text-foreground truncate">
            {track.title}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {series.name}
          </p>
          
          {/* Progress bar */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
              {formatTime(progressSeconds)} / {formatTime(track.duration_seconds)}
            </span>
          </div>
        </div>

        {/* Play button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleResume}
          disabled={!hasAccess}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Play className="w-5 h-5 text-primary-foreground fill-current ml-0.5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
