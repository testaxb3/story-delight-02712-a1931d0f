import { useNavigate } from 'react-router-dom';
import {
  Book, Sparkles, Flame, ChevronRight, Crown, Target, Trophy,
  Zap, Calendar, Play, Star, TrendingUp, Gift, Bell
} from 'lucide-react';
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
import { useCallback, useState, useMemo, useEffect } from 'react';
import { NotificationBell } from '@/components/Community/NotificationBell';
import { useProfileStats } from '@/hooks/useProfileStats';
import { PullToRefresh } from '@/components/common/PullToRefresh';
import { useTrackerDays } from '@/hooks/useTrackerDays';
import { OnboardingModal } from '@/components/Dashboard/OnboardingModal';
import { TrackerLogModal } from '@/components/Tracker/TrackerLogModal';
import { RequestScriptModal } from '@/components/Scripts/RequestScriptModal';
import { SupportSheet } from '@/components/Dashboard/SupportSheet';
import { DashboardQuickActions } from '@/components/Dashboard/DashboardQuickActions';
import { BonusGuidesCarousel } from '@/components/Dashboard/BonusGuidesCarousel';

// ============================================
// ANIMATED COUNTER HOOK
// ============================================
function useAnimatedCounter(target: number, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }

    const startTime = performance.now();
    let animationId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [target, duration]);

  return count;
}

// ============================================
// GET GREETING & LEVEL
// ============================================
function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function calculateLevel(xp: number): { level: number; currentXP: number; xpForNext: number; progress: number } {
  // XP thresholds: 0, 100, 250, 500, 1000, 2000, 4000, 8000...
  const thresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000];
  let level = 1;

  for (let i = 1; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) {
      level = i + 1;
    } else {
      break;
    }
  }

  const currentThreshold = thresholds[level - 1] || 0;
  const nextThreshold = thresholds[level] || thresholds[level - 1] + 10000;
  const currentXP = xp - currentThreshold;
  const xpForNext = nextThreshold - currentThreshold;
  const progress = (currentXP / xpForNext) * 100;

  return { level, currentXP, xpForNext, progress };
}

// ============================================
// PREMIUM HEADER
// ============================================
const PremiumHeader = ({
  user,
  greeting,
  level,
  xpProgress,
  streak,
  onProfilePress,
  onNotificationPress
}: {
  user: any;
  greeting: string;
  level: number;
  xpProgress: number;
  streak: number;
  onProfilePress: () => void;
  onNotificationPress: () => void;
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-5 pt-4 pb-3"
    >
      <div className="flex items-center justify-between">
        {/* Left - Profile & Greeting */}
        <motion.button
          onClick={onProfilePress}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3"
        >
          {/* Avatar with level ring */}
          <div className="relative">
            {user?.photo_url ? (
              <img
                src={user.photo_url}
                alt={user.user_metadata?.full_name || 'User'}
                className="w-14 h-14 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
            )}

            {/* Level badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-2 border-background shadow-lg"
            >
              <span className="text-[10px] font-bold text-white">{level}</span>
            </motion.div>

            {/* XP progress ring - moved outside image */}
          </div>

          <div className="text-left">
            <p className="text-xs text-muted-foreground">{greeting}</p>
            <h1 className="text-lg font-bold text-foreground">
              {user?.user_metadata?.full_name?.split(' ')[0] || 'Welcome'}
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Crown className="w-3 h-3 text-amber-400" />
              <span className="text-[10px] font-semibold text-amber-400">Level {level} Parent</span>
            </div>
          </div>
        </motion.button>

        {/* Right - Streak & Notifications */}
        <div className="flex items-center gap-2">
          {/* Fire Streak */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2.5 rounded-2xl cursor-pointer transition-all",
              streak > 0
                ? "bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30"
                : "bg-muted/50 border border-border"
            )}
          >
            {streak > 0 && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10"
              />
            )}
            <Flame className={cn(
              "w-5 h-5 relative z-10",
              streak > 0 ? "text-orange-400 fill-orange-400" : "text-muted-foreground"
            )} />
            <span className="text-base font-bold text-foreground relative z-10">{streak}</span>
          </motion.div>

          <NotificationBell userId={user?.id || null} />
        </div>
      </div>
    </motion.header>
  );
};

// ============================================
// TODAY'S FOCUS CARD (Premium CTA)
// ============================================
const TodaysFocusCard = ({
  scriptsRead,
  totalScripts,
  streak,
  onPress
}: {
  scriptsRead: number;
  totalScripts: number;
  streak: number;
  onPress: () => void;
}) => {
  const displayCount = useAnimatedCounter(scriptsRead);
  const progress = totalScripts > 0 ? (scriptsRead / totalScripts) * 100 : 0;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onPress}
      className="relative w-full p-6 rounded-[28px] overflow-hidden text-left"
    >
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] dark:from-[#1a1a2e] dark:via-[#16213e] dark:to-[#0f0f23]" />

      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-500/30 to-amber-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"
      />

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 backdrop-blur-sm" />

      {/* Border glow */}
      <div className="absolute inset-0 rounded-[28px] border border-white/10" />

      {/* Content */}
      <div className="relative z-10">
        {/* Top Row - Label */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white/80">Today's Progress</span>
          </div>
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronRight className="w-5 h-5 text-white/50" />
          </motion.div>
        </div>

        {/* Main Stats Row */}
        <div className="flex items-end justify-between">
          {/* Left - Big number */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-bold text-white tracking-tight">
                {displayCount}
              </span>
              <span className="text-2xl text-white/50 font-medium">/{totalScripts}</span>
            </div>
            <p className="text-sm text-white/60 mt-1">Scripts mastered</p>
          </div>

          {/* Right - Circular progress */}
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-white/10"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#heroProgressGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ strokeDasharray: '0 264' }}
                animate={{ strokeDasharray: `${progress * 2.64} 264` }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
              />
              <defs>
                <linearGradient id="heroProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Sparkles className="w-5 h-5 text-orange-400" />
              <span className="text-lg font-bold text-white">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* Bottom - Quick action hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-2 mt-5 pt-4 border-t border-white/10"
        >
          <Play className="w-4 h-4 text-orange-400 fill-orange-400" />
          <span className="text-sm font-medium text-white/70">Tap to start your next script</span>
        </motion.div>
      </div>
    </motion.button>
  );
};

// ============================================
// QUICK STATS GRID
// ============================================
const QuickStatsGrid = ({
  weeklyUses,
  totalUses,
  onWeeklyPress,
  onTotalPress
}: {
  weeklyUses: number;
  totalUses: number;
  onWeeklyPress: () => void;
  onTotalPress: () => void;
}) => {
  const animatedWeekly = useAnimatedCounter(weeklyUses);
  const animatedTotal = useAnimatedCounter(totalUses);

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* This Week */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onWeeklyPress}
        className="relative p-4 rounded-2xl overflow-hidden text-left"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 dark:from-indigo-500/20 dark:to-purple-500/10" />
        <div className="absolute inset-0 border border-indigo-500/20 rounded-2xl" />
        <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/20 rounded-full blur-2xl" />

        <div className="relative z-10">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-3xl font-bold text-foreground">{animatedWeekly}</p>
          <p className="text-xs text-muted-foreground font-medium">This week</p>
        </div>
      </motion.button>

      {/* Total Uses */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onTotalPress}
        className="relative p-4 rounded-2xl overflow-hidden text-left"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/5 dark:from-amber-500/20 dark:to-orange-500/10" />
        <div className="absolute inset-0 border border-amber-500/20 rounded-2xl" />
        <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/20 rounded-full blur-2xl" />

        <div className="relative z-10">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mb-3">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-foreground">{animatedTotal}</p>
          <p className="text-xs text-muted-foreground font-medium">Total uses</p>
        </div>
      </motion.button>
    </div>
  );
};

// ============================================
// ACHIEVEMENT PREVIEW
// ============================================
const AchievementPreview = ({ onPress }: { onPress: () => void }) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onPress}
      className="relative w-full p-4 rounded-2xl overflow-hidden text-left"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-rose-500/10 dark:from-amber-500/20 dark:via-orange-500/10 dark:to-rose-500/20" />
      <div className="absolute inset-0 border border-amber-500/20 rounded-2xl" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Achievements</h3>
            <p className="text-xs text-muted-foreground">Unlock badges & rewards</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {['🏆', '⭐', '🔥'].map((emoji, i) => (
              <motion.div
                key={emoji}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
                className="w-8 h-8 rounded-full bg-card border-2 border-background flex items-center justify-center text-lg"
              >
                {emoji}
              </motion.div>
            ))}
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </motion.button>
  );
};

// ============================================
// MAIN DASHBOARD
// ============================================
export default function DashboardPremium() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { activeChild } = useChildProfiles();
  const { data: dashboardStats, isLoading: statsLoading, error, refetch: refetchStats } = useDashboardStats(activeChild?.id);
  const { scripts: recentScripts, ebooks, isLoading: dataLoading, refetch: refetchData } = useDashboardData(activeChild, user?.id);
  const { data: profileStats, isLoading: profileStatsLoading, refetch: refetchProfileStats } = useProfileStats(activeChild?.brain_profile);
  const { data: trackerStats, refetch: refetchTracker } = useTrackerDays(user?.id, activeChild?.id);
  const { triggerHaptic } = useHaptic();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // FAB Modal States
  const [showLogModal, setShowLogModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showSupportSheet, setShowSupportSheet] = useState(false);

  // Onboarding Modal
  const [showOnboarding, setShowOnboarding] = useState(
    !localStorage.getItem('onboarding_completed')
  );

  const nextDay = trackerStats?.nextDay ?? null;
  const canLog = trackerStats?.canLogToday ?? false;
  const timeUntilNextLog = trackerStats?.timeUntilNextLog ?? null;

  const isLoading = statsLoading || dataLoading || profileStatsLoading;
  const currentStreak = dashboardStats?.currentStreak ?? 0;
  const scriptsRead = profileStats?.scriptsMastered ?? 0;
  const totalScripts = profileStats?.totalScripts ?? 0;
  const weeklyUses = dashboardStats?.scriptUsesWeek ?? 0;
  const totalUses = dashboardStats?.totalScriptUses ?? 0;

  // Calculate XP and Level (based on total uses + streak bonus)
  const totalXP = (totalUses * 10) + (currentStreak * 25);
  const { level, currentXP, xpForNext, progress: xpProgress } = calculateLevel(totalXP);

  const greeting = useMemo(() => getTimeBasedGreeting(), []);

  const handleNavigate = useCallback((path: string) => {
    triggerHaptic('light');
    navigate(path);
  }, [triggerHaptic, navigate]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    triggerHaptic('medium');
    try {
      await Promise.all([
        refetchStats?.(),
        refetchData?.(),
        refetchProfileStats?.(),
        refetchTracker?.(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchStats, refetchData, refetchProfileStats, refetchTracker, triggerHaptic]);

  if (isLoading) {
    return (
      <MainLayout>
        <DashboardSkeletonPremium />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
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
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-2xl shadow-lg shadow-orange-500/30"
            >
              Try Again
            </motion.button>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Ambient background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 pb-[calc(env(safe-area-inset-bottom)+7rem)]"
        >
          {/* Safe area */}
          <div className="h-[env(safe-area-inset-top)]" />

          {/* Premium Header */}
          <PremiumHeader
            user={user}
            greeting={greeting}
            level={level}
            xpProgress={xpProgress}
            streak={currentStreak}
            onProfilePress={() => handleNavigate('/profile')}
            onNotificationPress={() => { }}
          />

          {/* Main Content */}
          <PullToRefresh onRefresh={handleRefresh} disabled={isRefreshing}>
            <main className="px-5 space-y-4">
              {/* Hero Card */}
              <TodaysFocusCard
                scriptsRead={scriptsRead}
                totalScripts={totalScripts}
                streak={currentStreak}
                onPress={() => handleNavigate('/scripts')}
              />

              {/* Quick Stats */}
              <QuickStatsGrid
                weeklyUses={weeklyUses}
                totalUses={totalUses}
                onWeeklyPress={() => handleNavigate('/tracker')}
                onTotalPress={() => handleNavigate('/tracker')}
              />

              {/* Situation Picker */}
              <SituationPicker />

              {/* Achievement Preview */}
              <AchievementPreview onPress={() => handleNavigate('/achievements')} />

              {/* Bonus Guides */}
              <BonusGuidesCarousel
                ebooks={ebooks}
                onEbookPress={(slug) => handleNavigate(`/ebook/${slug}`)}
                onSeeAll={() => handleNavigate('/bonuses?category=ebook')}
              />
            </main>
          </PullToRefresh>
        </motion.div>

        <DashboardQuickActions
          canLog={canLog}
          timeUntilNextLog={timeUntilNextLog}
          onLogPress={() => setShowLogModal(true)}
          onRequestScriptPress={() => setShowRequestModal(true)}
          onSupportPress={() => setShowSupportSheet(true)}
        />

        {/* Modals */}
        <TrackerLogModal
          isOpen={showLogModal}
          onClose={() => setShowLogModal(false)}
          nextDay={nextDay}
          onComplete={() => {
            refetchTracker();
            refetchStats?.();
          }}
        />

        <RequestScriptModal
          open={showRequestModal}
          onOpenChange={setShowRequestModal}
        />

        <SupportSheet
          isOpen={showSupportSheet}
          onClose={() => setShowSupportSheet(false)}
        />

        {showOnboarding && (
          <OnboardingModal
            onComplete={() => setShowOnboarding(false)}
          />
        )}
      </div>
    </MainLayout>
  );
}
