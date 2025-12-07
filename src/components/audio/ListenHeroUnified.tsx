import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Headphones, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAudioPlayerStore } from '@/stores/audioPlayerStore';
import { useUserProducts } from '@/hooks/useUserProducts';
import { formatTime } from '@/lib/formatters';
import type { AudioSeries } from '@/stores/audioPlayerStore';

interface ContinueData {
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
    transcript_segments: any | null;
  };
  series: AudioSeries;
  progressSeconds: number;
}

interface ListenHeroUnifiedProps {
  continueData?: ContinueData | null;
  featuredSeries?: AudioSeries | null;
  fallbackSeries?: AudioSeries | null;
}

type HeroType = 'continue' | 'featured' | 'start';

export function ListenHeroUnified({ 
  continueData, 
  featuredSeries, 
  fallbackSeries 
}: ListenHeroUnifiedProps) {
  const navigate = useNavigate();
  const { play } = useAudioPlayerStore();
  const { hasUnlock } = useUserProducts();

  // Smart fallback logic: Continue > Featured > Start Here
  const heroContent = useMemo(() => {
    if (continueData) {
      return { type: 'continue' as HeroType, data: continueData };
    }
    if (featuredSeries) {
      return { type: 'featured' as HeroType, data: featuredSeries };
    }
    if (fallbackSeries) {
      return { type: 'start' as HeroType, data: fallbackSeries };
    }
    return null;
  }, [continueData, featuredSeries, fallbackSeries]);

  if (!heroContent) return null;

  const { type, data } = heroContent;

  // Extract series and progress info based on type
  const series = type === 'continue' ? (data as ContinueData).series : (data as AudioSeries);
  const track = type === 'continue' ? (data as ContinueData).track : null;
  const progressSeconds = type === 'continue' ? (data as ContinueData).progressSeconds : 0;
  const progressPercent = track 
    ? Math.round((progressSeconds / track.duration_seconds) * 100) 
    : 0;

  const hasAccess = track 
    ? track.is_preview || !series.unlock_key || hasUnlock(series.unlock_key)
    : true;

  const handleAction = () => {
    if (type === 'continue' && track && hasAccess) {
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
          transcript_segments: track.transcript_segments,
        },
        series,
        undefined,
        progressSeconds
      );
    } else {
      navigate(`/listen/${series.slug}`);
    }
  };

  // Badge config
  const badgeConfig = {
    continue: { label: 'Continue Listening', icon: Play, color: 'bg-primary/20 text-primary' },
    featured: { label: 'Featured', icon: Sparkles, color: 'bg-amber-500/20 text-amber-600 dark:text-amber-400' },
    start: { label: 'Start Here', icon: ArrowRight, color: 'bg-green-500/20 text-green-600 dark:text-green-400' },
  };

  const badge = badgeConfig[type];
  const BadgeIcon = badge.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={handleAction}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 cursor-pointer group"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 pointer-events-none" />
      
      <div className="relative p-4">
        {/* Badge */}
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${badge.color} mb-3`}>
          <BadgeIcon className="w-3 h-3" />
          <span className="text-xs font-semibold">{badge.label}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Cover with progress bar */}
          <div className="relative flex-shrink-0">
            {series.cover_image ? (
              <img
                src={series.cover_image}
                alt={series.name}
                className="w-20 h-20 rounded-xl object-cover shadow-lg group-hover:shadow-xl transition-shadow"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-lg">
                <Headphones className="w-10 h-10 text-primary/50" />
              </div>
            )}
            
            {/* Icon overlay */}
            {series.icon_name && (
              <div className="absolute -top-1.5 -right-1.5 text-lg drop-shadow-md">
                {series.icon_name}
              </div>
            )}

            {/* Linear progress bar below cover (gamification) */}
            {type === 'continue' && progressPercent > 0 && (
              <div className="absolute -bottom-1 left-1 right-1 h-1 bg-muted/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-1">
            {type === 'continue' && track ? (
              <>
                <h3 className="text-base font-semibold text-foreground line-clamp-1">
                  {track.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {series.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatTime(progressSeconds)}</span>
                  <span>/</span>
                  <span>{formatTime(track.duration_seconds)}</span>
                  <span className="text-primary font-medium">• {progressPercent}%</span>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-base font-semibold text-foreground line-clamp-2">
                  {series.name}
                </h3>
                {series.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {series.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{series.track_count} episodes</span>
                  <span>•</span>
                  <span>{Math.round((series.total_duration || 0) / 60)} min</span>
                </div>
              </>
            )}
          </div>

          {/* Play button */}
          <motion.div 
            whileTap={{ scale: 0.9 }}
            className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all"
          >
            <Play className="w-5 h-5 text-primary-foreground fill-current ml-0.5" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
