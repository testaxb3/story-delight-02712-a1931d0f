import { useState, useMemo, useEffect, useRef, useCallback, memo } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Play, Sparkles, X, Clock, ArrowRight, Loader2, ChevronRight, Book, Wrench } from "lucide-react";
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

// --- ATOMIC COMPONENTS ---

// 1. HERO CAROUSEL (Cinematic)
const BonusesHero = memo(({ items, onPlay }: { items: BonusData[]; onPlay: (b: BonusData) => void }) => {
  if (!items.length) return null;
  const featured = items[0]; 
  const isEbook = featured.category === 'ebook';

  const getActionLabel = (cat: string) => {
    switch(cat) {
      case 'video': return 'Watch Now';
      case 'ebook': return 'Read Now';
      case 'tool': return 'Open Tool';
      case 'template': return 'Use Template';
      default: return 'Open Now';
    }
  };

  const getActionIcon = (cat: string) => {
    switch(cat) {
      case 'video': return Play;
      case 'ebook': return Book;
      case 'tool': case 'template': return Wrench;
      default: return Sparkles;
    }
  };

  const Icon = getActionIcon(featured.category);

  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-video overflow-hidden mb-0 group cursor-pointer" onClick={() => onPlay(featured)}>
      {/* Background Layer */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={featured.thumbnail || ""} 
          alt={featured.title} 
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105",
            isEbook && "blur-3xl scale-125 opacity-50" // Blur background for ebooks
          )}
        />
        {/* Gradient Overlay - Stronger at top for status bar text contrast */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90",
          isEbook && "bg-black/40" // Darker overlay for ebooks to make cover pop
        )} />
      </div>
      
      {/* Content Layer */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 pb-[calc(2rem+env(safe-area-inset-bottom))]">
        <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
          
          {/* Ebook Cover (Floating) */}
          {isEbook && (
            <div className="w-[100px] sm:w-[140px] aspect-[3/4] rounded-lg shadow-2xl overflow-hidden border border-white/10 flex-shrink-0 mb-2 sm:-mb-2 transform rotate-[-2deg]">
              <img 
                src={featured.thumbnail || ""} 
                alt={featured.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Text Content */}
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white mb-3 uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Featured
            </span>
            
            <h1 className="text-3xl sm:text-5xl font-black text-white mb-2 leading-tight drop-shadow-lg line-clamp-2 sm:line-clamp-none">
              {featured.title}
            </h1>
            
            <p className="text-white/80 text-sm sm:text-base line-clamp-2 mb-4 max-w-lg drop-shadow-md">
              {featured.description}
            </p>
            
            <Button size="lg" className="rounded-full bg-white text-black hover:bg-white/90 font-bold px-8 h-12 shadow-xl transition-transform active:scale-95">
              <Icon className="w-5 h-5 mr-2 fill-current" />
              {getActionLabel(featured.category)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

// 2. STICKY FILTER BAR (Glassmorphic)
const BonusesFilter = memo(({ active, onChange }: { active: string; onChange: (id: string) => void }) => {
  const categories = [
    { id: 'all', label: 'Discover' },
    { id: 'video', label: 'Watch' },
    { id: 'ebook', label: 'Read' },
  ];

  return (
    <div className="sticky top-0 z-40 px-5 py-3 -mx-5 backdrop-blur-xl bg-background/80 border-b border-white/5 mb-6 overflow-x-auto scrollbar-hide transition-all">
      <div className="flex gap-2 w-max">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 border",
              active === cat.id 
                ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]" 
                : "bg-secondary/30 text-muted-foreground border-transparent hover:bg-secondary/60"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
});

// 3. SMART SHELF (Horizontal List)
const BonusesShelf = memo(({ title, items, type, onSelect }: { title: string; items: BonusData[]; type: 'video' | 'book' | 'tool'; onSelect: (b: BonusData) => void }) => {
  if (!items.length) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between px-5 mb-4">
        <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
          {title}
          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
        </h3>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-8 px-5 scrollbar-hide snap-x snap-mandatory">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "50px" }}
            transition={{ delay: idx * 0.05, duration: 0.4 }}
            onClick={() => onSelect(item)}
            className={cn(
              "snap-center shrink-0 group cursor-pointer relative",
              item.category === 'ebook' ? "w-[130px]" :
              type === 'video' ? "w-[280px]" : "w-[160px]"
            )}
          >
            {/* Thumbnail */}
            <div className={cn(
              "relative overflow-hidden bg-card transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-1 ring-1 ring-white/5 ring-inset",
              item.category === 'ebook' ? "aspect-[3/4] rounded-[18px] shadow-lg" : "aspect-video rounded-2xl shadow-md"
            )}>
              <img 
                src={item.thumbnail || "/placeholder.svg"} 
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Overlays */}
              {type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                  </div>
                </div>
              )}
              {item.locked && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                  <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold text-white border border-white/20">
                    LOCKED
                  </div>
                </div>
              )}
            </div>

            {/* Meta */}
            <div className={cn("mt-3", item.category === 'ebook' ? "px-1" : "px-1")}>
              <h4 className={cn(
                "font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors",
                item.category === 'ebook' ? "text-sm" : "text-[15px]"
              )}>
                {item.title}
              </h4>
              {type !== 'book' && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {item.duration ? <><Clock className="w-3 h-3" /> {item.duration}</> : <span>{item.category}</span>}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
});

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

    // Priority 1: Item with 'hero' tag
    // Priority 2: Newest item
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
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background pb-32 relative overflow-x-hidden">
        {/* Hero Section (Only shows on 'all' tab) - Bleeds to top */}
        {activeCategory === 'all' && (
          <BonusesHero items={featured} onPlay={handleBonusAction} />
        )}

        {/* Add top padding if NO hero is present (e.g. filtered tabs) so content doesn't hide behind notch */}
        <main className={cn("relative z-10", activeCategory !== 'all' ? "pt-[calc(env(safe-area-inset-top)+20px)]" : "")}>
          {/* Sticky Filters - With safe area padding */}
          <div className="px-5">
            <BonusesFilter active={activeCategory} onChange={setActiveCategory} />
          </div>

          {/* Up Next (Resume) */}
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
        </main>

        {/* Immersive Player */}
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