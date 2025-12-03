import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Headphones, Sparkles, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/Layout/MainLayout';
import { AudioSeriesCard } from '@/components/audio/AudioSeriesCard';
import { useAudioSeries } from '@/hooks/useAudioSeries';
import { useUserProducts } from '@/hooks/useUserProducts';
import type { AudioSeries } from '@/stores/audioPlayerStore';

const PREMIUM_CHECKOUT_URL = 'https://gtmsinop.mycartpanda.com/checkout/203914365:1';

export default function Listen() {
  const { data: allSeries = [], isLoading } = useAudioSeries();
  const { hasUnlock, isLoading: isLoadingProducts } = useUserProducts();
  const navigate = useNavigate();

  // Separate series by type (O(n) complexity)
  const { premiumSeries, freeSeries } = useMemo(() => {
    const premium: AudioSeries[] = [];
    const free: AudioSeries[] = [];

    allSeries.forEach(series => {
      if (series.unlock_key) {
        premium.push(series);
      } else {
        free.push(series);
      }
    });

    return { premiumSeries: premium, freeSeries: free };
  }, [allSeries]);

  const isSeriesLocked = (s: AudioSeries) => {
    return s.unlock_key ? !hasUnlock(s.unlock_key) : false;
  };

  const handlePremiumUnlock = () => {
    window.open(PREMIUM_CHECKOUT_URL, '_blank', 'noopener,noreferrer');
  };

  if (isLoading || isLoadingProducts) {
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
            <div className="space-y-2">
              <div className="h-8 w-48 bg-muted animate-pulse rounded" />
              <div className="h-4 w-64 bg-muted animate-pulse rounded" />
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-3xl" />
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

          {/* Premium Hero Section */}
          {premiumSeries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              {/* Featured Badge */}
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#D4A574]" />
                <span className="text-sm font-semibold text-[#D4A574]">
                  Premium Content
                </span>
              </div>

              {/* Premium Series Cards */}
              <div className="space-y-4">
                {premiumSeries.map((series) => {
                  const locked = isSeriesLocked(series);
                  return (
                    <AudioSeriesCard
                      key={series.id}
                      series={series}
                      isLocked={locked}
                      onClick={() => navigate(`/listen/${series.slug}`)}
                      onLockedClick={handlePremiumUnlock}
                    />
                  );
                })}
              </div>

              {/* Inline Upsell CTA (only if any premium is locked) */}
              {premiumSeries.some(s => isSeriesLocked(s)) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-[#D4A574]/10 to-transparent border border-[#D4A574]/20"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#D4A574]/20 flex items-center justify-center">
                      <Play className="w-5 h-5 text-[#D4A574]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-foreground mb-1">
                        Unlock Full Audio Library
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        Get instant access to all premium audio series + bonus content
                      </p>
                      <button
                        onClick={handlePremiumUnlock}
                        className="text-xs font-medium text-[#D4A574] hover:text-[#B8864A] transition-colors"
                      >
                        Learn more →
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Free Content Section */}
          {freeSeries.length > 0 && (
            <div className="space-y-4">
              {premiumSeries.length > 0 && (
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground">
                    Free Series
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    ({freeSeries.length})
                  </span>
                </div>
              )}

              <div className="space-y-4">
                {freeSeries.map((series, index) => (
                  <motion.div
                    key={series.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <AudioSeriesCard
                      series={series}
                      isLocked={false}
                      onClick={() => navigate(`/listen/${series.slug}`)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!allSeries.length && !isLoading && (
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
        </div>
      </div>
    </MainLayout>
  );
}
