import { useNavigate } from 'react-router-dom';
import { Flame, ChevronRight, Book, Play, Plus, Sparkles } from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { DashboardSkeletonPremium } from '@/components/Dashboard/DashboardSkeletonPremium';
import { useDashboardData } from '@/hooks/useDashboardData';
import { SituationPicker } from '@/components/Dashboard/SituationPicker';
import { CATEGORY_EMOJIS } from '@/lib/scriptUtils';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useHaptic } from '@/hooks/useHaptic';
import { cn } from '@/lib/utils';
import { memo, useMemo, useState, useEffect, useCallback, useRef } from 'react';
// Removed: useTrackerDays - HorizontalDatePicker removed
import { NotificationBell } from '@/components/Community/NotificationBell';

// Removed: useCategoryStats - CategoryRings removed
import { useProfileStats } from '@/hooks/useProfileStats';
import { 
  NewUserHeroCard, 
  JourneyStartCard, 
  MotivationInsightCard,
  EmptyRecentActivity 
} from '@/components/Dashboard/DashboardZeroStates';

// ============================================================================
// PERFORMANCE-OPTIMIZED DESIGN SYSTEM
// CSS animations for background, Framer only for interactions
// ============================================================================

// Spring configurations - Apple's signature feel
const SPRING = {
  gentle: { type: "spring", stiffness: 120, damping: 14 },
  snappy: { type: "spring", stiffness: 400, damping: 30 },
  bouncy: { type: "spring", stiffness: 300, damping: 20, mass: 0.8 },
} as const;

// Stagger animation for lists
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: SPRING.gentle,
  },
};

// ============================================================================
// AMBIENT BACKGROUND - CSS ONLY (GPU Accelerated) - Theme Aware
// ============================================================================
// GPU-optimized ambient background - absolute positioning to prevent scroll jank
const AmbientBackground = memo(function AmbientBackground() {
  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ contain: 'strict' }}
    >
      {/* Primary gradient orb - CSS animation */}
      <div
        className="absolute -top-[30%] -right-[20%] w-[70%] h-[70%] rounded-full animate-ambient-1 opacity-100 dark:opacity-100 blur-[40px]"
        style={{
          background: 'radial-gradient(circle, var(--ambient-orange) 0%, transparent 70%)',
          willChange: 'transform',
          contain: 'layout paint',
        }}
      />

      {/* Secondary accent orb - CSS animation */}
      <div
        className="absolute -bottom-[20%] -left-[25%] w-[60%] h-[60%] rounded-full animate-ambient-2 opacity-100 dark:opacity-100 blur-[40px]"
        style={{
          background: 'radial-gradient(circle, var(--ambient-indigo) 0%, transparent 70%)',
          willChange: 'transform',
          contain: 'layout paint',
        }}
      />
    </div>
  );
});

// REMOVED: HorizontalDatePicker - UI without functionality

// ============================================================================
// HERO METRICS CARD - 3D Tilt Effect with Mesh Gradient
// ============================================================================
const HeroMetricsCard = memo(function HeroMetricsCard({
  scriptsRead,
  totalScripts,
  onPress,
}: {
  scriptsRead: number;
  totalScripts: number;
  onPress: () => void;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const progress = totalScripts > 0 ? (scriptsRead / totalScripts) * 100 : 0;
  const circumference = 2 * Math.PI * 44;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Animated counter using requestAnimationFrame (60fps, non-blocking)
  const [displayCount, setDisplayCount] = useState(0);
  useEffect(() => {
    if (scriptsRead === 0) {
      setDisplayCount(0);
      return;
    }
    
    const duration = 1200; // ms
    const startTime = performance.now();
    let animationId: number;
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing: ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * scriptsRead);
      
      setDisplayCount(value);
      
      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [scriptsRead]);

  return (
    <motion.button
      ref={cardRef}
      variants={itemVariants}
      whileTap={{ scale: 0.98 }}
      onClick={onPress}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full p-5 rounded-hero overflow-hidden text-left"
    >
      {/* Mesh gradient background - Theme aware with better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-card via-card/95 to-card/90 dark:from-background/80 dark:via-background/60 dark:to-background/40" />

      {/* Animated mesh overlay */}
      <div
        className="absolute inset-0 opacity-20 dark:opacity-60"
        style={{
          backgroundImage: `
            radial-gradient(at 40% 20%, rgba(251,146,60,0.15) 0px, transparent 50%),
            radial-gradient(at 80% 0%, rgba(99,102,241,0.12) 0px, transparent 50%),
            radial-gradient(at 0% 50%, rgba(251,146,60,0.1) 0px, transparent 50%),
            radial-gradient(at 80% 100%, rgba(99,102,241,0.1) 0px, transparent 50%)
          `,
        }}
      />

      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, transparent 50%)',
        }}
      />

      {/* Glass border - stronger in light mode */}
      <div className="absolute inset-0 rounded-hero border-2 border-border/30 dark:border-border" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between">
        {/* Left - Stats */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, ...SPRING.gentle }}
          >
            {/* Number and total */}
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-6xl font-bold text-foreground tracking-tight">
                {displayCount}
              </span>
              <span className="text-xl text-muted-foreground font-medium">/ {totalScripts}</span>
            </div>

            {/* Label - Impact focused, not ego metric */}
            <p className="text-sm text-muted-foreground font-medium">Times you helped</p>
          </motion.div>
        </div>

        {/* Right - Circular Progress */}
        <div className="relative w-28 h-28">
          {/* Glow behind ring */}
          <div className="absolute inset-2 rounded-full bg-foreground/5 blur-xl" />

          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
            {/* Track */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-foreground/[0.08]"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress with gradient */}
            <motion.circle
              cx="50"
              cy="50"
              r="44"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
              style={{ strokeDasharray: circumference }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Flame className="w-6 h-6 text-orange-400" />
            <span className="text-lg font-bold text-foreground">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center gap-1 mt-4 text-muted-foreground"
      >
        <span className="text-xs">Tap to explore scripts</span>
        <ChevronRight className="w-3 h-3" />
      </motion.div>
    </motion.button>
  );
});

// ============================================================================
// INSIGHT CARDS - Glass morphism with depth
// ============================================================================
const InsightCard = memo(function InsightCard({
  icon,
  label,
  value,
  trend,
  color,
  delay = 0,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  color: string;
  delay?: number;
  onPress: () => void;
}) {
  return (
    <motion.button
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onPress}
      className="relative flex-1 p-4 rounded-panel overflow-hidden text-left"
    >
      {/* Glass background */}
      <div className="absolute inset-0 bg-card/50 backdrop-blur-xl" />
      <div className="absolute inset-0 rounded-panel border border-border" />

      {/* Colored accent glow */}
      <div
        className={cn("absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-30", color)}
      />

      <div className="relative z-10">
        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-3", color.replace('bg-', 'bg-') + '/20')}>
          {icon}
        </div>

        <p className="text-2xl font-bold text-foreground mb-0.5">{value}</p>
        <p className="text-xs text-muted-foreground font-medium">{label}</p>

        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <div className="w-1 h-1 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-emerald-400 font-medium">{trend}</span>
          </div>
        )}
      </div>
    </motion.button>
  );
});

// REMOVED: CategoryRings - replaced by JourneyStartCard

// ============================================================================
// RECENT ACTIVITY - Timeline style
// ============================================================================
const RecentActivity = memo(function RecentActivity({
  scripts,
  onScriptPress,
  onSeeAll,
}: {
  scripts: any[];
  onScriptPress: (id: string) => void;
  onSeeAll: () => void;
}) {
  const getCategoryEmoji = (category: string) => {
    const categoryKey = category?.toLowerCase().replace(/\s+/g, '_') || '';
    return CATEGORY_EMOJIS[categoryKey] || '🧠';
  };

  return (
    <motion.div variants={itemVariants}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
        <motion.button
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSeeAll}
          className="flex items-center gap-1 text-sm text-muted-foreground"
        >
          See all
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="space-y-3">
        {scripts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative p-6 rounded-2xl overflow-hidden text-center"
          >
            <div className="absolute inset-0 bg-card/30" />
            <div className="absolute inset-0 rounded-2xl border border-dashed border-border" />
            <div className="relative z-10">
              <div className="text-4xl mb-3">📚</div>
              <p className="text-sm text-muted-foreground">No scripts read yet today</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Tap + to start your journey</p>
            </div>
          </motion.div>
        ) : (
          scripts.slice(0, 3).map((script, index) => (
            <motion.button
              key={script.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01, x: 4 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onScriptPress(script.id)}
              className="relative w-full p-4 rounded-item overflow-hidden text-left"
            >
              <div className="absolute inset-0 bg-card/50" />
              <div className="absolute inset-0 rounded-item border border-border" />

              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center text-2xl">
                  {getCategoryEmoji(script.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-foreground truncate">{script.title}</h4>
                  <p className="text-xs text-muted-foreground capitalize">{script.category}</p>
                </div>

                <ChevronRight className="w-4 h-4 text-muted-foreground/30 flex-shrink-0" />
              </div>
            </motion.button>
          ))
        )}
      </div>
    </motion.div>
  );
});

// ============================================================================
// BONUS GUIDES CAROUSEL - 3D perspective
// ============================================================================
const BonusGuidesCarousel = memo(function BonusGuidesCarousel({
  ebooks,
  onEbookPress,
  onSeeAll,
}: {
  ebooks: any[];
  onEbookPress: (slug: string) => void;
  onSeeAll: () => void;
}) {
  if (ebooks.length === 0) return null;

  return (
    <motion.div variants={itemVariants}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">Bonus Guides</h3>
        <motion.button
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSeeAll}
          className="flex items-center gap-1 text-sm text-muted-foreground"
        >
          See all
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
        {ebooks.slice(0, 5).map((ebook, index) => (
          <motion.button
            key={ebook.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, ...SPRING.gentle }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEbookPress(ebook.slug)}
            className="relative min-w-[130px] w-[130px] flex-shrink-0"
            style={{ perspective: 1000 }}
          >
            {/* Book cover with 3D effect and premium frame */}
            <div
              className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border-[3px] border-white/20 dark:border-white/10"
              style={{
                transformStyle: 'preserve-3d',
                boxShadow: '0 15px 30px -8px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
              }}
            >
              {ebook.thumbnail ? (
                <img
                  src={ebook.thumbnail}
                  alt={ebook.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Book className="w-8 h-8 text-white dark:text-white/50" />
                </div>
              )}

              {/* Shine overlay */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)',
                }}
              />
            </div>

            {/* Title */}
            <h4 className="mt-2 text-xs font-medium text-foreground/90 line-clamp-2 text-left h-8 leading-tight">
              {ebook.title}
            </h4>

            {/* Continue Button - Outside */}
            {ebook.isStarted && (
              <div className="mt-2 flex">
                <div className="bg-primary/10 text-primary dark:text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                  <Play className="w-2 h-2 fill-current" /> Continue
                </div>
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
});

// ============================================================================
// FLOATING ACTION BUTTON - Apple style with haptic
// ============================================================================
const FloatingActionButton = memo(function FloatingActionButton({
  onPress,
}: {
  onPress: () => void;
}) {
  const { triggerHaptic } = useHaptic();

  const handlePress = () => {
    triggerHaptic('medium');
    onPress();
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, ...SPRING.bouncy }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handlePress}
      className="fixed z-50 w-[60px] h-[60px] rounded-full flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 shadow-fab"
      style={{
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 6rem)',
        right: '1.25rem',
      }}
    >
      {/* Pulsing glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-full bg-orange-500 blur-xl"
      />

      <Plus className="relative z-10 w-7 h-7 text-white dark:text-white" strokeWidth={2.5} />
    </motion.button>
  );
});

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================
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
  
  // Use profile-specific stats if available, otherwise fallback (or 0)
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
        {/* Ambient particles */}
        <AmbientBackground />

        {/* Content */}
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
                {/* Parent (User) profile picture */}
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
                  {/* Parent name (larger) */}
                  <h1 className="text-base font-bold text-foreground leading-tight">
                    {user?.user_metadata?.full_name || 'Welcome'}
                  </h1>
                  {/* Child name (smaller, underneath) */}
                  <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                    {activeChild?.name ? `${activeChild.name}'s progress` : 'Select a child profile'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Notification Bell */}
                <NotificationBell userId={user?.id || null} />

                {/* Streak badge */}
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

          {/* Removed: HorizontalDatePicker - no functionality */}

          {/* Main Content */}
          <main className="px-5 space-y-4">
            {/* Hero Section - Conditional based on user stage */}
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

            {/* Situation Picker - Quick access for "Exhausted Emily" */}
            <SituationPicker />

            {/* Insight Cards Row - Conditional zero-states */}
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

            {/* Journey Section - Always show milestones */}
            <JourneyStartCard onPress={() => handleNavigate('/scripts')} />

            {/* Recent Activity - Conditional empty state */}
            {recentScripts.length === 0 ? (
              <EmptyRecentActivity onPress={() => handleNavigate('/scripts')} />
            ) : (
              <RecentActivity
                scripts={recentScripts}
                onScriptPress={(id) => handleNavigate(`/scripts`)}
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

        {/* FAB */}
        <FloatingActionButton onPress={() => handleNavigate('/scripts')} />
      </div>
    </MainLayout>
  );
}