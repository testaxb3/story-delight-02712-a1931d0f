import { useState, useMemo, useEffect, useRef, useCallback, memo } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { BonusesHeader } from "@/components/bonuses/BonusesHeader";
import { BonusesCategoryTabs } from "@/components/bonuses/BonusesCategoryTabs";
import { BonusCard } from "@/components/bonuses/BonusCard";
import { ContinueLearning } from "@/components/bonuses/ContinueLearning";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Play, BookOpen, Wrench, Sparkles, X, Clock, ArrowRight, Loader2 } from "lucide-react";
import { useBonuses } from "@/hooks/useBonuses";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OptimizedYouTubePlayer } from "@/components/VideoPlayer/OptimizedYouTubePlayer";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { BonusData } from "@/types/bonus";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

function BonusesContent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State
  const [activeCategory, setActiveCategory] = useState(() => searchParams.get("category") || "all");
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") || "");
  
  // Video player
  const [playingBonus, setPlayingBonus] = useState<BonusData | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Data Fetching
  const { data: bonusesResponse, isLoading, error } = useBonuses({
    category: activeCategory !== "all" ? activeCategory : undefined,
    search: searchQuery.trim() || undefined,
    page: 0,
    pageSize: 100, // Fetch all for smooth client-side filtering in shelves
  });

  const allBonuses = bonusesResponse?.data || [];
  const totalBonuses = bonusesResponse?.total || 0;

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (activeCategory !== "all") params.set("category", activeCategory);
    setSearchParams(params, { replace: true });
  }, [searchQuery, activeCategory]);

  // Organized Shelves Logic
  const shelves = useMemo(() => {
    if (!allBonuses.length) return [];

    const newReleases = allBonuses.filter(b => b.isNew).slice(0, 5);
    const popular = allBonuses.filter(b => b.completed).slice(0, 5);
    const videos = allBonuses.filter(b => b.category === 'video');
    const tools = allBonuses.filter(b => b.category === 'tool' || b.category === 'template');
    const ebooks = allBonuses.filter(b => b.category === 'ebook');

    return [
      { title: "New & Trending", items: newReleases, type: 'poster' },
      { title: "Watch & Learn", items: videos, type: 'video' },
      { title: "Workshops & Tools", items: tools, type: 'square' },
      { title: "Read & Reflect", items: ebooks, type: 'book' },
    ].filter(shelf => shelf.items.length > 0);
  }, [allBonuses]);

  // Handlers
  const handleBonusAction = useCallback(async (bonus: BonusData) => {
    if (bonus.category === 'video' && (bonus.videoUrl || /(?:youtube\.com|youtu\.be)/.test(bonus.viewUrl || ''))) {
      setPlayingBonus({ ...bonus, videoUrl: bonus.videoUrl || bonus.viewUrl });
      return;
    }
    if (bonus.category === 'ebook') {
      if (bonus.viewUrl) { navigate(bonus.viewUrl); return; }
      const { data } = await supabase.from('ebooks').select('slug').eq('bonus_id', bonus.id).single();
      if (data?.slug) navigate(`/ebook-v2/${data.slug}`);
      return;
    }
    if (bonus.viewUrl) navigate(bonus.viewUrl);
    else if (bonus.downloadUrl) window.open(bonus.downloadUrl, '_blank');
  }, [navigate]);

  // Calculate Stats
  const stats = useMemo(() => ({
    totalBonuses: allBonuses.length,
    unlockedBonuses: allBonuses.filter(b => !b.locked).length,
    completedBonuses: allBonuses.filter(b => b.completed).length,
  }), [allBonuses]);

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
        {/* Ambient Background */}
        <div className="fixed top-[-20%] left-[-20%] w-[80%] h-[80%] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none z-0" />
        <div className="fixed bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none z-0" />

        {/* Header Spacer for status bar */}
        <div className="w-full h-[calc(env(safe-area-inset-top)+20px)]" />

        <main className="px-5 relative z-10 space-y-10">
          
          {/* Editorial Header */}
          <header>
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Bonuses</h1>
            <p className="text-muted-foreground">Exclusive resources for your journey.</p>
          </header>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide snap-x">
            {[
              { id: 'all', label: 'All' },
              { id: 'video', label: 'Videos' },
              { id: 'ebook', label: 'Books' },
              { id: 'tool', label: 'Tools' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap snap-start",
                  activeCategory === cat.id 
                    ? "bg-foreground text-background shadow-lg" 
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Featured / Up Next */}
          <ContinueLearning 
            inProgressBonuses={allBonuses.filter(b => b.progress && b.progress > 0 && b.progress < 100)}
            onContinue={handleBonusAction}
          />

          {/* Dynamic Shelves */}
          <div className="space-y-12">
            {shelves.map((shelf) => (
              <section key={shelf.title} className="relative">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h2 className="text-xl font-bold tracking-tight">{shelf.title}</h2>
                  <ArrowRight className="w-5 h-5 text-muted-foreground/50" />
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-8 -mx-5 px-5 scrollbar-hide snap-x snap-mandatory">
                  {shelf.items.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleBonusAction(item)}
                      className={cn(
                        "snap-center shrink-0 group cursor-pointer relative",
                        item.category === 'ebook' ? "w-[130px]" :
                        shelf.type === 'video' ? "w-[280px]" : 
                        "w-[180px]"
                      )}
                    >
                      <div className={cn(
                        "overflow-hidden rounded-2xl shadow-sm border border-white/5 bg-card transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1",
                        item.category === 'ebook' ? "aspect-[3/4]" :
                        shelf.type === 'video' ? "aspect-video" : "aspect-square"
                      )}>
                        {item.thumbnail ? (
                          <img 
                            src={item.thumbnail} 
                            alt={item.title}
                            className={cn(
                              "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105",
                              item.title?.toLowerCase().includes('siblings fight') && "scale-110 -translate-y-2"
                            )}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-muted-foreground/30" />
                          </div>
                        )}
                        
                        {/* Play Overlay for Videos */}
                        {shelf.type === 'video' && (
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                            </div>
                          </div>
                        )}
                        
                        {/* Lock Overlay */}
                        {item.locked && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                            <div className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-md text-xs font-bold text-white flex items-center gap-1">
                              Locked
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 px-1">
                        <h3 className={cn(
                          "font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors",
                          item.category === 'ebook' ? "text-sm" : "text-[15px]"
                        )}>
                          {item.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {item.category} • {item.duration || '5 min'}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            ))}
          </div>

        </main>

        {/* Video Player Modal */}
        <Dialog open={!!playingBonus} onOpenChange={(open) => !open && setPlayingBonus(null)}>
          <DialogContent className="w-screen h-screen max-w-none m-0 p-0 border-0 bg-black rounded-none overflow-hidden" style={{ zIndex: 9999 }}>
            {playingBonus && (
              <div className="relative h-full flex flex-col">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPlayingBonus(null)}
                  className="absolute right-4 z-[100] bg-black/50 hover:bg-black/80 text-white rounded-full w-10 h-10"
                  style={{ top: 'calc(3rem + env(safe-area-inset-top))' }}
                >
                  <X className="w-5 h-5" />
                </Button>
                <div className="flex-1 bg-black flex items-center justify-center">
                  <OptimizedYouTubePlayer
                    videoUrl={playingBonus.videoUrl || ''}
                    videoId={playingBonus.id}
                    playbackRate={playbackRate}
                    onTimeUpdate={(c, d) => { setCurrentTime(c); setVideoDuration(d); }}
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