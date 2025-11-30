import { useNavigate } from 'react-router-dom';
import { Book, Sparkles } from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { DashboardSkeletonPremium } from '@/components/Dashboard/DashboardSkeletonPremium';
import { useDashboardData } from '@/hooks/useDashboardData';
import { SituationPicker } from '@/components/Dashboard/SituationPicker';
import { motion } from 'framer-motion';
import { useHaptic } from '@/hooks/useHaptic';
import { cn } from '@/lib/utils';
import { useCallback } from 'react';
import { NotificationBell } from '@/components/Community/NotificationBell';
import { useProfileStats } from '@/hooks/useProfileStats';
import { Flame } from 'lucide-react';

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
  JourneyStartCard, 
  MotivationInsightCard,
  EmptyRecentActivity 
} from '@/components/Dashboard/DashboardZeroStates';

export default function DashboardCalAI() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { activeChild } = useChildProfiles();
  const { data: dashboardStats, isLoading: statsLoading, error } = useDashboardStats(activeChild?.id);
  const { scripts: recentScripts, ebooks, isLoading: dataLoading } = useDashboardData(activeChild, user?.id);
  const { data: profileStats, isLoading: profileStatsLoading } = useProfileStats(activeChild?.brain_profile);
  const { triggerHaptic } = useHaptic();

  const isLoading = statsLoading || dataLoading || profileStatsLoading;
  const currentStreak = dashboardStats?.currentStreak ?? 0;
  const scriptsRead = profileStats?.scriptsMastered ?? 0;
  const totalScripts = profileStats?.totalScripts ?? 0;

  const handleNavigate = useCallback((path: string) => {
    triggerHaptic('light');
    navigate(path);
  }, [triggerHaptic, navigate]);

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
                  <h1 className="text-base font-bold text-foreground leading-tight">
                    {user?.user_metadata?.full_name || 'Welcome'}
                  </h1>
                  <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                    {activeChild?.name ? `${activeChild.name}'s progress` : 'Select a child profile'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <NotificationBell userId={user?.id || null} />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigate('/achievements')}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer border",
                    currentStreak > 0 
                      ? "bg-orange-500/15 border-orange-500/30" 
                      : "bg-white/5 dark:bg-white/5 border-border/20"
                  )}
                >
                  <Flame className={cn(
                    "w-4 h-4",
                    currentStreak > 0 ? "text-orange-400 fill-orange-400" : "text-muted-foreground"
                  )} />
                  <span className="text-sm font-bold text-foreground">{currentStreak}</span>
                </motion.div>
              </div>
            </div>
          </motion.header>

          {/* Main Content */}
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

            {/* Journey Section */}
            <JourneyStartCard onPress={() => handleNavigate('/scripts')} />

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
        </motion.div>

        <FloatingActionButton onPress={() => handleNavigate('/scripts')} />
      </div>
    </MainLayout>
  );
}
