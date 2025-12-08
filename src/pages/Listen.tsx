import { motion, AnimatePresence } from 'framer-motion';
import { Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo, useCallback } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { AmbientBackground } from '@/components/Dashboard/AmbientBackground';
import { AudioSeriesCardPremium } from '@/components/audio/AudioSeriesCardPremium';
import { AudioContextFilters, type AudioFilterCategory } from '@/components/audio/AudioContextFilters';
import { ListenHeroUnified } from '@/components/audio/ListenHeroUnified';

import { PremiumAudioModal } from '@/components/audio/PremiumAudioModal';
import { ListenHeader } from '@/components/audio/ListenHeader';
import { ListenSkeleton } from '@/components/audio/ListenSkeleton';
import { PullToRefresh } from '@/components/common/PullToRefresh';
import { useAudioSeries } from '@/hooks/useAudioSeries';
import { useUserProducts } from '@/hooks/useUserProducts';
import { useContinueListening, useAllSeriesProgress, useTotalListeningTime, useSeriesFreeTracksCount } from '@/hooks/useSeriesProgress';
import { useHaptic } from '@/hooks/useHaptic';
import type { AudioSeries } from '@/stores/audioPlayerStore';

// Filter mapping for series names/descriptions
const filterKeywords: Record<AudioFilterCategory, string[]> = {
  all: [],
  understanding: ['understanding', 'profile', 'brain', 'child'],
  bedtime: ['bedtime', 'sleep', 'night', 'dream'],
  screens: ['screen', 'device', 'phone', 'tablet', 'digital'],
  calm: ['calm', 'parent', 'regulation', 'stress', 'reset'],
  premium: [], // Special case: filter by unlock_key
};

export default function Listen() {
  const { data: series, isLoading, refetch: refetchSeries } = useAudioSeries();
  const { hasUnlock } = useUserProducts();
  const { data: continueData, refetch: refetchContinue } = useContinueListening();
  const { data: progressMap, refetch: refetchProgress } = useAllSeriesProgress();
  const { data: totalMinutes, refetch: refetchTime } = useTotalListeningTime();
  const { data: freeTracksMap } = useSeriesFreeTracksCount();
  const navigate = useNavigate();
  const { triggerHaptic } = useHaptic();
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [selectedLockedSeries, setSelectedLockedSeries] = useState<AudioSeries | null>(null);
  const [activeFilter, setActiveFilter] = useState<AudioFilterCategory>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isSeriesLocked = (s: AudioSeries) => {
    return s.unlock_key ? !hasUnlock(s.unlock_key) : false;
  };

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    triggerHaptic('medium');
    try {
      await Promise.all([
        refetchSeries?.(),
        refetchContinue?.(),
        refetchProgress?.(),
        refetchTime?.(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchSeries, refetchContinue, refetchProgress, refetchTime, triggerHaptic]);

  // Sort series: FREE first, then premium
  const sortedSeries = useMemo(() => {
    return series?.slice().sort((a, b) => {
      const aFree = !a.unlock_key;
      const bFree = !b.unlock_key;
      if (aFree && !bFree) return -1;
      if (!aFree && bFree) return 1;
      return (a.display_order || 0) - (b.display_order || 0);
    });
  }, [series]);

  // Filter series based on active filter
  const filteredSeries = useMemo(() => {
    if (!sortedSeries) return [];
    if (activeFilter === 'all') return sortedSeries;

    if (activeFilter === 'premium') {
      return sortedSeries.filter(s => !!s.unlock_key);
    }

    const keywords = filterKeywords[activeFilter];
    return sortedSeries.filter(s => {
      const searchText = `${s.name} ${s.description || ''}`.toLowerCase();
      return keywords.some(kw => searchText.includes(kw));
    });
  }, [sortedSeries, activeFilter]);


  // Get featured series (first free one with tracks, or first one)
  const featuredSeries = useMemo(() => {
    return sortedSeries?.find(s => !s.unlock_key && s.track_count > 0) || sortedSeries?.[0] || null;
  }, [sortedSeries]);

  // Get latest series (highest display_order = most recently added)
  const latestSeries = useMemo(() => {
    if (!series?.length) return null;
    return [...series].sort((a, b) => 
      (b.display_order || 0) - (a.display_order || 0)
    )[0];
  }, [series]);

  // Calculate completed series count
  const completedSeriesCount = useMemo(() => {
    if (!progressMap) return 0;
    let count = 0;
    progressMap.forEach((progress) => {
      if (progress.percent === 100) count++;
    });
    return count;
  }, [progressMap]);

  if (isLoading) {
    return (
      <MainLayout>
        <ListenSkeleton />
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
            paddingBottom: 'max(7rem, calc(env(safe-area-inset-bottom) + 5rem))',
          }}
        >
          <PullToRefresh onRefresh={handleRefresh} disabled={isRefreshing}>
            <div className="max-w-2xl mx-auto px-4 space-y-5">
              {/* Enhanced Header with Stats */}
              <ListenHeader
                totalMinutes={totalMinutes || 0}
                seriesCount={series?.length || 0}
                completedSeries={completedSeriesCount}
                currentStreak={0}
              />

              {/* Context Filters */}
              <AudioContextFilters
                activeFilter={activeFilter}
                onFilterChange={(filter) => {
                  triggerHaptic('light');
                  setActiveFilter(filter);
                }}
              />

              {/* Hero Unified (Continue/Latest/Featured/Start) */}
              <ListenHeroUnified
                continueData={continueData}
                latestSeries={latestSeries}
                featuredSeries={featuredSeries}
                fallbackSeries={sortedSeries?.[0]}
              />


              {/* Section title */}
              {filteredSeries.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="pt-1 flex items-center justify-between"
                >
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    {activeFilter === 'all' ? 'All Series' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Series`}
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {filteredSeries.length} {filteredSeries.length === 1 ? 'series' : 'series'}
                  </span>
                </motion.div>
              )}

              {/* Series Grid - YouTube style with larger cards */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFilter}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                  {filteredSeries.map((s, index) => {
                    const locked = isSeriesLocked(s);
                    const progress = progressMap?.get(s.id);

                    return (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                      >
                        <AudioSeriesCardPremium
                          series={s}
                          isLocked={locked}
                          progress={progress}
                          index={0}
                          freeTracksCount={freeTracksMap?.get(s.id) || 0}
                          onClick={() => {
                            triggerHaptic('light');
                            navigate(`/listen/${s.slug}`);
                          }}
                        />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              {/* Empty state for filtered results */}
              {filteredSeries.length === 0 && activeFilter !== 'all' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 space-y-3"
                >
                  <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                    <Headphones className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-foreground">
                      No series found
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Try selecting a different category
                    </p>
                  </div>
                </motion.div>
              )}

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
          </PullToRefresh>
        </div>
      </div>
    </MainLayout>
  );
}
