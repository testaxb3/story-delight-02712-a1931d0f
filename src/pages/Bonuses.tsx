import { useState, useMemo } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { BonusesHeader } from "@/components/bonuses/BonusesHeader";
import { BonusesCategoryTabs } from "@/components/bonuses/BonusesCategoryTabs";
import { BonusCard, BonusData } from "@/components/bonuses/BonusCard";
import { ContinueLearning } from "@/components/bonuses/ContinueLearning";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Play, BookOpen, FileText, Wrench, Sparkles, Calendar, Loader2, X } from "lucide-react";
import { useBonuses } from "@/hooks/useBonuses";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OptimizedYouTubePlayer } from "@/components/VideoPlayer/OptimizedYouTubePlayer";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export default function Bonuses() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State management
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Video player state
  const [playingBonus, setPlayingBonus] = useState<BonusData | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Fetch bonuses from Supabase
  const { data: allBonuses = [], isLoading, error } = useBonuses();

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    return {
      all: allBonuses.length,
      video: allBonuses.filter(b => b.category === 'video').length,
      ebook: allBonuses.filter(b => b.category === 'ebook').length,
      pdf: allBonuses.filter(b => b.category === 'pdf').length,
      tool: allBonuses.filter(b => b.category === 'tool').length,
      template: allBonuses.filter(b => b.category === 'template').length,
      session: allBonuses.filter(b => b.category === 'session').length,
    };
  }, [allBonuses]);

  // Categories configuration
  const categories = [
    { id: "all", label: "All Bonuses", icon: Sparkles, count: categoryCounts.all },
    { id: "video", label: "Videos", icon: Play, count: categoryCounts.video },
    { id: "ebook", label: "Ebooks", icon: BookOpen, count: categoryCounts.ebook },
    { id: "pdf", label: "PDFs", icon: FileText, count: categoryCounts.pdf },
    { id: "tool", label: "Tools", icon: Wrench, count: categoryCounts.tool },
  ];

  // Filter and sort bonuses
  const filteredAndSortedBonuses = useMemo(() => {
    let filtered = allBonuses;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(b => b.category === activeCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        b =>
          b.title.toLowerCase().includes(query) ||
          b.description.toLowerCase().includes(query) ||
          b.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort bonuses
    const sorted = [...filtered];
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
  }, [allBonuses, activeCategory, searchQuery, sortBy]);

  // Get in-progress bonuses
  const inProgressBonuses = allBonuses.filter(
    b => b.progress && b.progress > 0 && b.progress < 100 && !b.locked
  );

  // Calculate stats
  const stats = {
    totalBonuses: allBonuses.length,
    unlockedBonuses: allBonuses.filter(b => !b.locked).length,
    completedBonuses: allBonuses.filter(b => b.completed).length,
    totalTimeSpent: "2.5h"
  };

  // Helper to check if URL is YouTube
  const isYouTubeUrl = (url: string) => {
    return /(?:youtube\.com|youtu\.be)/.test(url);
  };

  // Handle bonus actions
  const handleBonusAction = (bonus: BonusData) => {
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

    // If it's an ebook, ensure we navigate to a valid reader path
    if (bonus.category === 'ebook') {
      const ebookPath = bonus.viewUrl && bonus.viewUrl.startsWith('/ebook/')
        ? bonus.viewUrl
        : '/ebook/ebook-main'; // fallback for legacy /ebook link
      navigate(ebookPath);
      return;
    }

    // Navigate using viewUrl (for PDFs, tools, etc.) or download
    if (bonus.viewUrl) {
      navigate(bonus.viewUrl);
    } else if (bonus.downloadUrl) {
      window.open(bonus.downloadUrl, '_blank');
    }
  };

  // Get unlocked bonuses
  const unlockedBonuses = filteredAndSortedBonuses.filter(b => !b.locked);
  const lockedBonuses = filteredAndSortedBonuses.filter(b => b.locked);

  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 dark:to-primary/10 pb-12 md:pb-6">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-lg">Loading bonuses...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 dark:to-primary/10 pb-12 md:pb-6">
          <div className="text-center py-20">
            <p className="text-destructive mb-4">Error loading bonuses</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 dark:to-primary/10 pb-12 md:pb-6">
        <main className="max-w-7xl mx-auto px-4 pt-4 md:pt-6 pb-8 space-y-8">
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

          {/* Coming Soon Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-2 border-primary/30 dark:border-primary/50 bg-gradient-to-br from-primary/10 via-intense/5 to-purple-500/10 dark:from-primary/20 dark:via-purple-900/20 dark:to-purple-800/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-primary to-purple-600 dark:from-primary/90 dark:to-purple-700 rounded-full">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 dark:from-primary/90 dark:to-purple-500 bg-clip-text text-transparent">
                      New Bonuses Added Weekly
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      We're constantly adding new resources to help you master NEP parenting.
                      Check back regularly for fresh content, advanced modules, and exclusive tools.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Category Tabs and Filters */}
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

          {/* Unlocked Bonuses Grid */}
          {unlockedBonuses.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold">Available Now</h2>
                <span className="px-3 py-1 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold rounded-full">
                  {unlockedBonuses.length} bonuses
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
            </div>
          )}

          {/* Locked Bonuses Section */}
          {lockedBonuses.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-muted-foreground">Coming Soon</h2>
                <span className="px-3 py-1 bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-sm font-semibold rounded-full">
                  {lockedBonuses.length} locked
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
            </div>
          )}

          {/* Empty State */}
          {filteredAndSortedBonuses.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No bonuses found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search query to find what you're looking for.
                </p>
                <Button
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchQuery("");
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            </motion.div>
          )}

          {/* Unlock More CTA */}
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
        </main>

        {/* Video Player Modal */}
        <Dialog open={!!playingBonus} onOpenChange={(open) => !open && setPlayingBonus(null)}>
          <DialogContent className="max-w-5xl w-[95vw] p-0 border-0 bg-black overflow-hidden">
            {playingBonus && playingBonus.videoUrl && (
              <div className="relative">
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPlayingBonus(null)}
                  className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full h-10 w-10"
                >
                  <X className="w-5 h-5" />
                </Button>

                {/* Video Title */}
                <div className="px-6 pt-6 pb-3 bg-black">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                    {playingBonus.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-white/60">
                    {playingBonus.duration && (
                      <span className="flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        {playingBonus.duration}
                      </span>
                    )}
                    {playingBonus.tags && playingBonus.tags.length > 0 && (
                      <span>• {playingBonus.tags[0]}</span>
                    )}
                  </div>
                </div>

                {/* Video Player */}
                <div className="bg-black">
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

                {/* Progress Bar */}
                <div className="px-6 py-4 bg-black border-t border-white/10">
                  <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                    <span>
                      {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}
                    </span>
                    <span>
                      {Math.floor(videoDuration / 60)}:{String(Math.floor(videoDuration % 60)).padStart(2, '0')}
                    </span>
                  </div>
                  <Progress
                    value={videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0}
                    className="h-1.5"
                  />

                  {/* Playback Speed Controls */}
                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-xs text-white/60">Speed:</span>
                    {[1, 1.25, 1.5, 2].map((speed) => (
                      <Button
                        key={speed}
                        variant={playbackRate === speed ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setPlaybackRate(speed)}
                        className={
                          playbackRate === speed
                            ? "h-7 px-3 text-xs bg-white text-black hover:bg-white/90"
                            : "h-7 px-3 text-xs text-white/70 hover:text-white hover:bg-white/10"
                        }
                      >
                        {speed}x
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Video Description */}
                {playingBonus.description && (
                  <div className="px-6 pb-6 bg-black border-t border-white/10">
                    <p className="text-sm text-white/70 leading-relaxed mt-4">
                      {playingBonus.description}
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
