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
import logo from '@/assets/logo.svg';

export default function DashboardCalAI() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { activeChild } = useChildProfiles();
  const { data: dashboardStats, isLoading, error } = useDashboardStats();
  const { data: scriptsForProfile } = useScriptsByProfile(activeChild?.brain_profile);
  const [recentScripts, setRecentScripts] = useState<any[]>([]);
  const [latestVideo, setLatestVideo] = useState<any>(null);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
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

  const totalCarouselCards = 2 + (latestVideo ? 1 : 0);

  return (
    <MainLayout hideSideNav>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-background pb-32 relative overflow-hidden transition-colors duration-300"
      >
        {/* Ambient Background Effect - Removed for cleaner light mode */}
        <div className="hidden dark:block fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="hidden dark:block fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none z-0" />

        {/* Fixed Header Background for Status Bar */}
        <div className="fixed top-0 left-0 right-0 z-40 h-[calc(env(safe-area-inset-top)+80px)] bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none" />

        {/* Header - Logo & Streak */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-50 px-6 pt-[calc(env(safe-area-inset-top)+8px)] pb-6 flex items-center justify-between"
        >
          <img src={logo} alt="NEP" className="h-8 w-auto" />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              triggerHaptic('light');
              navigate('/achievements');
            }}
            className="flex items-center gap-2 bg-card backdrop-blur-md border border-border px-4 py-2 rounded-full shadow-sm cursor-pointer"
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

        {/* Weekly Calendar */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="px-4 mb-8"
        >
          <div className="flex justify-between items-center bg-card/50 backdrop-blur-sm p-4 rounded-3xl border border-border shadow-sm">
            {weekDays.map((day, index) => (
              <motion.button
                key={day.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (index * 0.05) }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 group"
              >
                <span className={cn(
                  "text-[11px] font-medium uppercase tracking-wider transition-colors",
                  day.isToday ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/80"
                )}>
                  {day.label}
                </span>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-base font-bold transition-all relative",
                  day.isToday
                    ? "bg-primary text-primary-foreground shadow-lg scale-110"
                    : "text-muted-foreground group-hover:bg-muted"
                )}>
                  {day.date}
                  {/* Activity indicator dots */}
                  {day.isPast && !day.isToday && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + (index * 0.05) }}
                      className="absolute -bottom-1 flex gap-0.5"
                    >
                      <div className="w-1 h-1 rounded-full bg-green-500" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Horizontal Scroll Carousel */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          ref={carouselRef}
          className="mb-8 overflow-x-auto pb-4 px-6 scrollbar-hide snap-x snap-mandatory flex gap-4"
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

          {/* Card 2: Tracker CTA */}
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
                navigate('/tracker');
              }}
              className="h-full bg-card border border-border rounded-[32px] p-6 flex flex-col justify-between relative overflow-hidden group cursor-pointer shadow-sm"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-500/10 rounded-2xl">
                  <Calendar className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
                  TRACK
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-foreground mb-1">Daily Log</h3>
                <p className="text-muted-foreground text-sm mb-4">Track meltdowns and progress.</p>
                <div className="w-full bg-muted h-12 rounded-xl flex items-center justify-center text-sm font-medium text-foreground group-hover:bg-muted/80 transition-colors">
                  Log Today
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Card 3: Latest Video */}
          {latestVideo && (
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="snap-center shrink-0 w-[85vw] max-w-sm"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  triggerHaptic('medium');
                  navigate('/bonuses?category=video');
                }}
                className="h-full bg-card border border-border rounded-[32px] p-6 flex flex-col justify-between relative overflow-hidden group cursor-pointer shadow-sm"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-2xl">
                    <Play className="w-6 h-6 text-purple-500 dark:text-purple-400 fill-purple-500 dark:fill-purple-400" />
                  </div>
                  <div className="bg-purple-500/10 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-bold">
                    NEW
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1">{latestVideo.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-1">Latest expert guidance</p>
                  <div className="w-full bg-muted h-12 rounded-xl flex items-center justify-center text-sm font-medium text-foreground group-hover:bg-muted/80 transition-colors">
                    Watch Now
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Dynamic Dots Indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {[...Array(totalCarouselCards)].map((_, index) => (
            <motion.div
              key={index}
              animate={{
                width: activeCarouselIndex === index ? 16 : 8,
              }}
              transition={{ duration: 0.3 }}
              className={cn(
                "h-2 rounded-full transition-colors",
                activeCarouselIndex === index ? "bg-primary" : "bg-muted"
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
          <h2 className="text-xl font-bold text-foreground mb-4">Quick Stats</h2>
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Recently Added</h2>
              <button onClick={() => navigate('/scripts')} className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
                SEE ALL
              </button>
            </div>

            <div className="space-y-4">
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
                  className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform hover:bg-muted/50 shadow-sm"
                >
                  <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-2xl">
                    {getCategoryEmoji(script.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-foreground font-bold text-sm truncate">{script.title}</h3>
                    <p className="text-muted-foreground text-xs truncate">
                      {script.duration_minutes} min • {script.category}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
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