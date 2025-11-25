import { useNavigate } from 'react-router-dom';
import { BookOpen, Video, Flame, Calendar, Play, ChevronRight, Zap, Target } from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useScriptsByProfile } from '@/hooks/useScriptsByProfile';
import { UnifiedStatsCard } from '@/components/Dashboard/UnifiedStatsCard';
import { FABButton } from '@/components/Dashboard/FABButton';
import { DashboardSkeletonPremium } from '@/components/Dashboard/DashboardSkeletonPremium';
import { AnimatedStatsCard } from '@/components/Dashboard/AnimatedStatsCard';
import { WeeklyWinsSection } from '@/components/Dashboard/WeeklyWinsSection';
import { InsightsCard } from '@/components/Dashboard/InsightsCard';
import { RecentActivitySection } from '@/components/Dashboard/RecentActivitySection';
import { cn } from '@/lib/utils';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CATEGORY_EMOJIS } from '@/lib/scriptUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptic } from '@/hooks/useHaptic';
import { Logo } from '@/components/common/Logo';

export default function DashboardCalAI() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { activeChild } = useChildProfiles();
  const { data: dashboardStats, isLoading, error } = useDashboardStats();
  const { data: scriptsForProfile } = useScriptsByProfile(activeChild?.brain_profile);
  const [recentScripts, setRecentScripts] = useState<any[]>([]);
  const [latestVideo, setLatestVideo] = useState<any>(null);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { triggerHaptic } = useHaptic();

  const scriptsAvailable = scriptsForProfile ?? 0;
  const scriptsUsed = dashboardStats?.uniqueScriptsUsed ?? 0;
  const currentStreak = Math.max(dashboardStats?.totalTrackerEntries ?? 0, 1);

  // Helper function to get category emoji
  const getCategoryEmoji = (category: string) => {
    const categoryKey = category.toLowerCase().replace(/\s+/g, '_');
    return CATEGORY_EMOJIS[categoryKey] || '🧠';
  };

  // Fetch recent content
  useEffect(() => {
    const fetchData = async () => {
      // Recent scripts for profile
      const { data: scripts } = await supabase
        .from('scripts')
        .select('*')
        .eq('profile', activeChild?.brain_profile || 'INTENSE')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (scripts) setRecentScripts(scripts);

      // Latest video (bonus)
      const { data: videos } = await supabase
        .from('bonuses')
        .select('*')
        .eq('category', 'video')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (videos) setLatestVideo(videos);
    };

    if (activeChild) fetchData();
  }, [activeChild]);

  // Navigate to progress page for logging
  const handleLogToday = () => {
    navigate('/progress');
  };

  // Carousel scroll tracking
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollPosition = carousel.scrollLeft;
      const cardWidth = carousel.offsetWidth * 0.85 + 16; // 85vw + gap
      const index = Math.round(scrollPosition / cardWidth);
      setActiveCarouselIndex(index);
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, []);

  // Week calendar - today is highlighted
  const today = new Date();
  const dayOfWeek = today.getDay();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - dayOfWeek + index);
    return {
      label,
      date: date.getDate(),
      isToday: index === dayOfWeek,
      isPast: index < dayOfWeek,
    };
  });

  // Show skeleton while loading
  if (isLoading) {
    return (
      <MainLayout hideSideNav>
        <DashboardSkeletonPremium />
      </MainLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <MainLayout hideSideNav>
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-foreground mb-2">Unable to load dashboard</h2>
            <p className="text-muted-foreground text-sm mb-6">Please try again later</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const totalCarouselCards = 1 + (latestVideo ? 1 : 0);

  return (
    <MainLayout hideSideNav>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-background pb-32 relative overflow-hidden transition-colors duration-300"
      >
        {/* Enhanced Ambient Background Effects */}
        <div className="fixed top-[-15%] left-[-15%] w-[60%] h-[60%] bg-purple-500/5 dark:bg-purple-900/10 rounded-full blur-[140px] pointer-events-none z-0" />
        <div className="fixed bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-blue-500/5 dark:bg-blue-900/10 rounded-full blur-[140px] pointer-events-none z-0" />
        <div className="fixed top-[30%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/3 dark:bg-cyan-900/8 rounded-full blur-[100px] pointer-events-none z-0" />

        {/* Fixed Header Background for Status Bar */}
        <div className="fixed top-0 left-0 right-0 z-40 h-[calc(env(safe-area-inset-top)+80px)] bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none" />

        {/* Header - Logo & Streak */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-50 px-6 pt-[calc(env(safe-area-inset-top)+8px)] pb-6 flex items-center justify-between"
        >
          <Logo className="h-24 w-auto" alt="Brainy+" />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              triggerHaptic('light');
              navigate('/achievements');
            }}
            className="flex items-center gap-2 bg-card/80 backdrop-blur-xl border border-border/50 px-4 py-2.5 rounded-full shadow-lg shadow-orange-500/10 dark:shadow-orange-500/20 cursor-pointer hover:shadow-xl hover:shadow-orange-500/20 dark:hover:shadow-orange-500/30 transition-all duration-300"
          >
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            <motion.span
              key={currentStreak}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-bold text-lg text-foreground"
            >
              {currentStreak}
            </motion.span>
          </motion.div>
        </motion.header>

        {/* Apple-Style Weekly Calendar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="px-6 mb-8"
        >
          <div className="bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 shadow-xl p-1">
            <div className="flex justify-between items-center gap-1">
              {weekDays.map((day, index) => {
                const dateObj = new Date(today);
                dateObj.setDate(today.getDate() - dayOfWeek + index);
                const isSelected = selectedDate?.toDateString() === dateObj.toDateString();

                return (
                  <motion.button
                    key={day.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * index }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      triggerHaptic('light');
                      if (isSelected) {
                        setSelectedDate(null);
                      } else {
                        setSelectedDate(dateObj);
                      }
                    }}
                    className={cn(
                      "flex-1 flex flex-col items-center py-3 px-2 rounded-2xl transition-all duration-200",
                      day.isToday && "bg-foreground",
                      isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                      !day.isToday && "hover:bg-muted/50 cursor-pointer"
                    )}
                  >
                    <span className={cn(
                      "text-xs font-medium mb-1",
                      day.isToday ? "text-background" : "text-muted-foreground"
                    )}>
                      {day.label}
                    </span>
                    <span className={cn(
                      "text-2xl font-bold",
                      day.isToday ? "text-background" : "text-foreground"
                    )}>
                      {day.date}
                    </span>
                    {day.isPast && !day.isToday && (
                      <div className="mt-1 w-1 h-1 rounded-full bg-primary" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Show selected date info */}
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-4 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">
                  Showing data for {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Clear
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Horizontal Scroll Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          ref={carouselRef}
          className="mb-6 overflow-x-auto pb-4 px-6 scrollbar-hide snap-x snap-mandatory flex gap-4"
        >
          {/* Card 1: Main Stats */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="snap-center shrink-0 w-[85vw] max-w-sm"
          >
            <UnifiedStatsCard
              scriptsUsed={scriptsUsed}
              scriptsTotal={scriptsAvailable}
            />
          </motion.div>

          {/* Card 2: Latest Video */}
          {latestVideo && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="snap-center shrink-0 w-[85vw] max-w-sm"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  triggerHaptic('medium');
                  navigate('/bonuses?category=video');
                }}
                className="h-[280px] bg-gradient-to-br from-card via-card to-card/80 border border-border/50 rounded-[32px] p-6 flex flex-col justify-between relative overflow-hidden group cursor-pointer shadow-xl shadow-purple-500/5 dark:shadow-purple-500/10 hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/20 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-purple-500/15 dark:group-hover:bg-purple-500/20 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/5 dark:bg-pink-500/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-3.5 bg-gradient-to-br from-purple-500/15 to-purple-500/5 backdrop-blur-sm rounded-2xl shadow-lg shadow-purple-500/10">
                    <Play className="w-6 h-6 text-purple-600 dark:text-purple-400 fill-purple-600 dark:fill-purple-400" />
                  </div>
                  <div className="bg-gradient-to-r from-purple-500/15 to-purple-500/10 text-purple-700 dark:text-purple-300 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm animate-pulse">
                    NEW
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1 tracking-tight">{latestVideo.title}</h3>
                  <p className="text-muted-foreground/80 text-sm mb-5 line-clamp-1">Latest expert guidance</p>
                  <div className="w-full bg-gradient-to-r from-muted to-muted/80 h-12 rounded-xl flex items-center justify-center text-sm font-semibold text-foreground group-hover:from-muted/90 group-hover:to-muted/70 transition-all duration-300 shadow-sm">
                    Watch Now
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Dynamic Dots Indicator */}
        <div className="flex justify-center gap-2.5 mb-6">
          {[...Array(totalCarouselCards)].map((_, index) => (
            <motion.div
              key={index}
              animate={{
                width: activeCarouselIndex === index ? 24 : 8,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                activeCarouselIndex === index
                  ? "bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/30"
                  : "bg-muted/60 hover:bg-muted"
              )}
            />
          ))}
        </div>

        {/* Insights Card */}
        {dashboardStats && (
          <InsightsCard
            meltdownsBefore={dashboardStats.meltdownsBefore}
            meltdownsAfter={dashboardStats.meltdownsAfter}
            averageStress={dashboardStats.averageStress}
            totalEntries={dashboardStats.totalTrackerEntries}
          />
        )}

        {/* Weekly Wins Section */}
        {dashboardStats?.weeklyWins && dashboardStats.weeklyWins.length > 0 && (
          <WeeklyWinsSection wins={dashboardStats.weeklyWins} />
        )}

        {/* Quick Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="px-6 mb-8"
        >
          <h2 className="text-xl font-bold text-foreground mb-5 tracking-tight">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <AnimatedStatsCard
              value={dashboardStats?.totalScripts ?? 0}
              label="Total Scripts"
              icon={<BookOpen className="w-6 h-6 text-purple-500 dark:text-purple-400" />}
              gradient="from-purple-500/10 to-blue-500/10"
              delay={0.7}
              onClick={() => {
                triggerHaptic('light');
                navigate('/scripts');
              }}
            />

            <AnimatedStatsCard
              value={dashboardStats?.totalVideos ?? 0}
              label="Video Lessons"
              icon={<Video className="w-6 h-6 text-blue-500 dark:text-blue-400" />}
              gradient="from-blue-500/10 to-cyan-500/10"
              delay={0.8}
              onClick={() => {
                triggerHaptic('light');
                navigate('/bonuses?category=video');
              }}
            />

            <AnimatedStatsCard
              value={dashboardStats?.scriptUsesToday ?? 0}
              label="Scripts Today"
              icon={<Zap className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />}
              gradient="from-yellow-500/10 to-orange-500/10"
              delay={0.9}
            />

            <AnimatedStatsCard
              value={dashboardStats?.scriptUsesWeek ?? 0}
              label="This Week"
              icon={<Target className="w-6 h-6 text-green-500 dark:text-green-400" />}
              gradient="from-green-500/10 to-emerald-500/10"
              delay={1.0}
            />
          </div>
        </motion.div>

        {/* Recent Activity Section */}
        {dashboardStats?.recentScriptUsage && dashboardStats.recentScriptUsage.length > 0 && (
          <RecentActivitySection
            recentScripts={dashboardStats.recentScriptUsage}
            onScriptClick={() => {
              triggerHaptic('light');
              navigate('/scripts');
            }}
          />
        )}

        {/* Recently Added Scripts Fallback */}
        {(!dashboardStats?.recentScriptUsage || dashboardStats.recentScriptUsage.length === 0) && recentScripts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="px-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-foreground tracking-tight">Recently Added</h2>
              <button onClick={() => navigate('/scripts')} className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors hover:scale-105 active:scale-95">
                SEE ALL
              </button>
            </div>

            <div className="space-y-3">
              {recentScripts.map((script, index) => (
                <motion.div
                  key={script.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (index * 0.1) }}
                  onClick={() => {
                    triggerHaptic('light');
                    navigate('/scripts');
                  }}
                  className="bg-gradient-to-br from-card via-card to-card/80 border border-border/50 rounded-2xl p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all duration-200 hover:shadow-lg hover:border-border shadow-md"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-muted/80 to-muted/60 flex items-center justify-center text-2xl shadow-sm">
                    {getCategoryEmoji(script.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-foreground font-bold text-sm truncate tracking-tight">{script.title}</h3>
                    <p className="text-muted-foreground/70 text-xs truncate mt-0.5">
                      {script.duration_minutes} min • {script.category}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* FAB Button */}
        <FABButton onClick={() => navigate('/scripts')} />
      </motion.div>
    </MainLayout>
  );
}