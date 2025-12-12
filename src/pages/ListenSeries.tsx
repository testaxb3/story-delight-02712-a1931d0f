import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Play, Clock, Download, Heart, Share2, ChevronDown, Headphones, Sparkles, Music } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { AudioTrackList } from '@/components/audio/AudioTrackList';
import { useAudioSeriesBySlug } from '@/hooks/useAudioSeries';
import { useAudioTracks } from '@/hooks/useAudioTracks';
import { useAudioPlayerStore } from '@/stores/audioPlayerStore';
import { useUserProducts } from '@/hooks/useUserProducts';
import { formatDuration } from '@/lib/formatters';
import { toast } from 'sonner';

export default function ListenSeries() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: series, isLoading: isLoadingSeries } = useAudioSeriesBySlug(slug);
  const { data: tracks, isLoading: isLoadingTracks } = useAudioTracks(series?.id);
  const { hasUnlock, isLoading: isLoadingProducts } = useUserProducts();
  const { play } = useAudioPlayerStore();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Check if user has access to premium tracks
  const hasAccess = !series?.unlock_key || hasUnlock(series.unlock_key);

  const handlePlayAll = () => {
    if (series && tracks && tracks.length > 0) {
      const accessibleTracks = tracks.filter(t => t.is_preview || hasAccess);

      if (accessibleTracks.length > 0) {
        play(accessibleTracks[0], series, accessibleTracks);
      } else {
        toast.error('Purchase required to play this series');
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share && series) {
      try {
        await navigator.share({
          title: series.name,
          text: series.description || `Check out ${series.name}`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (isLoadingSeries || isLoadingTracks) {
    return (
      <MainLayout>
        <div
          className="min-h-screen bg-gradient-to-b from-[#FEFBF9] to-[#FDF8F5]"
          style={{
            paddingTop: 'max(1.5rem, calc(env(safe-area-inset-top) + 1rem))',
            paddingBottom: 'max(6rem, calc(env(safe-area-inset-bottom) + 4rem))',
          }}
        >
          <div className="max-w-2xl mx-auto px-6 space-y-6">
            {/* Back button skeleton */}
            <div className="h-8 w-20 bg-[#F0E6DF] animate-pulse rounded-full" />

            {/* Cover skeleton */}
            <div className="flex items-start gap-5">
              <div className="w-28 h-28 bg-[#F0E6DF] animate-pulse rounded-[16px]" />
              <div className="flex-1 space-y-3">
                <div className="h-6 w-32 bg-[#F0E6DF] animate-pulse rounded" />
                <div className="h-4 w-48 bg-[#F0E6DF] animate-pulse rounded" />
                <div className="h-4 w-24 bg-[#F0E6DF] animate-pulse rounded" />
              </div>
            </div>

            {/* Button skeleton */}
            <div className="h-12 bg-[#F0E6DF] animate-pulse rounded-full" />

            {/* Tracks skeleton */}
            <div className="space-y-3 pt-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-white border border-[#F0E6DF] animate-pulse rounded-[14px]" />
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!series) {
    return (
      <MainLayout>
        <div
          className="min-h-screen bg-gradient-to-b from-[#FEFBF9] to-[#FDF8F5]"
          style={{
            paddingTop: 'max(1.5rem, calc(env(safe-area-inset-top) + 1rem))',
            paddingBottom: 'max(6rem, calc(env(safe-area-inset-bottom) + 4rem))',
          }}
        >
          <div className="max-w-2xl mx-auto px-6 space-y-8">
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: -4 }}
              onClick={() => navigate('/listen')}
              className="flex items-center gap-2 text-[#8D8D8D] hover:text-[#393939] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-white border border-[#F0E6DF] flex items-center justify-center shadow-sm">
                <ChevronLeft className="w-4 h-4" />
              </div>
              <span className="font-medium">Back to Series</span>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 space-y-4"
            >
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-20 h-20 mx-auto rounded-[20px] bg-gradient-to-br from-[#FF6631]/20 to-[#FFA300]/10 flex items-center justify-center"
              >
                <Headphones className="w-10 h-10 text-[#FF6631]/50" />
              </motion.div>
              <p className="text-[#8D8D8D] font-medium">Series not found</p>
            </motion.div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div
        className="min-h-screen bg-gradient-to-b from-[#FEFBF9] to-[#FDF8F5]"
        style={{
          paddingBottom: 'max(6rem, calc(env(safe-area-inset-bottom) + 4rem))',
        }}
      >
        {/* Immersive Header with Cover */}
        <div className="relative overflow-hidden">
          {/* Background: Blurred cover image */}
          <div className="absolute inset-0">
            {series.cover_image ? (
              <>
                <img
                  src={series.cover_image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover scale-125"
                  style={{ filter: 'blur(60px) brightness(0.5) saturate(1.2)' }}
                />
                {/* Gradient overlay with orange tint */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[#FEFBF9]" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6631]/10 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-[#FF6631]/30 via-[#FFA300]/20 to-[#FEFBF9]" />
            )}
          </div>

          {/* Header Content */}
          <div
            className="relative z-20 px-6 pb-8"
            style={{
              paddingTop: 'max(1.5rem, calc(env(safe-area-inset-top) + 1rem))',
            }}
          >
            {/* Back button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: -4 }}
              onClick={() => navigate('/listen')}
              className="flex items-center gap-2 text-white hover:text-white/80 transition-colors mb-6"
            >
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                <ChevronLeft className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold">Back</span>
            </motion.button>

            {/* Series info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-5"
            >
              {/* Cover image with shadow */}
              {series.cover_image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF6631]/40 to-[#FFA300]/40 rounded-[18px] blur-xl" />
                  <img
                    src={series.cover_image}
                    alt={series.name}
                    className="relative w-28 h-28 rounded-[18px] object-cover shadow-2xl border-2 border-white/20"
                  />
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-[18px] bg-black/30">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                      <Play className="w-5 h-5 text-[#FF6631] fill-[#FF6631] ml-0.5" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex-1 min-w-0">
                {/* Icon */}
                {series.icon_name && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-3xl drop-shadow-lg"
                  >
                    {series.icon_name}
                  </motion.span>
                )}

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl font-bold text-white leading-tight mt-1"
                >
                  {series.name}
                </motion.h1>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="flex items-center gap-4 text-sm text-white/90 mt-2 font-medium"
                >
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                    <Music className="w-3.5 h-3.5" />
                    <span>{series.track_count} episodes</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDuration(series.total_duration, 'long')}</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Description with expand */}
            {series.description && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-5"
              >
                <p className={`text-sm text-white/85 leading-relaxed ${!isDescriptionExpanded ? 'line-clamp-2' : ''}`}>
                  {series.description}
                </p>
                {series.description.length > 100 && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="flex items-center gap-1 text-xs text-white/70 hover:text-white mt-2 transition-colors font-semibold"
                  >
                    <span>{isDescriptionExpanded ? 'Show less' : 'Show more'}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isDescriptionExpanded ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </motion.div>
            )}

            {/* Play All button - Premium */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              onClick={handlePlayAll}
              disabled={!tracks || tracks.length === 0}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full h-14 rounded-full bg-gradient-to-r from-[#FF6631] to-[#FFA300] text-white font-bold flex items-center justify-center gap-3 mt-8 shadow-xl shadow-orange-500/40 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Shine effect */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />
              <Play className="w-5 h-5 fill-current relative z-10" />
              <span className="relative z-10">Play All</span>
              <Sparkles className="w-4 h-4 relative z-10" />
            </motion.button>

            {/* Action Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-8 mt-6"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/25 transition-all shadow-lg">
                  <Download className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold">Download</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/25 transition-all shadow-lg">
                  <Heart className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold">Save</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/25 transition-all shadow-lg">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold">Share</span>
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Track list section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="px-6 pt-6 pb-32"
        >
          {/* Section header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#FF6631]/10 to-[#FFA300]/10 flex items-center justify-center">
              <Music className="w-4.5 h-4.5 text-[#FF6631]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#393939]">Episodes</h2>
              <p className="text-xs text-[#8D8D8D]">{tracks?.length || 0} tracks available</p>
            </div>
          </div>

          {series && tracks && (
            <AudioTrackList
              tracks={tracks}
              series={series}
              hasAccess={hasAccess}
            />
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
}
