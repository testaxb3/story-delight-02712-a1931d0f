import { motion } from 'framer-motion';
import { Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { AmbientBackground } from '@/components/Dashboard/AmbientBackground';
import { AudioSeriesCardPremium } from '@/components/audio/AudioSeriesCardPremium';
import { ContinueListeningCard } from '@/components/audio/ContinueListeningCard';
import { ListenHero } from '@/components/audio/ListenHero';
import { PremiumAudioModal } from '@/components/audio/PremiumAudioModal';
import { useAudioSeries } from '@/hooks/useAudioSeries';
import { useUserProducts } from '@/hooks/useUserProducts';
import { useContinueListening, useAllSeriesProgress } from '@/hooks/useSeriesProgress';
import type { AudioSeries } from '@/stores/audioPlayerStore';

export default function Listen() {
  const { data: series, isLoading } = useAudioSeries();
  const { hasUnlock } = useUserProducts();
  const { data: continueData } = useContinueListening();
  const { data: progressMap } = useAllSeriesProgress();
  const navigate = useNavigate();
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [selectedLockedSeries, setSelectedLockedSeries] = useState<AudioSeries | null>(null);

  const isSeriesLocked = (s: AudioSeries) => {
    return s.unlock_key ? !hasUnlock(s.unlock_key) : false;
  };

  const handleLockedClick = (s: AudioSeries) => {
    setSelectedLockedSeries(s);
    setShowUpsellModal(true);
  };

  // Sort series: FREE first, then premium
  const sortedSeries = series?.slice().sort((a, b) => {
    const aFree = !a.unlock_key;
    const bFree = !b.unlock_key;
    if (aFree && !bFree) return -1;
    if (!aFree && bFree) return 1;
    return (a.display_order || 0) - (b.display_order || 0);
  });

  // Get featured series (first free one with tracks, or first one)
  const featuredSeries = sortedSeries?.find(s => !s.unlock_key && s.track_count > 0) || sortedSeries?.[0] || null;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="relative min-h-screen bg-background overflow-hidden">
          <AmbientBackground />
          <div 
            className="relative z-10"
            style={{
              paddingTop: 'max(1.5rem, calc(env(safe-area-inset-top) + 1rem))',
              paddingBottom: 'max(6rem, calc(env(safe-area-inset-bottom) + 4rem))',
            }}
          >
            <div className="max-w-2xl mx-auto px-6 space-y-6">
              {/* Header skeleton */}
              <div className="space-y-2">
                <div className="h-8 w-48 bg-muted animate-pulse rounded-lg" />
                <div className="h-4 w-64 bg-muted animate-pulse rounded" />
              </div>
              
              {/* Hero skeleton */}
              <div className="h-64 bg-muted animate-pulse rounded-3xl" />
              
              {/* Cards skeleton */}
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-28 bg-muted animate-pulse rounded-2xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="relative min-h-screen bg-background overflow-hidden">
        <AmbientBackground />
        
        <div 
          className="relative z-10"
          style={{
            paddingTop: 'max(1.5rem, calc(env(safe-area-inset-top) + 1rem))',
            paddingBottom: 'max(6rem, calc(env(safe-area-inset-bottom) + 4rem))',
          }}
        >
          <div className="max-w-2xl mx-auto px-6 space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1"
            >
              <div className="flex items-center gap-2 text-primary">
                <Headphones className="w-6 h-6" />
                <h1 className="text-2xl font-bold text-foreground">Listen</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Audio guides for mindful parenting
              </p>
            </motion.div>

            {/* Continue Listening - if user has progress */}
            {continueData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <ContinueListeningCard 
                  track={continueData.track}
                  series={continueData.series}
                  progressSeconds={continueData.progressSeconds}
                />
              </motion.div>
            )}

            {/* Hero - Featured Series (only if no continue listening) */}
            {!continueData && featuredSeries && (
              <ListenHero featuredSeries={featuredSeries} />
            )}

            {/* Section title */}
            {sortedSeries && sortedSeries.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="pt-2"
              >
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  All Series
                </h2>
              </motion.div>
            )}

            {/* Series Grid */}
            <div className="space-y-3">
              {sortedSeries?.map((s, index) => {
                const locked = isSeriesLocked(s);
                const progress = progressMap?.get(s.id);
                
                return (
                  <AudioSeriesCardPremium 
                    key={s.id}
                    series={s}
                    isLocked={locked}
                    progress={progress}
                    index={index}
                    onClick={() => navigate(`/listen/${s.slug}`)}
                    onLockedClick={() => handleLockedClick(s)}
                  />
                );
              })}
            </div>

            {/* Premium Upsell Modal */}
            <PremiumAudioModal 
              isOpen={showUpsellModal}
              onClose={() => setShowUpsellModal(false)}
              series={selectedLockedSeries}
            />

            {/* Empty state */}
            {!series?.length && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 space-y-4"
              >
                <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center">
                  <Headphones className="w-10 h-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    No audio series yet
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Audio content is coming soon. Check back later!
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
