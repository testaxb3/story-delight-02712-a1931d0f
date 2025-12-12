import { useState, useMemo, useEffect, useCallback, memo } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Play, Sparkles, X, Clock, ArrowRight, Book, Wrench, Gift, Video, BookOpen, Compass, Star } from "lucide-react";
import { useBonuses } from "@/hooks/useBonuses";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OptimizedYouTubePlayer } from "@/components/VideoPlayer/OptimizedYouTubePlayer";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { BonusData } from "@/types/bonus";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { ContinueLearning } from "@/components/bonuses/ContinueLearning";

// --- PREMIUM HERO COMPONENT ---
const BonusesHero = memo(({ items, onPlay }: { items: BonusData[]; onPlay: (b: BonusData) => void }) => {
  if (!items.length) return null;
  const featured = items[0];
  const isEbook = featured.category === 'ebook';

  const getActionLabel = (cat: string) => {
    switch (cat) {
      case 'video': return 'Watch Now';
      case 'ebook': return 'Read Now';
      case 'tool': return 'Open Tool';
      case 'template': return 'Use Template';
      default: return 'Open Now';
    }
  };

  const getActionIcon = (cat: string) => {
    switch (cat) {
      case 'video': return Play;
      case 'ebook': return Book;
      case 'tool': case 'template': return Wrench;
      default: return Sparkles;
    }
  };

  const Icon = getActionIcon(featured.category);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full aspect-[4/5] sm:aspect-[16/10] lg:aspect-video overflow-hidden mb-0 group cursor-pointer"
      onClick={() => onPlay(featured)}
    >
      {/* Animated Background Layer */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src={featured.thumbnail || ""}
          alt={featured.title}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105",
            isEbook && "blur-3xl scale-125 opacity-50"
          )}
        />

        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

        {/* Animated particles/sparkles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full"
              initial={{
                x: Math.random() * 100 + "%",
                y: "100%",
                opacity: 0
              }}
              animate={{
                y: "-20%",
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>

      {/* Content Layer */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 pb-[calc(2rem+env(safe-area-inset-bottom))]">
        <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">

          {/* Ebook Cover (Floating 3D Effect) */}
          {isEbook && (
            <motion.div
              initial={{ opacity: 0, y: 30, rotateY: -15 }}
              animate={{ opacity: 1, y: 0, rotateY: -5 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              whileHover={{ rotateY: 0, scale: 1.05 }}
              className="w-[140px] sm:w-[180px] aspect-[3/4] rounded-lg shadow-2xl overflow-hidden border-2 border-white/20 flex-shrink-0 mb-2 sm:-mb-2"
              style={{
                transformStyle: "preserve-3d",
                boxShadow: "20px 20px 60px rgba(0,0,0,0.5), -5px -5px 20px rgba(255,255,255,0.1)"
              }}
            >
              <img
                src={featured.thumbnail || ""}
                alt={featured.title}
                className="w-full h-full object-fill"
              />
              {/* Book spine effect */}
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/40 to-transparent" />
            </motion.div>
          )}

          {/* Text Content */}
          <div className="flex-1">
            {/* Featured Badge */}
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-400/30 text-xs font-bold text-amber-300 mb-3 uppercase tracking-widest"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </motion.div>
              Featured Bonus
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-5xl font-black text-white mb-3 leading-tight drop-shadow-lg line-clamp-2 sm:line-clamp-none"
            >
              {featured.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-sm sm:text-base line-clamp-2 mb-5 max-w-lg drop-shadow-md"
            >
              {featured.description}
            </motion.p>

            {/* Premium CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative rounded-full bg-gradient-to-r from-[#FF6631] to-[#FFA300] text-white font-bold px-8 h-14 shadow-xl shadow-orange-500/40 flex items-center gap-3 overflow-hidden group/btn"
              >
                {/* Shine effect */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                />
                <Icon className="w-5 h-5 fill-current relative z-10" />
                <span className="relative z-10">{getActionLabel(featured.category)}</span>
                <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover/btn:translate-x-1" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </motion.div>
  );
});

// --- PREMIUM FILTER BAR ---
const BonusesFilter = memo(({ active, onChange }: { active: string; onChange: (id: string) => void }) => {
  const categories = [
    { id: 'all', label: 'Discover', icon: Compass },
    { id: 'video', label: 'Watch', icon: Video },
    { id: 'ebook', label: 'Read', icon: BookOpen },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 px-5 py-4 -mx-5 backdrop-blur-xl bg-background/80 border-b border-[#E8E8E6]/50 mb-6 overflow-x-auto scrollbar-hide"
    >
      <div className="flex gap-3 w-max">
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          const isActive = active === cat.id;

          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(cat.id)}
              className={cn(
                "relative px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2",
                isActive
                  ? "bg-gradient-to-r from-[#FF6631] to-[#FFA300] text-white shadow-lg shadow-orange-500/30"
                  : "bg-white/80 text-[#666] border border-[#E8E8E6] hover:border-[#FF6631]/30 hover:bg-[#FFF5ED]"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-[#FF6631]")} />
              {cat.label}

              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
});

// --- PREMIUM SHELF COMPONENT ---
const BonusesShelf = memo(({ title, items, type, onSelect }: { title: string; items: BonusData[]; type: 'video' | 'book' | 'tool'; onSelect: (b: BonusData) => void }) => {
  if (!items.length) return null;

  const getShelfIcon = () => {
    switch (type) {
      case 'video': return Video;
      case 'book': return BookOpen;
      default: return Gift;
    }
  };

  const Icon = getShelfIcon();

  return (
    <section className="mb-10">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex items-center justify-between px-5 mb-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#FF6631] to-[#FFA300] flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#393939]">{title}</h3>
            <p className="text-xs text-[#8D8D8D]">{items.length} item{items.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <motion.button
          whileHover={{ x: 4 }}
          className="text-sm font-semibold text-[#FF6631] flex items-center gap-1"
        >
          See all
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>

      {/* Horizontal scroll container */}
      <div className="flex gap-4 overflow-x-auto pb-4 px-5 scrollbar-hide snap-x snap-mandatory">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "50px" }}
            transition={{ delay: idx * 0.05, duration: 0.4 }}
            whileHover={{ y: -8 }}
            onClick={() => onSelect(item)}
            className={cn(
              "snap-center shrink-0 group cursor-pointer relative",
              (item.category === 'ebook' || type === 'book') ? "w-[160px]" :
                type === 'video' ? "w-[280px]" : "w-[160px]"
            )}
          >
            {/* Thumbnail with premium styling */}
            <div className={cn(
              "relative overflow-hidden bg-white transition-all duration-500 group-hover:shadow-2xl",
              (item.category === 'ebook' || type === 'book')
                ? "aspect-[3/4] rounded-[14px] shadow-lg border border-[#E8E8E6]"
                : "aspect-video rounded-[16px] shadow-md border border-[#E8E8E6]"
            )}>
              <img
                src={item.thumbnail || "/placeholder.svg"}
                alt={item.title}
                className={cn(
                  "absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-110",
                  (item.category === 'ebook' || type === 'book') ? "object-fill" : "object-cover"
                )}
                loading="lazy"
              />

              {/* Video play overlay */}
              {type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF6631] to-[#FFA300] flex items-center justify-center shadow-lg shadow-orange-500/40"
                  >
                    <Play className="w-6 h-6 fill-white text-white ml-1" />
                  </motion.div>
                </div>
              )}

              {/* Book 3D effect */}
              {(item.category === 'ebook' || type === 'book') && (
                <>
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}

              {/* Locked overlay */}
              {item.locked && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                  <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FF6631]/20 to-[#FFA300]/20 backdrop-blur-md text-xs font-bold text-white border border-white/20">
                    🔒 LOCKED
                  </div>
                </div>
              )}

              {/* Duration badge for videos */}
              {type === 'video' && item.duration && (
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/80 text-white text-xs font-medium">
                  {item.duration}
                </div>
              )}
            </div>

            {/* Meta info */}
            <div className="mt-3 px-0.5">
              <h4 className={cn(
                "font-semibold text-[#393939] leading-snug line-clamp-2 group-hover:text-[#FF6631] transition-colors",
                item.category === 'ebook' ? "text-sm" : "text-[15px]"
              )}>
                {item.title}
              </h4>
              {type === 'video' && (
                <p className="text-xs text-[#8D8D8D] mt-1 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {item.duration || 'Video'}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
});

// --- SKELETON LOADING ---
function BonusesSkeleton() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-[#FEFBF9] to-[#FDF8F5]">
        {/* Hero skeleton */}
        <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] lg:aspect-video overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="h-6 w-32 bg-white/20 rounded-full animate-pulse" />
              <div className="h-12 w-3/4 bg-white/20 rounded-lg animate-pulse" />
              <div className="h-6 w-1/2 bg-white/20 rounded-lg animate-pulse" />
              <div className="h-14 w-40 bg-white/30 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Filter skeleton */}
        <div className="px-5 py-4">
          <div className="flex gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 w-24 rounded-full bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>

        {/* Shelf skeleton */}
        <div className="px-5 mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[12px] bg-gray-200 animate-pulse" />
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-[280px] shrink-0">
                <div className="aspect-video bg-gray-200 rounded-[16px] animate-pulse" />
                <div className="h-5 w-3/4 bg-gray-200 rounded mt-3 animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-200 rounded mt-2 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// --- MAIN PAGE LOGIC ---
function BonusesContent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [activeCategory, setActiveCategory] = useState(() => searchParams.get("category") || "all");
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") || "");

  // Player
  const [playingBonus, setPlayingBonus] = useState<BonusData | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Data
  const { data: bonusesResponse, isLoading } = useBonuses({
    category: activeCategory !== "all" ? activeCategory : undefined,
    search: searchQuery.trim() || undefined,
    page: 0,
    pageSize: 100,
  });

  const allBonuses = bonusesResponse?.data || [];

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (activeCategory !== "all") params.set("category", activeCategory);
    setSearchParams(params, { replace: true });
  }, [searchQuery, activeCategory]);

  // Derived Data (Memoized)
  const { featured, shelves } = useMemo(() => {
    if (!allBonuses.length) return { featured: [], shelves: [] };

    const heroItem = allBonuses.find(b => b.tags?.includes('hero')) || allBonuses.find(b => b.isNew) || allBonuses[0];

    const featuredItems = [heroItem];
    const remaining = allBonuses.filter(b => b.id !== heroItem.id);

    const videoShelf = remaining.filter(b => b.category === 'video');
    const bookShelf = remaining.filter(b => b.category === 'ebook');

    return {
      featured: featuredItems,
      shelves: [
        { id: 'videos', title: 'Watch & Learn', items: videoShelf, type: 'video' as const },
        { id: 'books', title: 'Read & Reflect', items: bookShelf, type: 'book' as const },
      ].filter(s => s.items.length > 0)
    };
  }, [allBonuses]);

  // Actions
  const handleBonusAction = useCallback(async (bonus: BonusData) => {
    if (bonus.category === 'video' && (bonus.videoUrl || /(?:youtube\.com|youtu\.be)/.test(bonus.viewUrl || ''))) {
      setPlayingBonus({ ...bonus, videoUrl: bonus.videoUrl || bonus.viewUrl });
      return;
    }
    if (bonus.category === 'ebook') {
      if (bonus.viewUrl) { navigate(bonus.viewUrl); return; }
      const { data } = await supabase.from('ebooks').select('slug').eq('bonus_id', bonus.id).single();
      if (data?.slug) navigate(`/ebook/${data.slug}`);
      return;
    }
    if (bonus.viewUrl) navigate(bonus.viewUrl);
    else if (bonus.downloadUrl) window.open(bonus.downloadUrl, '_blank');
  }, [navigate]);

  if (isLoading) {
    return <BonusesSkeleton />;
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-[#FEFBF9] to-[#FDF8F5] pb-32 relative overflow-x-hidden">
        {/* Hero Section */}
        {activeCategory === 'all' && (
          <BonusesHero items={featured} onPlay={handleBonusAction} />
        )}

        {/* Main Content */}
        <main className={cn("relative z-10", activeCategory !== 'all' ? "pt-[calc(env(safe-area-inset-top)+20px)]" : "")}>
          {/* Sticky Filters */}
          <div className="px-5">
            <BonusesFilter active={activeCategory} onChange={setActiveCategory} />
          </div>

          {/* Continue Learning */}
          <div className="px-5">
            <ContinueLearning
              inProgressBonuses={allBonuses.filter(b => b.progress && b.progress > 0 && b.progress < 100)}
              onContinue={handleBonusAction}
            />
          </div>

          {/* Content Shelves */}
          {shelves.map(shelf => (
            <BonusesShelf
              key={shelf.id}
              title={shelf.title}
              items={shelf.items}
              type={shelf.type}
              onSelect={handleBonusAction}
            />
          ))}

          {/* Empty State */}
          {allBonuses.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-5 py-20 text-center"
            >
              <motion.div
                animate={{ y: [-4, 4, -4], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-24 h-24 mx-auto mb-6 rounded-[20px] bg-gradient-to-br from-[#FF6631] to-[#FFA300] flex items-center justify-center shadow-xl shadow-orange-500/30"
              >
                <Gift className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-[#393939] mb-2">No Bonuses Yet</h3>
              <p className="text-[#8D8D8D] max-w-sm mx-auto">
                Amazing bonus content will appear here soon. Check back later!
              </p>
            </motion.div>
          )}
        </main>

        {/* Immersive Video Player Dialog */}
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
      <BonusesContent />
    </ErrorBoundary>
  );
}