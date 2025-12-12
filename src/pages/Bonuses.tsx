import { useState, useCallback, memo, useMemo } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { Play, X, Loader2, Book, Video, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OptimizedYouTubePlayer } from "@/components/VideoPlayer/OptimizedYouTubePlayer";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { BonusData } from "@/types/bonus";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

// New Premium Components
import { HeroCarousel } from "@/components/bonuses/HeroCarousel";
import { CollectionShelf } from "@/components/bonuses/CollectionShelf";
import { EbookShelf } from "@/components/bonuses/EbookShelf";
import { QuickBitesShelf } from "@/components/bonuses/QuickBitesShelf";
import { ContinueLearning } from "@/components/bonuses/ContinueLearning";
import { useBonusesByCollection } from "@/hooks/useVideoCollections";

// Sticky Filter Pills
const FilterPills = memo(function FilterPills({
  active,
  onChange,
  counts,
}: {
  active: string;
  onChange: (id: string) => void;
  counts: { all: number; video: number; ebook: number };
}) {
  const filters = [
    { id: 'all', label: 'Discover', icon: Layers, count: counts.all },
    { id: 'video', label: 'Videos', icon: Video, count: counts.video },
    { id: 'ebook', label: 'Ebooks', icon: Book, count: counts.ebook },
  ];

  return (
    <div className="sticky top-0 z-40 px-5 py-3 -mx-5 backdrop-blur-xl bg-background/80 border-b border-border/50 overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 w-max">
        {filters.map(f => {
          const Icon = f.icon;
          return (
            <button
              key={f.id}
              onClick={() => onChange(f.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border",
                active === f.id
                  ? "bg-foreground text-background border-foreground shadow-lg"
                  : "bg-card text-muted-foreground border-border hover:bg-secondary/80 hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {f.label}
              <span className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-bold",
                active === f.id ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"
              )}>
                {f.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

function BonusesPremiumContent() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");

  // Video Player State
  const [playingBonus, setPlayingBonus] = useState<BonusData | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Fetch data organized by collections
  const { data, isLoading, error } = useBonusesByCollection();

  // Derived data
  const { heroItems, quickBites, collections, ebooks, inProgress, counts } = useMemo(() => {
    if (!data) return {
      heroItems: [],
      quickBites: [],
      collections: [],
      ebooks: [],
      inProgress: [],
      counts: { all: 0, video: 0, ebook: 0 },
    };

    const allVideos = data.collections.flatMap(c => c.bonuses).concat(data.uncategorized);

    // Hero items: featured + newest videos
    const hero = data.featured ? [data.featured] : [];
    if (hero.length < 3) {
      const moreVideos = allVideos
        .filter(v => v.id !== data.featured?.id && v.thumbnail)
        .slice(0, 3 - hero.length);
      hero.push(...moreVideos);
    }

    // Quick bites: videos under 5 minutes
    const quickBitesCollection = data.collections.find(c => c.slug === 'quick-bites');
    const quick = quickBitesCollection?.bonuses || [];

    // In progress
    const progress = [...allVideos, ...data.ebooks].filter(b => b.progress && b.progress > 0 && b.progress < 100);

    return {
      heroItems: hero,
      quickBites: quick,
      collections: data.collections.filter(c => c.slug !== 'quick-bites'),
      ebooks: data.ebooks,
      inProgress: progress,
      counts: {
        all: allVideos.length + data.ebooks.length,
        video: allVideos.length,
        ebook: data.ebooks.length,
      },
    };
  }, [data]);

  // Handle bonus action (play video or open ebook)
  const handleBonusAction = useCallback(async (bonus: BonusData) => {
    if (bonus.category === 'video') {
      const videoUrl = bonus.videoUrl || bonus.viewUrl;
      if (videoUrl && /(?:youtube\.com|youtu\.be)/.test(videoUrl)) {
        setPlayingBonus({ ...bonus, videoUrl });
        return;
      }
    }

    if (bonus.category === 'ebook') {
      if (bonus.viewUrl) {
        navigate(bonus.viewUrl);
        return;
      }
      // Try to find linked ebook
      const { data } = await supabase
        .from('ebooks')
        .select('slug')
        .eq('bonus_id', bonus.id)
        .single();
      if (data?.slug) {
        navigate(`/ebook/${data.slug}`);
        return;
      }
    }

    if (bonus.viewUrl) navigate(bonus.viewUrl);
    else if (bonus.downloadUrl) window.open(bonus.downloadUrl, '_blank');
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center p-5">
          <div className="text-center">
            <p className="text-destructive mb-2">Failed to load content</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Filter content based on active filter
  const showHero = activeFilter === 'all';
  const showVideos = activeFilter === 'all' || activeFilter === 'video';
  const showEbooks = activeFilter === 'all' || activeFilter === 'ebook';

  return (
    <MainLayout>
      <div className="min-h-screen bg-background pb-32 relative overflow-x-hidden">
        {/* Hero Carousel - Only on "all" tab */}
        {showHero && heroItems.length > 0 && (
          <HeroCarousel items={heroItems} onAction={handleBonusAction} />
        )}

        {/* Main Content */}
        <main className={cn(
          "relative z-10",
          !showHero && "pt-[calc(env(safe-area-inset-top)+20px)]"
        )}>
          {/* Sticky Filter */}
          <div className="px-5">
            <FilterPills active={activeFilter} onChange={setActiveFilter} counts={counts} />
          </div>

          {/* Continue Learning */}
          {inProgress.length > 0 && (
            <div className="px-5 mt-4">
              <ContinueLearning
                inProgressBonuses={inProgress}
                onContinue={handleBonusAction}
              />
            </div>
          )}

          {/* Ebooks Shelf */}
          {showEbooks && ebooks.length > 0 && (
            <div className="mt-6">
              <EbookShelf
                title="Read & Reflect"
                items={ebooks}
                onSelect={handleBonusAction}
                onSeeAll={() => setActiveFilter('ebook')}
              />
            </div>
          )}

          {/* Quick Bites */}
          {showVideos && quickBites.length > 0 && (
            <div className="mt-6">
              <QuickBitesShelf items={quickBites} onSelect={handleBonusAction} />
            </div>
          )}

          {/* Video Collections */}
          {showVideos && collections.map(collection => (
            <CollectionShelf
              key={collection.id}
              title={collection.name}
              slug={collection.slug}
              iconName={collection.icon_name}
              items={collection.bonuses}
              onSelect={handleBonusAction}
            />
          ))}

          {/* Uncategorized Videos (if any) */}
          {showVideos && data?.uncategorized && data.uncategorized.length > 0 && (
            <CollectionShelf
              title="More Videos"
              items={data.uncategorized}
              onSelect={handleBonusAction}
              showSeeAll={false}
            />
          )}

          {/* Empty State */}
          {!isLoading && counts.all === 0 && (
            <div className="px-5 py-20 text-center">
              <p className="text-muted-foreground">No content available yet.</p>
            </div>
          )}
        </main>

        {/* Immersive Video Player Modal */}
        <Dialog open={!!playingBonus} onOpenChange={(open) => !open && setPlayingBonus(null)}>
          <DialogContent className="w-screen h-screen max-w-none m-0 p-0 border-0 bg-black" style={{ zIndex: 9999 }}>
            {playingBonus && (
              <div className="relative h-full flex flex-col">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPlayingBonus(null)}
                  className="absolute right-4 top-[env(safe-area-inset-top)] z-[100] bg-black/50 hover:bg-black/80 text-white rounded-full w-12 h-12 mt-4"
                >
                  <X className="w-6 h-6" />
                </Button>
                <div className="flex-1 bg-black flex items-center justify-center">
                  <OptimizedYouTubePlayer
                    videoUrl={playingBonus.videoUrl || ''}
                    videoId={playingBonus.id}
                    playbackRate={playbackRate}
                    onPlaybackRateChange={setPlaybackRate}
                  />
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}

export default function Bonuses() {
  return (
    <ErrorBoundary>
      <BonusesPremiumContent />
    </ErrorBoundary>
  );
}
