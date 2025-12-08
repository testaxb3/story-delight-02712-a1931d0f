import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Headphones, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAudioPlayerStore } from '@/stores/audioPlayerStore';
import { useUserProducts } from '@/hooks/useUserProducts';
import { formatTime, formatDuration } from '@/lib/formatters';
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
  latestSeries?: AudioSeries | null;
}

type HeroType = 'continue' | 'latest' | 'featured' | 'start';

export function ListenHeroUnified({ 
  continueData, 
  featuredSeries, 
  fallbackSeries,
  latestSeries 
}: ListenHeroUnifiedProps) {
  const navigate = useNavigate();
  const { play } = useAudioPlayerStore();
  const { hasUnlock } = useUserProducts();

  // Smart fallback logic: Continue > Latest > Featured > Start Here
  const heroContent = useMemo(() => {
    if (continueData) {
      return { type: 'continue' as HeroType, data: continueData };
    }
    if (latestSeries) {
      return { type: 'latest' as HeroType, data: latestSeries };
    }
    if (featuredSeries) {
      return { type: 'featured' as HeroType, data: featuredSeries };
    }
    if (fallbackSeries) {
      return { type: 'start' as HeroType, data: fallbackSeries };
    }
    return null;
  }, [continueData, latestSeries, featuredSeries, fallbackSeries]);

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
    continue: { label: 'Continue', icon: Play, color: 'bg-primary text-primary-foreground' },
    latest: { label: 'New', icon: Sparkles, color: 'bg-amber-500 text-white' },
    featured: { label: 'Featured', icon: Sparkles, color: 'bg-primary text-primary-foreground' },
    start: { label: 'Start Here', icon: Play, color: 'bg-emerald-500 text-white' },
  };

  const badge = badgeConfig[type];
  const BadgeIcon = badge.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={handleAction}
      className="relative overflow-hidden rounded-2xl bg-card border border-border/50 cursor-pointer group hover:border-primary/30 transition-all hover:shadow-xl"
    >
      {/* Clean 16:9 Thumbnail - NO text overlay */}
      <div className="relative aspect-video w-full overflow-hidden">
        {series.cover_image ? (
          <img
            src={series.cover_image}
            alt={series.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Headphones className="w-20 h-20 text-primary/30" />
          </div>
        )}
        
        {/* Subtle vignette only - no heavy gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Badge - top left */}
        <div className={`absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${badge.color} shadow-lg`}>
          <BadgeIcon className="w-3 h-3" />
          <span className="text-[11px] font-bold uppercase tracking-wide">{badge.label}</span>
        </div>

        {/* Series emoji - top right */}
        {series.icon_name && (
          <div className="absolute top-3 right-3 text-2xl drop-shadow-lg">
            {series.icon_name}
          </div>
        )}

        {/* Play button - centered */}
        <motion.div 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-primary/40">
            <Play className="w-7 h-7 text-primary-foreground fill-current ml-1" />
          </div>
        </motion.div>

        {/* Mini play button - always visible on mobile */}
        <div className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-xl shadow-primary/30 md:hidden">
          <Play className="w-5 h-5 text-primary-foreground fill-current ml-0.5" />
        </div>
      </div>

      {/* Content section - SEPARATED from thumbnail */}
      <div className="p-4 space-y-3">
        {type === 'continue' && track ? (
          <>
            {/* Series name + Track title */}
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {series.name}
              </p>
              <h3 className="text-lg font-bold text-foreground line-clamp-1">
                {track.title}
              </h3>
            </div>
            
            {/* Progress bar - prominent */}
            <div className="space-y-2">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {formatTime(progressSeconds)} / {formatTime(track.duration_seconds)}
                </span>
                <span className="text-primary font-semibold">
                  {progressPercent}%
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Series info for non-continue states */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground line-clamp-1">
                {series.name}
              </h3>
              {series.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {series.description}
                </p>
              )}
            </div>
            
            {/* Meta info */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium">{series.track_count} episodes</span>
              <span className="text-muted-foreground/50">•</span>
              <span>{formatDuration(series.total_duration, 'short')}</span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
