import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Headphones, Sparkles, ArrowRight, Clock } from 'lucide-react';
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

  // Badge config with gradients
  const badgeConfig = {
    continue: { label: 'Continue', icon: Play, gradient: 'from-[#FF6631] to-[#FFA300]' },
    latest: { label: 'New', icon: Sparkles, gradient: 'from-amber-500 to-orange-500' },
    featured: { label: 'Featured', icon: Sparkles, gradient: 'from-[#FF6631] to-[#FFA300]' },
    start: { label: 'Start Here', icon: Play, gradient: 'from-emerald-500 to-green-500' },
  };

  const badge = badgeConfig[type];
  const BadgeIcon = badge.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      onClick={handleAction}
      className="relative overflow-hidden rounded-[20px] bg-white border border-[#F0E6DF] cursor-pointer group shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-orange-500/10 transition-all"
    >
      {/* Gradient accent at top */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF6631] via-[#FFA300] to-[#FFB84D]" />

      {/* 16:9 Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden">
        {series.cover_image ? (
          <img
            src={series.cover_image}
            alt={series.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#FF6631]/20 to-[#FFA300]/10 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Headphones className="w-20 h-20 text-[#FF6631]/30" />
            </motion.div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Badge - top left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${badge.gradient} text-white shadow-lg`}
        >
          <BadgeIcon className="w-3.5 h-3.5" />
          <span className="text-xs font-bold uppercase tracking-wide">{badge.label}</span>
        </motion.div>

        {/* Series emoji - top right */}
        {series.icon_name && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="absolute top-3 right-3 text-3xl drop-shadow-lg"
          >
            {series.icon_name}
          </motion.div>
        )}

        {/* Play button - centered on hover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6631] to-[#FFA300] flex items-center justify-center shadow-2xl shadow-orange-500/50">
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          </div>
        </motion.div>

        {/* Mini play button - always visible on mobile */}
        <div className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6631] to-[#FFA300] flex items-center justify-center shadow-xl shadow-orange-500/40 md:hidden">
          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
        </div>
      </div>

      {/* Content section */}
      <div className="p-5 space-y-3">
        {type === 'continue' && track ? (
          <>
            {/* Series name + Track title */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#FF6631] uppercase tracking-wider">
                {series.name}
              </p>
              <h3 className="text-lg font-bold text-[#393939] line-clamp-1 group-hover:text-[#FF6631] transition-colors">
                {track.title}
              </h3>
            </div>

            {/* Progress bar - premium version */}
            <div className="space-y-2">
              <div className="h-2.5 bg-[#F0E6DF] rounded-full overflow-hidden shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#FF6631] to-[#FFA300] rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  {/* Shine effect */}
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ duration: 1.5, delay: 0.8, repeat: Infinity, repeatDelay: 4 }}
                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  />
                </motion.div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8D8D8D] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(progressSeconds)} / {formatTime(track.duration_seconds)}
                </span>
                <span className="text-[#FF6631] font-bold">
                  {progressPercent}%
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Series info for non-continue states */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#393939] line-clamp-1 group-hover:text-[#FF6631] transition-colors">
                {series.name}
              </h3>
              {series.description && (
                <p className="text-sm text-[#8D8D8D] line-clamp-2">
                  {series.description}
                </p>
              )}
            </div>

            {/* Meta info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-[#8D8D8D]">
                <span className="font-semibold text-[#393939]">{series.track_count} episodes</span>
                <span>•</span>
                <span>{formatDuration(series.total_duration, 'short')}</span>
              </div>

              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                className="flex items-center gap-1 text-[#FF6631] font-semibold text-sm"
              >
                Start <ArrowRight className="w-4 h-4" />
              </motion.div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
