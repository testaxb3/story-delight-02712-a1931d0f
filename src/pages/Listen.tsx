import { motion, AnimatePresence } from 'framer-motion';
import { Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { AmbientBackground } from '@/components/Dashboard/AmbientBackground';
import { AudioSeriesCardPremium } from '@/components/audio/AudioSeriesCardPremium';
import { AudioContextFilters, type AudioFilterCategory } from '@/components/audio/AudioContextFilters';
import { ListenHeroUnified } from '@/components/audio/ListenHeroUnified';
import { QuickReliefCarousel } from '@/components/audio/QuickReliefCarousel';
import { PremiumAudioModal } from '@/components/audio/PremiumAudioModal';
import { useAudioSeries } from '@/hooks/useAudioSeries';
import { useUserProducts } from '@/hooks/useUserProducts';
import { useContinueListening, useAllSeriesProgress, useTotalListeningTime, useSeriesFreeTracksCount } from '@/hooks/useSeriesProgress';
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
  const { data: series, isLoading } = useAudioSeries();
  const { hasUnlock } = useUserProducts();
  const { data: continueData } = useContinueListening();
  const { data: progressMap } = useAllSeriesProgress();
  const { data: totalMinutes } = useTotalListeningTime();
  const { data: freeTracksMap } = useSeriesFreeTracksCount();
  const navigate = useNavigate();
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [selectedLockedSeries, setSelectedLockedSeries] = useState<AudioSeries | null>(null);
  const [activeFilter, setActiveFilter] = useState<AudioFilterCategory>('all');

  const isSeriesLocked = (s: AudioSeries) => {
    return s.unlock_key ? !hasUnlock(s.unlock_key) : false;
  };

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

  // Quick Relief: Series with total_duration < 600 seconds (10 min)
  const quickReliefSeries = useMemo(() => {
    return sortedSeries?.filter(s => (s.total_duration || 0) < 600) || [];
  }, [sortedSeries]);

  // Get featured series (first free one with tracks, or first one)
  const featuredSeries = useMemo(() => {
    return sortedSeries?.find(s => !s.unlock_key && s.track_count > 0) || sortedSeries?.[0] || null;
  }, [sortedSeries]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="relative min-h-screen bg-background overflow-hidden">
          <AmbientBackground />
          <div 
            className="relative z-10"
            style={{
              paddingTop: 'max(1.5rem, calc(env(safe-area-inset-top) + 1rem))',
              paddingBottom: 'max(10rem, calc(env(safe-area-inset-bottom) + 8rem))',
            }}
          >
            <div className="max-w-2xl mx-auto px-4 space-y-6">
              {/* Header skeleton */}
              <div className="space-y-2">
                <div className="h-8 w-48 bg-muted animate-pulse rounded-lg" />
                <div className="h-4 w-64 bg-muted animate-pulse rounded" />
              </div>
              
              {/* Filters skeleton */}
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 w-20 bg-muted animate-pulse rounded-full" />
                ))}
              </div>
              
              {/* Hero skeleton */}
              <div className="h-36 bg-muted animate-pulse rounded-2xl" />
              
              {/* Carousel skeleton */}
              <div className="flex gap-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-24 h-24 bg-muted animate-pulse rounded-xl flex-shrink-0" />
                ))}
              </div>
              
              {/* Cards skeleton */}
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-muted animate-pulse rounded-2xl" />
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
            paddingBottom: 'max(10rem, calc(env(safe-area-inset-bottom) + 8rem))',
          }}
        >
          <div className="max-w-2xl mx-auto px-4 space-y-5">
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

            {/* Context Filters */}
            <AudioContextFilters 
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            {/* Hero Unified (Continue/Featured/Start) */}
            <ListenHeroUnified 
              continueData={continueData}
              featuredSeries={featuredSeries}
              fallbackSeries={sortedSeries?.[0]}
            />

            {/* Quick Relief Carousel (< 10 min series) */}
            {quickReliefSeries.length > 0 && activeFilter === 'all' && (
              <QuickReliefCarousel series={quickReliefSeries} />
            )}

            {/* Section title */}
            {filteredSeries.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="pt-1"
              >
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {activeFilter === 'all' ? 'All Series' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Series`}
                </h2>
              </motion.div>
            )}

            {/* Series Grid - with staggered animation on filter change */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
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
                        index={0} // Remove stagger from card itself since we handle it here
                        freeTracksCount={freeTracksMap?.get(s.id) || 0}
                        onClick={() => navigate(`/listen/${s.slug}`)}
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
        </div>
      </div>
    </MainLayout>
  );
}
