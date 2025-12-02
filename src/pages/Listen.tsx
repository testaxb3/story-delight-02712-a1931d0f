import { motion } from 'framer-motion';
import { Headphones } from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { AudioSeriesCard } from '@/components/audio/AudioSeriesCard';
import { AudioTrackList } from '@/components/audio/AudioTrackList';
import { useAudioSeries } from '@/hooks/useAudioSeries';
import { useAudioTracks } from '@/hooks/useAudioTracks';
import { useAudioPlayerStore } from '@/stores/audioPlayerStore';

export default function Listen() {
  const { data: series, isLoading } = useAudioSeries();
  const firstSeries = series?.[0];
  const { data: tracks } = useAudioTracks(firstSeries?.id);
  const { play } = useAudioPlayerStore();

  const handlePlayAll = () => {
    if (firstSeries && tracks && tracks.length > 0) {
      play(tracks[0], firstSeries, tracks);
    }
  };

  if (isLoading) {
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
            {/* Header skeleton */}
            <div className="space-y-2">
              <div className="h-8 w-48 bg-muted animate-pulse rounded" />
              <div className="h-4 w-64 bg-muted animate-pulse rounded" />
            </div>
            
            {/* Series card skeleton */}
            <div className="h-48 bg-muted animate-pulse rounded-2xl" />
            
            {/* Track list skeleton */}
            <div className="space-y-3">
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />
              ))}
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
        <div className="max-w-2xl mx-auto px-6 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 text-primary">
              <Headphones className="w-6 h-6" />
              <h1 className="text-3xl font-bold">Listen & Learn</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Audio guides for mindful parenting
            </p>
          </motion.div>

          {/* Series Card */}
          {firstSeries && (
            <AudioSeriesCard 
              series={firstSeries} 
              onPlay={handlePlayAll}
            />
          )}

          {/* Track List */}
          {firstSeries && tracks && (
            <AudioTrackList 
              tracks={tracks} 
              series={firstSeries}
            />
          )}

          {/* Empty state if no series */}
          {!firstSeries && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                <Headphones className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  No audio series yet
                </h3>
                <p className="text-sm text-muted-foreground">
                  Audio content coming soon
                </p>
              </div>
            </motion.div>
          )}

          {/* Coming Soon Section */}
          {firstSeries && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl bg-muted/30 border border-border/50 p-6 text-center"
            >
              <p className="text-sm text-muted-foreground">
                More audio series coming soon...
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
