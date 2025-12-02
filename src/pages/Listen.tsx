import { motion } from 'framer-motion';
import { Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { AudioSeriesCard } from '@/components/audio/AudioSeriesCard';
import { PremiumAudioModal } from '@/components/audio/PremiumAudioModal';
import { useAudioSeries } from '@/hooks/useAudioSeries';
import { useUserProducts } from '@/hooks/useUserProducts';
import type { AudioSeries } from '@/stores/audioPlayerStore';

export default function Listen() {
  const { data: series, isLoading } = useAudioSeries();
  const { hasUnlock, isLoading: isLoadingProducts } = useUserProducts();
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
            
            {/* Series cards skeleton */}
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

          {/* Series Grid */}
          <div className="space-y-4">
            {series?.map((s) => (
              <AudioSeriesCard 
                key={s.id}
                series={s}
                isLocked={isSeriesLocked(s)}
                onClick={() => !isSeriesLocked(s) && navigate(`/listen/${s.slug}`)}
                onLockedClick={() => handleLockedClick(s)}
              />
            ))}
          </div>

          {/* Premium Upsell Modal */}
          <PremiumAudioModal 
            isOpen={showUpsellModal}
            onClose={() => setShowUpsellModal(false)}
            series={selectedLockedSeries}
          />

          {/* Empty state if no series */}
          {!series?.length && !isLoading && (
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
