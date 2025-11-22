import { useState, useMemo, useEffect, useRef } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { BonusesHeader } from "@/components/bonuses/BonusesHeader";
import { BonusesCategoryTabs } from "@/components/bonuses/BonusesCategoryTabs";
import { BonusCard } from "@/components/bonuses/BonusCard";
import { BonusesPagination } from "@/components/bonuses/BonusesPagination";
import { ContinueLearning } from "@/components/bonuses/ContinueLearning";
import { BonusEmptyState } from "@/components/bonuses/BonusEmptyState";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Play, BookOpen, FileText, Wrench, Sparkles, Calendar, Loader2, X, AlertCircle, Clock } from "lucide-react";
import { useBonuses, useUpdateBonusProgress } from "@/hooks/useBonuses";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OptimizedYouTubePlayer } from "@/components/VideoPlayer/OptimizedYouTubePlayer";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { BonusData, BonusCategory } from "@/types/bonus";
import { supabase } from "@/integrations/supabase/client";

function BonusesContent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // URL state management
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State management with URL persistence
  const [activeCategory, setActiveCategory] = useState(() => searchParams.get("category") || "all");
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState(() => searchParams.get("sort") || "newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get("page");
    return page ? parseInt(page) : 0;
  });
  const PAGE_SIZE = 12;

  // Video player state
  const [playingBonus, setPlayingBonus] = useState<BonusData | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  // Video progress tracking
  const updateProgress = useUpdateBonusProgress();
  const lastProgressUpdate = useRef<number>(0);
  const progressUpdateInterval = useRef<NodeJS.Timeout>();

  // Fetch bonuses from Supabase with pagination
  const { 
    data: bonusesResponse, 
    isLoading, 
    isFetching,
    error 
  } = useBonuses({
    category: activeCategory !== "all" ? activeCategory : undefined,
    search: searchQuery.trim() || undefined,
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const allBonuses = bonusesResponse?.data || [];
  const totalBonuses = bonusesResponse?.total || 0;
  const totalPages = bonusesResponse?.totalPages || 0;
  const categoryCounts = bonusesResponse?.categoryCounts || {
    all: 0,
    video: 0,
    ebook: 0,
    tool: 0,
    template: 0,
    session: 0,
  };

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 0) params.set("page", currentPage.toString());
    if (searchQuery) params.set("search", searchQuery);
    if (activeCategory !== "all") params.set("category", activeCategory);
    if (sortBy !== "newest") params.set("sort", sortBy);
    
    setSearchParams(params, { replace: true });
  }, [currentPage, searchQuery, activeCategory, sortBy, setSearchParams]);
  
  // Reset to page 0 when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [activeCategory, searchQuery]);

  // Categories configuration
  const categories = [
    { id: "all", label: "All Bonuses", icon: Sparkles, count: categoryCounts.all },
    { id: "video", label: "Videos", icon: Play, count: categoryCounts.video },
    { id: "ebook", label: "Ebooks", icon: BookOpen, count: categoryCounts.ebook },
    { id: "tool", label: "Tools", icon: Wrench, count: categoryCounts.tool },
  ];

  // Clear all filters helper
  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setSortBy("newest");
    setCurrentPage(0);
  };

  // Sort bonuses client-side (data already filtered by backend)
  const sortedBonuses = useMemo(() => {
    const sorted = [...allBonuses];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case 'popular':
        return sorted.sort((a, b) => (b.completed ? 1 : 0) - (a.completed ? 1 : 0));
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'progress':
        return sorted.sort((a, b) => (b.progress || 0) - (a.progress || 0));
      case 'completed':
        return sorted.sort((a, b) => (b.completed ? 1 : 0) - (a.completed ? 1 : 0));
      default:
        return sorted;
    }
  }, [allBonuses, sortBy]);

  // PERFORMANCE: Memoize filtered lists to prevent recalculation
  const inProgressBonuses = useMemo(() => 
    sortedBonuses.filter(b => b.progress && b.progress > 0 && b.progress < 100 && !b.locked),
    [sortedBonuses]
  );

  // State for reading time
  const [totalTimeSpent, setTotalTimeSpent] = useState("0h");

  // Calculate total reading time from user_ebook_progress
  useEffect(() => {
    const fetchReadingTime = async () => {
      if (!user?.id) return;
      
      const { data } = await supabase
        .from('user_ebook_progress')
        .select('reading_time_minutes')
        .eq('user_id', user.id);
      
      const totalMinutes = data?.reduce((sum, record) => sum + (record.reading_time_minutes || 0), 0) || 0;
      
      if (totalMinutes === 0) {
        setTotalTimeSpent("0h");
      } else if (totalMinutes < 60) {
        setTotalTimeSpent(`${totalMinutes}m`);
      } else {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        setTotalTimeSpent(minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`);
      }
    };

    fetchReadingTime();
  }, [user?.id]);

  const stats = useMemo(() => ({
    totalBonuses: sortedBonuses.length,
    unlockedBonuses: sortedBonuses.filter(b => !b.locked).length,
    completedBonuses: sortedBonuses.filter(b => b.completed).length,
    totalTimeSpent
  }), [sortedBonuses, totalTimeSpent]);

  // Helper to check if URL is YouTube
  const isYouTubeUrl = (url: string) => {
    return /(?:youtube\.com|youtu\.be)/.test(url);
  };

  // Handle bonus actions
  const handleBonusAction = async (bonus: BonusData) => {
    // If it's a video category
    if (bonus.category === 'video') {
      // Priority 1: Use videoUrl if available
      if (bonus.videoUrl) {
        setPlayingBonus(bonus);
        setCurrentTime(0);
        setVideoDuration(0);
        return;
      }
      // Priority 2: Check if viewUrl is a YouTube URL (fallback for legacy data)
      if (bonus.viewUrl && isYouTubeUrl(bonus.viewUrl)) {
        // Create a temporary bonus with videoUrl populated
        const bonusWithVideo = { ...bonus, videoUrl: bonus.viewUrl };
        setPlayingBonus(bonusWithVideo);
        setCurrentTime(0);
        setVideoDuration(0);
        return;
      }
    }

    // If it's an ebook
    if (bonus.category === 'ebook') {
      // Priority 1: Use viewUrl if available
      if (bonus.viewUrl) {
        navigate(bonus.viewUrl);
        return;
      }
      
      // Priority 2: Fallback - fetch ebook slug from database
      const { data: ebook } = await supabase
        .from('ebooks')
        .select('slug')
        .eq('bonus_id', bonus.id)
        .single();
      
      if (ebook?.slug) {
        navigate(`/ebook-v2/${ebook.slug}`);
        return;
      }
    }

    // Navigate using viewUrl (for PDFs, tools, etc.) or download
    if (bonus.viewUrl) {
      navigate(bonus.viewUrl);
    } else if (bonus.downloadUrl) {
      window.open(bonus.downloadUrl, '_blank');
    }
  };

  // PERFORMANCE: Memoize split bonus lists (data already filtered by backend)
  const unlockedBonuses = useMemo(() => 
    sortedBonuses.filter(b => !b.locked),
    [sortedBonuses]
  );
  
  const lockedBonuses = useMemo(() => 
    sortedBonuses.filter(b => b.locked),
    [sortedBonuses]
  );

  // Loading state with premium skeleton - only show on initial load
  if (isLoading && !bonusesResponse) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 dark:to-primary/10 pb-12 md:pb-6">
          <div className="container mx-auto px-4 py-8">
            {/* Header Skeleton */}
            <div className="mb-8 space-y-6">
              <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
                <div className="animate-pulse space-y-4">
                  <div className="h-12 w-3/4 bg-muted/30 rounded-lg" />
                  <div className="h-6 w-1/2 bg-muted/20 rounded-lg" />
                </div>
              </div>
              
              {/* Stats Skeleton */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bonus-glass p-5 animate-pulse">
                    <div className="h-10 w-10 bg-muted/30 rounded-xl mb-3" />
                    <div className="h-8 w-16 bg-muted/30 rounded mb-2" />
                    <div className="h-4 w-24 bg-muted/20 rounded" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Pills Skeleton */}
            <div className="flex gap-2 mb-6 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 w-32 bg-muted/30 rounded-full animate-pulse" />
              ))}
            </div>
            
            {/* Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bonus-glass p-5 space-y-4"
                >
                  <div className="h-48 bg-muted/30 rounded-lg animate-pulse relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  <div className="space-y-3 animate-pulse">
                    <div className="h-6 w-3/4 bg-muted/30 rounded" />
                    <div className="h-4 w-full bg-muted/20 rounded" />
                    <div className="h-4 w-5/6 bg-muted/20 rounded" />
                    <div className="flex gap-2 mt-4">
                      <div className="h-10 flex-1 bg-muted/30 rounded-lg" />
                      <div className="h-10 w-20 bg-muted/20 rounded-lg" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Error state
  // Show better error state
  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Failed to Load Bonuses</h2>
                <p className="text-muted-foreground mb-4">
                  We encountered an error loading your bonuses. Please try again.
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => window.location.reload()} variant="default">
                  Retry
                </Button>
                <Button onClick={() => navigate('/dashboard')} variant="outline">
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background pb-32 relative overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none z-0" />

        {/* Fixed Header Background for Status Bar */}
        <div className="fixed top-0 left-0 right-0 z-40 h-[calc(env(safe-area-inset-top)+80px)] bg-gradient-to-b from-background via-background to-transparent pointer-events-none" />

        <main className="px-4 pt-[calc(env(safe-area-inset-top)+16px)] pb-8 space-y-6 relative z-50">
          {/* Header with Stats */}
          <BonusesHeader
            userName={user?.user_metadata?.full_name?.split(' ')[0] || "Member"}
            totalBonuses={stats.totalBonuses}
            unlockedBonuses={stats.unlockedBonuses}
            completedBonuses={stats.completedBonuses}
            totalTimeSpent={stats.totalTimeSpent}
          />

          {/* Continue Learning Section */}
          {inProgressBonuses.length > 0 && (
            <ContinueLearning
              inProgressBonuses={inProgressBonuses}
              onContinue={handleBonusAction}
            />
          )}

          {/* Category Tabs and Filters */}
          <div className="relative">
            {isFetching && (
              <div className="absolute -top-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
            )}
            <BonusesCategoryTabs
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              categories={categories}
            />
          </div>

          {/* Unlocked Bonuses Grid */}
          {unlockedBonuses.length > 0 && (
            <motion.div
              key={`unlocked-${activeCategory}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold text-white">Available Now</h2>
                <span className="px-2 py-0.5 bg-[#2C2C2E] text-gray-400 text-xs font-medium rounded-lg">
                  {unlockedBonuses.length}
                </span>
              </div>
              <div className={
                viewMode === "grid"
                  ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                  : "space-y-4"
              }>
                {unlockedBonuses.map((bonus, index) => (
                  <BonusCard
                    key={bonus.id}
                    bonus={bonus}
                    onAction={handleBonusAction}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Locked Bonuses Section */}
          {lockedBonuses.length > 0 && (
            <motion.div
              key={`locked-${activeCategory}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="mt-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold text-white">Coming Soon</h2>
                <span className="px-2 py-0.5 bg-[#2C2C2E] text-gray-400 text-xs font-medium rounded-lg">
                  {lockedBonuses.length}
                </span>
              </div>
              <div className={
                viewMode === "grid"
                  ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                  : "space-y-4"
              }>
                {lockedBonuses.map((bonus, index) => (
                  <BonusCard
                    key={bonus.id}
                    bonus={bonus}
                    onAction={handleBonusAction}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {sortedBonuses.length === 0 && !isFetching && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-[#2C2C2E] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No bonuses found</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Try adjusting your filters or search query.
                </p>
                <Button
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchQuery("");
                  }}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}

          {/* Unlock More CTA */}
          {/* REMOVED: "Want to Unlock More Bonuses?" card */}
          {/*
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-2 border-purple-500/30 dark:border-purple-600/50 bg-gradient-to-br from-purple-500/10 via-primary/10 to-intense/10 dark:from-purple-900/20 dark:via-primary/20 dark:to-purple-800/20 overflow-hidden relative">
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
              <CardContent className="pt-8 pb-8 relative z-10">
                <div className="max-w-2xl mx-auto text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 dark:from-primary/90 dark:to-purple-700 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-purple-600 to-intense dark:from-primary/90 dark:via-purple-500 dark:to-purple-400 bg-clip-text text-transparent">
                    Want to Unlock More Bonuses?
                  </h3>
                  <p className="text-muted-foreground max-w-xl mx-auto">
                    Complete challenges, maintain your streak, and engage with the community
                    to unlock exclusive content, advanced modules, and premium tools.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center pt-4">
                    <Button
                      onClick={() => navigate('/dashboard')}
                      className="gradient-primary text-white shadow-lg hover:shadow-xl"
                      size="lg"
                    >
                      View Challenges
                    </Button>
                    <Button
                      onClick={() => navigate('/community')}
                      variant="outline"
                      size="lg"
                      className="border-2"
                    >
                      Join Community
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          */}
        </main>

        {/* Video Player Modal - Premium Version */}
        <Dialog open={!!playingBonus} onOpenChange={(open) => !open && setPlayingBonus(null)}>
          <DialogContent className="max-w-6xl w-[98vw] sm:w-[95vw] h-[98vh] sm:h-[95vh] p-0 border-0 bg-gradient-to-br from-background via-background/95 to-background overflow-hidden">
            {playingBonus && playingBonus.videoUrl && (
              <div className="relative h-full flex flex-col">
                {/* Backdrop blur overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xl -z-10" />
                
                {/* Premium gradient border effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-50 blur-xl -z-10" />

                {/* Close Button - Premium Style */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPlayingBonus(null)}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 bg-black/80 hover:bg-black backdrop-blur-md text-white rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border border-white/10 hover:border-primary/50 transition-all hover:scale-110"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </Button>

                {/* Video Title - Premium Header */}
                <div className="px-3 pt-3 pb-2 sm:px-4 sm:pt-4 sm:pb-3 md:px-6 md:pt-6 md:pb-4 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm relative z-10">
                  <motion.h3
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-1.5 sm:mb-2 flex items-center gap-2 sm:gap-3"
                  >
                    <div className="p-1.5 sm:p-2 bg-gradient-to-br from-primary/30 to-accent/30 rounded-lg flex-shrink-0">
                      <Play className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />
                    </div>
                    <span className="line-clamp-1">{playingBonus.title}</span>
                  </motion.h3>
                  
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm flex-wrap">
                    {playingBonus.duration && (
                      <span className="flex items-center gap-1 sm:gap-2 text-white/70 bg-white/5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full backdrop-blur-sm">
                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {playingBonus.duration}
                      </span>
                    )}
                    {playingBonus.tags && playingBonus.tags.length > 0 && (
                      <span className="text-white/70 bg-primary/10 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full backdrop-blur-sm">
                        {playingBonus.tags[0]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Video Player - Flex grow to fill space */}
                <div className="flex-1 bg-black relative overflow-hidden">
                  <OptimizedYouTubePlayer
                    videoUrl={playingBonus.videoUrl}
                    videoId={playingBonus.id}
                    thumbnail={playingBonus.thumbnail}
                    playbackRate={playbackRate}
                    onTimeUpdate={(current, duration) => {
                      setCurrentTime(current);
                      setVideoDuration(duration);
                    }}
                    onPlaybackRateChange={(rate) => setPlaybackRate(rate)}
                  />
                </div>

                {/* Premium Controls Bar */}
                <div className="px-2 py-2 sm:px-3 sm:py-3 md:px-4 md:py-4 lg:px-6 lg:py-5 bg-gradient-to-t from-black via-black/95 to-transparent backdrop-blur-md border-t border-white/10 relative z-10">
                  {/* Progress Bar with Glow Effect */}
                  <div className="mb-2 sm:mb-3 md:mb-4">
                    <div className="flex items-center justify-between text-xs text-white/60 mb-1 sm:mb-2 font-mono">
                      <span className="bg-white/5 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs">
                        {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}
                      </span>
                      <span className="bg-white/5 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs">
                        {Math.floor(videoDuration / 60)}:{String(Math.floor(videoDuration % 60)).padStart(2, '0')}
                      </span>
                    </div>
                    
                    {/* Custom Progress Bar with Glow */}
                    <div className="relative">
                      <Progress
                        value={videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0}
                        className="h-1.5 sm:h-2 bg-white/10"
                      />
                      {/* Glow effect on progress */}
                      <motion.div
                        className="absolute top-0 left-0 h-1.5 sm:h-2 bg-gradient-to-r from-primary via-accent to-primary rounded-full"
                        style={{
                          width: `${videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0}%`,
                          boxShadow: '0 0 20px hsl(var(--primary) / 0.6), 0 0 40px hsl(var(--accent) / 0.4)',
                        }}
                        animate={{
                          opacity: [0.8, 1, 0.8],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </div>

                  {/* Premium Playback Speed Controls */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                      <span className="text-xs sm:text-sm text-white/60 font-medium whitespace-nowrap">Speed</span>
                      <div className="flex gap-1 sm:gap-2 flex-wrap">
                        {[1, 1.25, 1.5, 2].map((speed) => (
                          <motion.div key={speed} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant={playbackRate === speed ? "default" : "ghost"}
                              size="sm"
                              onClick={() => setPlaybackRate(speed)}
                              className={
                                playbackRate === speed
                                  ? "h-7 sm:h-8 md:h-9 px-2 sm:px-3 md:px-4 text-xs font-semibold bg-gradient-to-r from-primary to-accent text-white border-0 shadow-glow"
                                  : "h-7 sm:h-8 md:h-9 px-2 sm:px-3 md:px-4 text-xs text-white/70 hover:text-white hover:bg-white/10 border border-white/10"
                              }
                            >
                              {speed}x
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Quality Badge */}
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-white/50">
                      <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-accent" />
                      <span className="hidden sm:inline">Premium Quality</span>
                      <span className="sm:hidden">Premium</span>
                    </div>
                  </div>
                </div>

                {/* Video Description - Collapsible */}
                {playingBonus.description && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ delay: 0.3 }}
                    className="px-6 py-4 bg-black/90 backdrop-blur-sm border-t border-white/10 max-h-24 overflow-y-auto"
                  >
                    <p className="text-sm text-white/70 leading-relaxed">
                      {playingBonus.description}
                    </p>
                  </motion.div>
                )}
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
