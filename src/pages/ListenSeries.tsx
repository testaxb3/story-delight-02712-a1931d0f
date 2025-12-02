import { motion } from 'framer-motion';
import { ChevronLeft, Play, Clock } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
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

  // Check if user has access to premium tracks
  const hasAccess = !series?.unlock_key || hasUnlock(series.unlock_key);

  const handlePlayAll = () => {
    if (series && tracks && tracks.length > 0) {
      play(tracks[0], series, tracks);
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
          paddingTop: 'max(1.5rem, calc(env(safe-area-inset-top) + 1rem))',
          paddingBottom: 'max(6rem, calc(env(safe-area-inset-bottom) + 4rem))',
        }}
      >
        <div className="max-w-2xl mx-auto px-6 space-y-6">
          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/listen')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors -ml-2"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Series</span>
          </motion.button>

          {/* Series header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-card to-card border border-border/50 backdrop-blur-sm p-6 space-y-4"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
            
            <div className="relative">
              {/* Header with icon and cover */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    {series.icon_name && (
                      <span className="text-3xl">{series.icon_name}</span>
                    )}
                    <h1 className="text-2xl font-bold text-foreground">
                      {series.name}
                    </h1>
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
                    className="w-24 h-24 rounded-2xl object-cover shadow-lg"
                  />
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1.5">
                  <Play className="w-4 h-4" />
                  <span>{series.track_count} episodes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(series.total_duration, 'long')}</span>
                </div>
              </div>

              {/* Play All button */}
              <button
                onClick={handlePlayAll}
                disabled={!tracks || tracks.length === 0}
                className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Play All</span>
              </button>
            </div>
          </motion.div>

          {/* Track list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {series && tracks && (
              <AudioTrackList 
                tracks={tracks} 
                series={series}
                hasAccess={hasAccess}
              />
            )}
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
