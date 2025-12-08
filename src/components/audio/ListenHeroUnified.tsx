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
    continue: { label: 'Continue Listening', icon: Play, color: 'bg-primary text-primary-foreground' },
    latest: { label: 'Latest Series', icon: Sparkles, color: 'bg-amber-500 text-white' },
    featured: { label: 'Featured', icon: Sparkles, color: 'bg-primary text-primary-foreground' },
    start: { label: 'Start Here', icon: Play, color: 'bg-green-500 text-white' },
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
      {/* Full-width 16:9 Thumbnail */}
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
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Badge */}
        <div className={`absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${badge.color} shadow-lg`}>
          <BadgeIcon className="w-3.5 h-3.5" />
          <span className="text-xs font-bold uppercase tracking-wide">{badge.label}</span>
        </div>

        {/* Icon */}
        {series.icon_name && (
          <div className="absolute top-4 right-4 text-3xl drop-shadow-lg">
            {series.icon_name}
          </div>
        )}

        {/* Bottom content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 space-y-3">
          {type === 'continue' && track ? (
            <>
              <div className="space-y-1">
                <p className="text-white/70 text-sm font-medium">{series.name}</p>
                <h3 className="text-xl font-bold text-white line-clamp-2">
                  {track.title}
                </h3>
              </div>
              
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>{formatTime(progressSeconds)} / {formatTime(track.duration_seconds)}</span>
                  <span className="text-primary font-semibold">{progressPercent}% complete</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold text-white line-clamp-2">
                {series.name}
              </h3>
              {series.description && (
                <p className="text-white/70 text-sm line-clamp-2">
                  {series.description}
                </p>
              )}
              <div className="flex items-center gap-3 text-sm text-white/60">
                <span>{series.track_count} episodes</span>
                <span>•</span>
                <span>{formatDuration(series.total_duration, 'short')}</span>
              </div>
            </>
          )}
        </div>

        {/* Play button */}
        <motion.div 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute right-5 bottom-5 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 group-hover:shadow-primary/60 transition-all"
        >
          <Play className="w-6 h-6 text-primary-foreground fill-current ml-0.5" />
        </motion.div>
      </div>
    </motion.div>
  );
}
