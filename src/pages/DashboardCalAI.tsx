import { useNavigate } from 'react-router-dom';
import { Book, Sparkles } from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { DashboardSkeletonPremium } from '@/components/Dashboard/DashboardSkeletonPremium';
import { useDashboardData } from '@/hooks/useDashboardData';
import { SituationPicker } from '@/components/Dashboard/SituationPicker';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptic } from '@/hooks/useHaptic';
import { cn } from '@/lib/utils';
import { useCallback, useState, useMemo } from 'react';
import { NotificationBell } from '@/components/Community/NotificationBell';
import { useProfileStats } from '@/hooks/useProfileStats';
import { Flame, Info } from 'lucide-react';
import { PullToRefresh } from '@/components/common/PullToRefresh';

// Dashboard Components
import { containerVariants, itemVariants } from '@/components/Dashboard/animations';
import { AmbientBackground } from '@/components/Dashboard/AmbientBackground';
import { HeroMetricsCard } from '@/components/Dashboard/HeroMetricsCard';
import { InsightCard } from '@/components/Dashboard/InsightCard';
import { RecentActivity } from '@/components/Dashboard/RecentActivity';
import { BonusGuidesCarousel } from '@/components/Dashboard/BonusGuidesCarousel';
import { FloatingActionButton } from '@/components/Dashboard/FloatingActionButton';

// Zero State Components
import { 
  NewUserHeroCard, 
  MotivationInsightCard,
  EmptyRecentActivity 
} from '@/components/Dashboard/DashboardZeroStates';

// Get time-based greeting
function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardCalAI() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { activeChild } = useChildProfiles();
  const { data: dashboardStats, isLoading: statsLoading, error, refetch: refetchStats } = useDashboardStats(activeChild?.id);
  const { scripts: recentScripts, ebooks, isLoading: dataLoading, refetch: refetchData } = useDashboardData(activeChild, user?.id);
  const { data: profileStats, isLoading: profileStatsLoading, refetch: refetchProfileStats } = useProfileStats(activeChild?.brain_profile);
  const { triggerHaptic } = useHaptic();
  const [showStreakTooltip, setShowStreakTooltip] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isLoading = statsLoading || dataLoading || profileStatsLoading;
  const currentStreak = dashboardStats?.currentStreak ?? 0;
  const scriptsRead = profileStats?.scriptsMastered ?? 0;
  const totalScripts = profileStats?.totalScripts ?? 0;

  // Memoized greeting to avoid recalculation
  const greeting = useMemo(() => getTimeBasedGreeting(), []);

  const handleNavigate = useCallback((path: string) => {
    triggerHaptic('light');
    navigate(path);
  }, [triggerHaptic, navigate]);

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    triggerHaptic('medium');
    try {
      await Promise.all([
        refetchStats?.(),
        refetchData?.(),
        refetchProfileStats?.(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchStats, refetchData, refetchProfileStats, triggerHaptic]);

  if (isLoading) {
    return (
      <MainLayout hideSideNav>
        <DashboardSkeletonPremium />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout hideSideNav>
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-foreground mb-2">Unable to load</h2>
            <p className="text-muted-foreground mb-6">Please check your connection</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-2xl"
            >
              Try Again
            </motion.button>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout hideSideNav>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AmbientBackground />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 pb-[calc(env(safe-area-inset-bottom)+7rem)]"
        >
          {/* Safe area */}
          <div className="h-[env(safe-area-inset-top)]" />

          {/* Header */}
          <motion.header variants={itemVariants} className="px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {user?.photo_url ? (
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={user.photo_url}
                    alt={user.user_metadata?.full_name || 'User'}
                    className="w-12 h-12 rounded-2xl object-cover shadow-lg"
                  />
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30"
                  >
                    <span className="text-xl font-bold text-white dark:text-white">
                      {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </motion.div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground leading-tight">{greeting}</p>
                  <h1 className="text-base font-bold text-foreground leading-tight">
                    {user?.user_metadata?.full_name?.split(' ')[0] || 'Welcome'}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <NotificationBell userId={user?.id || null} />
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavigate('/achievements')}
                    onMouseEnter={() => currentStreak === 0 && setShowStreakTooltip(true)}
                    onMouseLeave={() => setShowStreakTooltip(false)}
                    onTouchStart={() => currentStreak === 0 && setShowStreakTooltip(true)}
                    onTouchEnd={() => setTimeout(() => setShowStreakTooltip(false), 2000)}
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer border transition-all",
                      currentStreak > 0
                        ? "bg-orange-500/15 border-orange-500/30"
                        : "bg-white/5 dark:bg-white/5 border-border/20"
                    )}
                  >
                    <Flame className={cn(
                      "w-4 h-4 transition-colors",
                      currentStreak > 0 ? "text-orange-400 fill-orange-400" : "text-muted-foreground"
                    )} />
                    <span className="text-sm font-bold text-foreground">{currentStreak}</span>
                    {currentStreak === 0 && (
                      <Info className="w-3 h-3 text-muted-foreground/50" />
                    )}
                  </motion.div>

                  {/* Streak Tooltip for new users */}
                  <AnimatePresence>
                    {showStreakTooltip && currentStreak === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        className="absolute top-full right-0 mt-2 p-3 bg-card border border-border rounded-xl shadow-lg z-50 w-48"
                      >
                        <div className="flex items-start gap-2">
                          <Flame className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-foreground">Daily Streak</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              Use scripts daily to build your streak and unlock achievements!
                            </p>
                          </div>
                        </div>
                        {/* Arrow */}
                        <div className="absolute -top-1.5 right-6 w-3 h-3 bg-card border-l border-t border-border rotate-45" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.header>

          {/* Main Content with Pull-to-Refresh */}
          <PullToRefresh onRefresh={handleRefresh} disabled={isRefreshing}>
            <main className="px-5 space-y-4">
              {/* Hero Section */}
              {scriptsRead === 0 && totalScripts === 0 ? (
                <NewUserHeroCard
                  childName={activeChild?.name}
                  onPress={() => handleNavigate('/scripts')}
                />
              ) : (
                <HeroMetricsCard
                  scriptsRead={scriptsRead}
                  totalScripts={totalScripts}
                  onPress={() => handleNavigate('/scripts')}
                />
              )}

              {/* Situation Picker */}
              <SituationPicker />

              {/* Insight Cards */}
              <div className="flex gap-3">
                {(dashboardStats?.scriptUsesWeek ?? 0) === 0 ? (
                  <MotivationInsightCard
                    type="weekly"
                    onPress={() => handleNavigate('/scripts')}
                  />
                ) : (
                  <InsightCard
                    icon={<Book className="w-5 h-5 text-indigo-400" />}
                    label="This week"
                    value={dashboardStats?.scriptUsesWeek ?? 0}
                    color="bg-indigo-500"
                    onPress={() => handleNavigate('/tracker')}
                  />
                )}
                {(dashboardStats?.totalScriptUses ?? 0) === 0 ? (
                  <MotivationInsightCard
                    type="total"
                    onPress={() => handleNavigate('/scripts')}
                  />
                ) : (
                  <InsightCard
                    icon={<Sparkles className="w-5 h-5 text-amber-400" />}
                    label="Total uses"
                    value={dashboardStats?.totalScriptUses ?? 0}
                    color="bg-amber-500"
                    onPress={() => handleNavigate('/tracker')}
                  />
                )}
              </div>

              {/* Recent Activity */}
              {recentScripts.length === 0 ? (
                <EmptyRecentActivity onPress={() => handleNavigate('/scripts')} />
              ) : (
                <RecentActivity
                  scripts={recentScripts}
                  onScriptPress={() => handleNavigate('/scripts')}
                  onSeeAll={() => handleNavigate('/scripts')}
                />
              )}

              {/* Bonus Guides */}
              <BonusGuidesCarousel
                ebooks={ebooks}
                onEbookPress={(slug) => handleNavigate(`/ebook/${slug}`)}
                onSeeAll={() => handleNavigate('/bonuses?category=ebook')}
              />
            </main>
          </PullToRefresh>
        </motion.div>

        <FloatingActionButton onPress={() => handleNavigate('/scripts')} />
      </div>
    </MainLayout>
  );
}
