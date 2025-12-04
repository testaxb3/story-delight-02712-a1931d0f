import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Play, Clock, Download, Heart, Share2, ChevronDown } from 'lucide-react';
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
          className="min-h-screen bg-background"
          style={{
            paddingTop: 'max(1.5rem, calc(env(safe-area-inset-top) + 1rem))',
            paddingBottom: 'max(6rem, calc(env(safe-area-inset-bottom) + 4rem))',
          }}
        >
          <div className="max-w-2xl mx-auto px-6 space-y-8">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-48 bg-muted animate-pulse rounded-2xl" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />
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
          className="min-h-screen bg-background"
          style={{
            paddingTop: 'max(1.5rem, calc(env(safe-area-inset-top) + 1rem))',
            paddingBottom: 'max(6rem, calc(env(safe-area-inset-bottom) + 4rem))',
          }}
        >
          <div className="max-w-2xl mx-auto px-6 space-y-8">
            <button
              onClick={() => navigate('/listen')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Series</span>
            </button>
            <div className="text-center py-12">
              <p className="text-muted-foreground">Series not found</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div 
        className="min-h-screen bg-background"
        style={{
          paddingBottom: 'max(6rem, calc(env(safe-area-inset-bottom) + 4rem))',
        }}
      >
        {/* Immersive Header with Cover Blur */}
        <div className="relative overflow-hidden">
          {/* Background: Blurred cover image with clean transition */}
          <div className="absolute inset-0">
            {series.cover_image ? (
              <>
                <img
                  src={series.cover_image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover scale-125"
                  style={{ filter: 'blur(50px) brightness(0.4)' }}
                />
                {/* Clean gradient - ends in pure white for light mode, pure black for dark mode */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-white dark:to-black" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-muted/80 via-muted/60 to-background" />
            )}
          </div>

          {/* Header Content */}
          <div 
            className="relative z-20 px-6 pb-6"
            style={{
              paddingTop: 'max(1.5rem, calc(env(safe-area-inset-top) + 1rem))',
            }}
          >
            {/* Back button - White with shadow for legibility */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate('/listen')}
              className="flex items-center gap-2 text-white hover:text-white/80 transition-colors mb-6 -ml-2"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-semibold">Back</span>
            </motion.button>

            {/* Series info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-5"
            >
              {/* Cover image - Sharp */}
              {series.cover_image && (
                <motion.img
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={series.cover_image}
                  alt={series.name}
                  className="w-28 h-28 rounded-2xl object-cover shadow-2xl flex-shrink-0"
                />
              )}

              <div className="flex-1 min-w-0">
                {/* Icon */}
                {series.icon_name && (
                  <span className="text-2xl drop-shadow-md">{series.icon_name}</span>
                )}
                
                {/* Title - Clean White */}
                <h1 
                  className="text-xl font-bold text-white leading-tight mt-1"
                >
                  {series.name}
                </h1>

                {/* Stats */}
                <div 
                  className="flex items-center gap-4 text-sm text-white/90 mt-2 font-medium"
                >
                  <div className="flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5" />
                    <span>{series.track_count} episodes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDuration(series.total_duration, 'long')}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Description - Compact with expand option */}
            {series.description && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mt-4 relative z-20"
              >
                <p 
                  className={`text-sm text-white/90 leading-relaxed font-medium ${!isDescriptionExpanded ? 'line-clamp-2' : ''}`}
                >
                  {series.description}
                </p>
                {series.description.length > 100 && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="flex items-center gap-1 text-xs text-white hover:text-white/80 mt-1 transition-colors font-semibold"
                  >
                    <span>{isDescriptionExpanded ? 'Show less' : 'Show more'}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isDescriptionExpanded ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </motion.div>
            )}

            {/* Play All button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              onClick={handlePlayAll}
              disabled={!tracks || tracks.length === 0}
              whileTap={{ scale: 0.98 }}
              className="w-full h-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 mt-8 shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed relative z-20"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Play All</span>
            </motion.button>

            {/* Action Bar - Adapts to theme properly */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-10 mt-6 relative z-20"
            >
              <button className="flex flex-col items-center gap-2 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white/80 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-gray-300 dark:group-hover:bg-white/30 transition-all shadow-md">
                  <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-xs font-semibold">Download</span>
              </button>

              <button className="flex flex-col items-center gap-2 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white/80 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-gray-300 dark:group-hover:bg-white/30 transition-all shadow-md">
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-xs font-semibold">Save</span>
              </button>

              <button
                onClick={handleShare}
                className="flex flex-col items-center gap-2 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white/80 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-gray-300 dark:group-hover:bg-white/30 transition-all shadow-md">
                  <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-xs font-semibold">Share</span>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Track list - Clean background with safe padding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="px-6 pt-6 pb-32 bg-background"
        >
          {/* Section header */}
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Episodes
          </h2>

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
