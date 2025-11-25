import { useNavigate } from 'react-router-dom';
import { Flame, Sparkles, ChevronRight, Book, Play, Target, TrendingUp, Zap } from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useScriptsByProfile } from '@/hooks/useScriptsByProfile';
import { DashboardSkeletonPremium } from '@/components/Dashboard/DashboardSkeletonPremium';
import { useDashboardData } from '@/hooks/useDashboardData';
import { CATEGORY_EMOJIS } from '@/lib/scriptUtils';
import { motion } from 'framer-motion';
import { useHaptic } from '@/hooks/useHaptic';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { memo, useMemo } from 'react';

// ============================================================================
// DESIGN TOKENS - Centralized for consistency
// ============================================================================
const RADIUS = {
  sm: 'rounded-xl',
  md: 'rounded-2xl',
  lg: 'rounded-3xl',
} as const;

// ============================================================================
// BACKGROUND COMPONENT
// ============================================================================
const DashboardBackground = memo(function DashboardBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Gradient orbs */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-gradient-to-br from-orange-500/8 via-rose-500/5 to-transparent rounded-full blur-[100px]"
      />
      <motion.div
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-tr from-blue-500/6 via-cyan-500/4 to-transparent rounded-full blur-[80px]"
      />
    </div>
  );
});

// ============================================================================
// STREAK CELEBRATION COMPONENT
// ============================================================================
const StreakCard = memo(function StreakCard({ 
  streak, 
  onPress 
}: { 
  streak: number;
  onPress: () => void;
}) {
  const streakTier = useMemo(() => {
    if (streak >= 30) return { label: 'On Fire', color: 'from-orange-500 to-red-500', bg: 'bg-orange-500/10' };
    if (streak >= 14) return { label: 'Committed', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10' };
    if (streak >= 7) return { label: 'Building', color: 'from-yellow-500 to-amber-500', bg: 'bg-yellow-500/10' };
    return { label: 'Starting', color: 'from-slate-400 to-slate-500', bg: 'bg-slate-500/10' };
  }, [streak]);

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onPress}
      className={cn(
        "relative w-full p-4 overflow-hidden",
        RADIUS.lg,
        "bg-card border border-border/50",
        "flex items-center gap-4"
      )}
    >
      {/* Glow effect */}
      <div className={cn(
        "absolute -top-1/2 -right-1/4 w-32 h-32 rounded-full blur-2xl opacity-50",
        streakTier.bg
      )} />
      
      {/* Flame icon */}
      <div className={cn(
        "relative w-14 h-14 flex items-center justify-center",
        RADIUS.md,
        streakTier.bg
      )}>
        <Flame className={cn(
          "w-7 h-7",
          streak >= 7 ? "text-orange-500 fill-orange-500" : "text-muted-foreground"
        )} />
      </div>
      
      {/* Content */}
      <div className="flex-1 text-left relative z-10">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground">{streak}</span>
          <span className="text-sm text-muted-foreground">day streak</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{streakTier.label}</p>
      </div>
      
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </motion.button>
  );
});

// ============================================================================
// HERO CARD - Primary CTA
// ============================================================================
const HeroCard = memo(function HeroCard({
  childName,
  profile,
  scriptsCount,
  onPress,
}: {
  childName: string;
  profile: string;
  scriptsCount: number;
  onPress: () => void;
}) {
  const profileGradient = useMemo(() => {
    switch (profile?.toUpperCase()) {
      case 'INTENSE': return 'from-orange-500 via-rose-500 to-pink-600';
      case 'DISTRACTED': return 'from-blue-500 via-cyan-500 to-teal-500';
      case 'DEFIANT': return 'from-purple-500 via-violet-500 to-indigo-500';
      default: return 'from-slate-500 via-slate-600 to-slate-700';
    }
  }, [profile]);

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onPress}
      className={cn(
        "relative w-full p-6 overflow-hidden text-left",
        RADIUS.lg,
        "bg-gradient-to-br",
        profileGradient,
        "shadow-xl"
      )}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-6 -mb-6" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
            <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
              {profile} Profile
            </span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-1">
          Scripts for {childName}
        </h2>
        <p className="text-white/70 text-sm mb-6">
          {scriptsCount} personalized scripts ready
        </p>
        
        <div className="flex items-center gap-2 text-white font-semibold">
          <span>Explore Scripts</span>
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </motion.button>
  );
});

// ============================================================================
// QUICK ACTION BUTTON
// ============================================================================
const QuickAction = memo(function QuickAction({
  icon: Icon,
  label,
  sublabel,
  color,
  onPress,
}: {
  icon: typeof Sparkles;
  label: string;
  sublabel: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onPress}
      className={cn(
        "relative p-4 text-left overflow-hidden",
        RADIUS.lg,
        "bg-card border border-border/50",
        "flex flex-col justify-between h-32"
      )}
    >
      {/* Glow */}
      <div className={cn(
        "absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-30",
        color
      )} />
      
      <div className={cn(
        "w-10 h-10 flex items-center justify-center",
        RADIUS.md,
        color.replace('bg-', 'bg-') + '/10'
      )}>
        <Icon className={cn("w-5 h-5", color.replace('bg-', 'text-'))} />
      </div>
      
      <div className="relative z-10">
        <span className="text-sm font-semibold text-foreground block">{label}</span>
        <span className="text-xs text-muted-foreground">{sublabel}</span>
      </div>
    </motion.button>
  );
});

// ============================================================================
// LOG PROGRESS CTA
// ============================================================================
const LogProgressCard = memo(function LogProgressCard({
  onPress,
}: {
  onPress: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onPress}
      className={cn(
        "relative w-full p-5 overflow-hidden",
        RADIUS.lg,
        "bg-gradient-to-r from-emerald-500 to-teal-500",
        "flex items-center gap-4 shadow-lg shadow-emerald-500/20"
      )}
    >
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8" />
      
      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
        <Target className="w-6 h-6 text-white" />
      </div>
      
      <div className="flex-1 text-left relative z-10">
        <span className="text-lg font-bold text-white block">Log Today's Progress</span>
        <span className="text-sm text-white/80">Keep building momentum</span>
      </div>
      
      <ChevronRight className="w-6 h-6 text-white/70" />
    </motion.button>
  );
});

// ============================================================================
// EBOOK CARD
// ============================================================================
const EbookCard = memo(function EbookCard({
  ebook,
  onPress,
}: {
  ebook: {
    id: string;
    title: string;
    thumbnail?: string;
    isStarted?: boolean;
  };
  onPress: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onPress}
      className="min-w-[140px] w-[140px] flex flex-col"
    >
      {/* Cover */}
      <div className={cn(
        "relative aspect-[3/4] w-full overflow-hidden mb-3",
        RADIUS.md,
        "bg-card border border-border/50",
        "shadow-lg"
      )}>
        {ebook.thumbnail ? (
          <img 
            src={ebook.thumbnail} 
            alt={ebook.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Book className="w-8 h-8 text-white/50" />
          </div>
        )}
        
        {/* Continue badge */}
        {ebook.isStarted && (
          <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm py-1.5 px-2 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-white">
              <Play className="w-2.5 h-2.5 fill-white" /> Continue
            </div>
          </div>
        )}
      </div>
      
      {/* Title */}
      <h3 className="text-xs font-semibold text-foreground line-clamp-2 text-left leading-tight">
        {ebook.title}
      </h3>
    </motion.button>
  );
});

// ============================================================================
// RECENT SCRIPT CARD
// ============================================================================
const RecentScriptCard = memo(function RecentScriptCard({
  script,
  onPress,
}: {
  script: {
    id: string;
    title: string;
    category: string;
    duration_minutes?: number;
  };
  onPress: () => void;
}) {
  const getCategoryEmoji = (category: string) => {
    const categoryKey = category.toLowerCase().replace(/\s+/g, '_');
    return CATEGORY_EMOJIS[categoryKey] || '🧠';
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onPress}
      className={cn(
        "min-w-[200px] p-4 text-left",
        RADIUS.lg,
        "bg-card border border-border/50"
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{getCategoryEmoji(script.category)}</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {script.category}
        </span>
      </div>
      
      <h4 className="font-semibold text-foreground text-sm line-clamp-2 leading-snug mb-2">
        {script.title}
      </h4>
      
      {script.duration_minutes && (
        <span className="text-xs text-muted-foreground">
          {script.duration_minutes} min read
        </span>
      )}
    </motion.button>
  );
});

// ============================================================================
// SECTION HEADER
// ============================================================================
const SectionHeader = memo(function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      {action && onAction && (
        <button 
          onClick={onAction}
          className="text-sm font-semibold text-primary"
        >
          {action}
        </button>
      )}
    </div>
  );
});

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================
export default function DashboardCalAI() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { activeChild, childProfiles } = useChildProfiles();
  const { data: dashboardStats, isLoading: statsLoading, error } = useDashboardStats();
  const { data: scriptsForProfile } = useScriptsByProfile(activeChild?.brain_profile);
  const { scripts: recentScripts, ebooks, isLoading: dataLoading } = useDashboardData(activeChild, user?.id);
  const { triggerHaptic } = useHaptic();
  
  const isLoading = statsLoading || dataLoading;
  const currentStreak = Math.max(dashboardStats?.totalTrackerEntries ?? 0, 1);

  // Greeting based on time
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const handleNavigate = (path: string) => {
    triggerHaptic('light');
    navigate(path);
  };

  // Loading state
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
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-foreground mb-2">Unable to load</h2>
            <p className="text-muted-foreground mb-6">Please check your connection</p>
            <button 
              onClick={() => window.location.reload()} 
              className={cn(
                "px-6 py-3 bg-primary text-primary-foreground font-semibold",
                RADIUS.md
              )}
            >
              Try Again
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout hideSideNav>
      <div className="min-h-screen relative pb-[calc(env(safe-area-inset-bottom)+5rem)]">
        {/* Background */}
        <DashboardBackground />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header Spacer for status bar */}
          <div className="w-full h-[calc(env(safe-area-inset-top)+20px)]" />

          {/* Header */}
          <header className="px-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{greeting}</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-background shadow-lg">
                    <AvatarImage src={activeChild?.photo_url || undefined} />
                    <AvatarFallback className="text-sm font-bold bg-primary text-primary-foreground">
                      {activeChild?.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-xl font-bold text-foreground">{activeChild?.name}</h1>
                    <p className="text-xs text-muted-foreground capitalize">
                      {activeChild?.brain_profile?.toLowerCase()} profile
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Profile switcher - only if multiple children */}
              {childProfiles.length > 1 && (
                <button
                  onClick={() => handleNavigate('/profile')}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium",
                    RADIUS.sm,
                    "bg-secondary/50 text-muted-foreground",
                    "border border-border/50"
                  )}
                >
                  Switch
                </button>
              )}
            </div>
          </header>

          {/* Main content */}
          <main className="px-5 space-y-6">
            
            {/* Streak */}
            <StreakCard 
              streak={currentStreak} 
              onPress={() => handleNavigate('/achievements')} 
            />

            {/* Hero - Primary CTA */}
            <HeroCard
              childName={activeChild?.name || 'Your Child'}
              profile={activeChild?.brain_profile || ''}
              scriptsCount={dashboardStats?.totalScripts || 0}
              onPress={() => handleNavigate('/scripts')}
            />

            {/* Log Progress */}
            <LogProgressCard onPress={() => handleNavigate('/progress')} />

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <QuickAction
                icon={Sparkles}
                label="All Scripts"
                sublabel={`${dashboardStats?.totalScripts || 0} available`}
                color="bg-purple-500"
                onPress={() => handleNavigate('/scripts')}
              />
              <QuickAction
                icon={TrendingUp}
                label="Progress"
                sublabel="View insights"
                color="bg-blue-500"
                onPress={() => handleNavigate('/progress')}
              />
            </div>

            {/* Ebooks Section */}
            {ebooks.length > 0 && (
              <section>
                <SectionHeader 
                  title="Bonus Guides" 
                  action="See All"
                  onAction={() => handleNavigate('/bonuses?category=ebook')}
                />
                
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
                  {ebooks.slice(0, 5).map((ebook) => (
                    <EbookCard
                      key={ebook.id}
                      ebook={ebook}
                      onPress={() => handleNavigate(`/ebook-v2/${ebook.slug}`)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Recent Scripts */}
            {recentScripts.length > 0 && (
              <section>
                <SectionHeader 
                  title="Continue Reading" 
                  action="See All"
                  onAction={() => handleNavigate('/scripts')}
                />
                
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
                  {recentScripts.map((script) => (
                    <RecentScriptCard
                      key={script.id}
                      script={script}
                      onPress={() => handleNavigate('/scripts')}
                    />
                  ))}
                </div>
              </section>
            )}

          </main>
        </div>
      </div>
    </MainLayout>
  );
}
