import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Sparkles, Music } from 'lucide-react';
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
      <div className="relative min-h-screen bg-gradient-to-b from-[#FEFBF9] to-[#FDF8F5] overflow-hidden">
        <AmbientBackground />

        <div
          className="relative z-10"
          style={{
            paddingTop: 'max(1.5rem, calc(env(safe-area-inset-top) + 1rem))',
            paddingBottom: 'max(9rem, calc(env(safe-area-inset-bottom) + 7rem))',
          }}
        >
          <PullToRefresh onRefresh={handleRefresh} disabled={isRefreshing}>
            <div className="max-w-2xl mx-auto px-5 space-y-6">
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
                  className="pt-2 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6631]/10 to-[#FFA300]/10 flex items-center justify-center">
                      <Music className="w-4 h-4 text-[#FF6631]" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-[#393939]">
                        {activeFilter === 'all' ? 'All Series' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Series`}
                      </h2>
                      <p className="text-xs text-[#8D8D8D]">
                        {filteredSeries.length} {filteredSeries.length === 1 ? 'series' : 'series'} available
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Series Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFilter}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16 space-y-4"
                >
                  <motion.div
                    animate={{ y: [-4, 4, -4], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-[#FF6631]/20 to-[#FFA300]/10 mx-auto flex items-center justify-center"
                  >
                    <Headphones className="w-10 h-10 text-[#FF6631]/50" />
                  </motion.div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[#393939]">
                      No series found
                    </h3>
                    <p className="text-sm text-[#8D8D8D]">
                      Try selecting a different category
                    </p>
                  </div>
                  <motion.div
                    className="flex justify-center gap-2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#FF6631]" />
                    <span className="w-2 h-2 rounded-full bg-[#FFA300]" />
                    <span className="w-2 h-2 rounded-full bg-[#FFB84D]" />
                  </motion.div>
                </motion.div>
              )}

              {/* Premium Upsell Modal */}
              <PremiumAudioModal
                isOpen={showUpsellModal}
                onClose={() => setShowUpsellModal(false)}
                series={selectedLockedSeries}
              />

              {/* Empty state - no series at all */}
              {!series?.length && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20 space-y-4"
                >
                  <motion.div
                    animate={{ y: [-8, 8, -8], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="relative w-28 h-28 mx-auto"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF6631]/30 to-[#FFA300]/30 rounded-[24px] blur-xl" />
                    <div className="relative w-full h-full rounded-[24px] bg-gradient-to-br from-[#FF6631] to-[#FFA300] flex items-center justify-center shadow-xl shadow-orange-500/30">
                      <Headphones className="w-14 h-14 text-white" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-2 -right-2"
                    >
                      <Sparkles className="w-6 h-6 text-[#FFA300]" />
                    </motion.div>
                  </motion.div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#393939]">
                      No audio series yet
                    </h3>
                    <p className="text-sm text-[#8D8D8D] max-w-xs mx-auto">
                      Audio content is coming soon. Check back later for amazing guided sessions!
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
