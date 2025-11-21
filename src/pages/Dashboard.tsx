import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, Clock, FileText, Gift, Loader2, Play, Sparkles, Target, ThumbsUp, TrendingDown, Users, Video, X } from 'lucide-react';

import { MainLayout } from '@/components/Layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { PWAInstallGuide } from '@/components/PWAInstallGuide';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import type { Database } from '@/integrations/supabase/types';
import { getRandomSuccessStory, type SuccessStory } from '@/lib/successStories';
import { useLiveStats } from '@/hooks/useLiveStats';
import { getBrainTypeIcon } from '@/lib/brainTypes';
import { useVideoProgressOptimized } from '@/hooks/useVideoProgressOptimized';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useVideos } from '@/hooks/useVideos';
import { trackFeatureDiscovery, trackReturnVisit } from '@/lib/analytics-advanced';

// Premium Dashboard Components
import { HeroRecommendation } from '@/components/Dashboard/HeroRecommendation';
import { StreakCard } from '@/components/Dashboard/StreakCard';
import { ContinueWatching } from '@/components/Dashboard/ContinueWatching';
import { QuickActions } from '@/components/Dashboard/QuickActions';
import { CompactSuccessStory } from '@/components/Dashboard/CompactSuccessStory';
import { ThisWeeksWins } from '@/components/Dashboard/ThisWeeksWins';
import { RecentScriptUsage } from '@/components/Dashboard/RecentScriptUsage';
import { PersonalizedInsights } from '@/components/Dashboard/PersonalizedInsights';
import { AnimatedMetricCard } from '@/components/Dashboard/AnimatedMetricCard';
import { DashboardSkeletonV2 } from '@/components/Skeletons/DashboardSkeletonV2';

type VideoRow = Database['public']['Tables']['videos']['Row'];

type StandaloneNavigator = Navigator & { standalone?: boolean };

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const getSectionDisplay = (section: string): { name: string; icon: string } => {
    const sectionMap: Record<string, { name: string; icon: string }> = {
      'practice': { name: 'Daily Situations', icon: '🎯' },
      'mastery': { name: 'Masterclass', icon: '⚡' },
      'foundation': { name: 'Foundations', icon: '💡' },
      'ages-1-2': { name: 'Ages 1-2', icon: '🎯' },
      'ages-3-4': { name: 'Ages 3-4', icon: '⚡' },
      'ages-5-plus': { name: 'Ages 5+', icon: '💡' },
    };
    return sectionMap[section.toLowerCase()] || { name: section, icon: '📚' };
  };
  const [showBanner, setShowBanner] = useState(true);
  const [showPWAPrompt, setShowPWAPrompt] = useState(false);
  const [showPWAGuide, setShowPWAGuide] = useState(false);
  const { activeChild, onboardingRequired } = useChildProfiles();
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [currentStory, setCurrentStory] = useState<SuccessStory>(getRandomSuccessStory());

  // Optimized: Single query for all dashboard stats
  const { data: dashboardStats, isLoading: loadingDashboardStats } = useDashboardStats();
  const { progress, loading: loadingProgress } = useVideoProgressOptimized();
  const { data: videos = [], isLoading: loadingVideos } = useVideos();

  // Derived values from dashboard stats
  const trackerSummary = {
    averageStress: dashboardStats?.averageStress ?? null,
    meltdownBefore: dashboardStats?.meltdownsBefore ?? null,
    meltdownAfter: dashboardStats?.meltdownsAfter ?? null,
    totalEntries: dashboardStats?.totalTrackerEntries ?? 0,
  };
  const scriptsUsedCount = dashboardStats?.uniqueScriptsUsed ?? 0;
  const contentCounts = {
    scripts: dashboardStats?.totalScripts ?? 0,
    videos: dashboardStats?.totalVideos ?? 0,
    pdfs: dashboardStats?.totalPdfs ?? 0,
  };
  const scriptsUsed = scriptsUsedCount;
  const videosWatched = 0; // TODO: implement from dashboard_stats
  const currentStreak = Math.max(trackerSummary.totalEntries, 1);

  // Track initial loading state
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // ✅ SECURITY: Check quiz state from database instead of localStorage
    const quizInProgress = user?.quiz_in_progress;
    const quizCompleted = user?.quiz_completed;

    // ✅ FIX: Simplified logic - only check quiz_completed from database
    // Don't rely on onboardingRequired to avoid race conditions with child_profiles loading
    if (!quizCompleted && !quizInProgress) {
      setShowOnboardingModal(true);
    } else {
      setShowOnboardingModal(false);
    }
  }, [user]);

  // Set loading state based on dashboard stats and video loading
  useEffect(() => {
    const allLoaded = !loadingDashboardStats && !loadingVideos && !loadingProgress;
    if (allLoaded && isInitialLoading) {
      setIsInitialLoading(false);
    }
  }, [loadingDashboardStats, loadingVideos, loadingProgress, isInitialLoading]);

  // Rotate success story every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStory(getRandomSuccessStory());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // PWA Install prompt disabled - we now show onboarding after signup at /onboarding
  // Users can still install PWA from browser menu
  const checkPWAInstall = () => {
    // Disabled - onboarding page handles PWA installation guide
  };

  const getName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Friend';
  };

  // Calculate last watched video
  const lastWatchedVideo = useMemo(() => {
    if (!progress || progress.size === 0 || videos.length === 0) return null;

    // Find the most recently watched video
    let latestVideo: VideoRow | null = null;
    let latestTimestamp = 0;

    progress.forEach((progressData, videoId) => {
      const video = videos.find(v => v.id === videoId);
      if (!video) return;

      const timestamp = new Date(progressData.last_watched_at).getTime();
      if (timestamp > latestTimestamp && progressData.progress_seconds > 0) {
        latestTimestamp = timestamp;
        latestVideo = video;
      }
    });

    return latestVideo;
  }, [progress, videos]);

  // Get progress percentage for a video
  const getProgressPercentage = (videoId: string): number => {
    const progressData = progress?.get(videoId);
    if (!progressData || progressData.total_duration_seconds === 0) return 0;
    return Math.round((progressData.progress_seconds / progressData.total_duration_seconds) * 100);
  };

  const quickAccessItems = useMemo(() => ([
    {
      icon: BookOpen,
      label: 'NEP Scripts',
      count: contentCounts.scripts ? `${contentCounts.scripts} items` : '',
      path: '/scripts',
      gradient: 'bg-gradient-primary',
      isRecommended: activeChild?.brain_profile === 'INTENSE',
      isNew: false,
    },
    {
      icon: Video,
      label: 'Video Lessons',
      count: contentCounts.videos ? `${contentCounts.videos} videos` : '',
      path: '/videos',
      gradient: 'bg-gradient-accent',
      isRecommended: false,
      isNew: true,
    },
    {
      icon: Target,
      label: 'Progress Tracker',
      count: '',
      path: '/tracker',
      gradient: 'bg-gradient-warning',
      isRecommended: false,
      isNew: false,
    },
    {
      icon: Gift,
      label: 'Bonuses',
      count: '',
      path: '/bonuses',
      gradient: 'bg-sky-500',
      isRecommended: false,
      isNew: false,
    },
  ]), [activeChild?.brain_profile, contentCounts.scripts, contentCounts.videos]);

  const getStatsMessage = (type: 'scripts' | 'videos' | 'streak') => {
    switch(type) {
      case 'scripts':
        if (scriptsUsed === 0) return "🎯 Ready to try your first NEP phrase?";
        if (scriptsUsed <= 5) return `🔥 Great start! ${50 - scriptsUsed} more to master`;
        return "⭐ You're becoming a NEP expert!";
      case 'videos':
        if (videosWatched === 0) return "▶️ Start with Foundation Module";
        if (videosWatched <= 3) return "📚 Keep learning!";
        return "🎓 Knowledge unlocked!";
      case 'streak':
        if (currentStreak === 1) return "🌟 Day 1 - Your journey begins!";
        if (currentStreak === 7) return "⭐ Week Warrior badge unlocked!";
        if (currentStreak >= 30) return "🏆 Champion parent!";
        return `💪 ${currentStreak} days strong!`;
    }
  };

  const meltdownCopy = useMemo(() => {
    if (trackerSummary.meltdownBefore !== null && trackerSummary.meltdownAfter !== null && trackerSummary.totalEntries > 0) {
      const before = Math.max(Math.round(trackerSummary.meltdownBefore), 0);
      const after = Math.max(Math.round(trackerSummary.meltdownAfter), 0);
      if (before === after) {
        return `Tantrums steady at about ${after} per day — keep logging to spot shifts.`;
      }
      return `Tantrums reduced from ${before} to ${after}! 📉`;
    }
    if (loadingDashboardStats) {
      return 'Crunching the latest progress…';
    }
    return 'Log your days in My Plan to see real progress here.';
  }, [trackerSummary, loadingDashboardStats]);

  const stressCopy = useMemo(() => {
    if (trackerSummary.averageStress !== null && trackerSummary.totalEntries > 0) {
      return `Average stress: ${trackerSummary.averageStress.toFixed(1)}/5 this week.`;
    }
    return 'Record your stress each day to unlock personalized tips.';
  }, [trackerSummary]);

  return (
    <MainLayout>
      <PWAInstallPrompt
        open={showPWAPrompt}
        onOpenGuide={() => {
          setShowPWAPrompt(false);
          setShowPWAGuide(true);
        }}
        onClose={() => setShowPWAPrompt(false)}
      />
      <PWAInstallGuide
        open={showPWAGuide}
        onClose={() => setShowPWAGuide(false)}
      />
      
      {/* Show premium loading state on initial load */}
      {isInitialLoading ? (
        <DashboardSkeletonV2 />
      ) : (
        <div className="space-y-8 pb-8">
        {/* Hero Recommendation - Your Next Win */}
        <HeroRecommendation 
          brainProfile={activeChild?.brain_profile || null}
          childName={activeChild?.name || getName()}
        />

        {/* Streak Card */}
        <StreakCard 
          currentStreak={currentStreak}
          scriptsUsed={scriptsUsedCount}
        />

        {/* Continue Watching - Only if video in progress */}
        {lastWatchedVideo && getProgressPercentage(lastWatchedVideo.id) < 100 && (
          <ContinueWatching 
            videoTitle={lastWatchedVideo.title}
            videoSection={getSectionDisplay(lastWatchedVideo.section).name}
            progressPercentage={getProgressPercentage(lastWatchedVideo.id)}
            thumbnailUrl={lastWatchedVideo.thumbnail_url || undefined}
            videoId={lastWatchedVideo.id}
          />
        )}

        {/* Quick Actions - Only 2 main cards */}
        <QuickActions
          scriptsCount={contentCounts.scripts}
          videosCount={contentCounts.videos}
        />

        {/* Quick Metrics Overview */}
        <div className="grid grid-cols-2 gap-4">
          {/* Scripts Total */}
          <AnimatedMetricCard
            icon={BookOpen}
            value={contentCounts.scripts}
            label="Scripts Total"
            gradient="bg-gradient-primary"
            delay={0.5}
            onClick={() => navigate('/scripts')}
          />

          {/* Stress Check */}
          <AnimatedMetricCard
            icon={TrendingDown}
            value={trackerSummary.totalEntries > 0 ? '📉' : '—'}
            label="Check-in"
            subtitle={meltdownCopy}
            gradient="bg-gradient-success"
            delay={0.6}
            onClick={() => navigate('/tracker')}
          />
        </div>

        {/* This Week's Wins */}
        <ThisWeeksWins 
          wins={dashboardStats?.weeklyWins || []} 
          loading={loadingDashboardStats} 
        />

        {/* Recent Script Usage */}
        <RecentScriptUsage 
          recentScripts={dashboardStats?.recentScriptUsage || []} 
          loading={loadingDashboardStats} 
        />

        {/* Personalized Insights */}
        <PersonalizedInsights 
          userId={user?.id} 
          brainProfile={activeChild?.brain_profile || null}
        />

        {/* Compact Success Story at bottom */}
        <CompactSuccessStory story={currentStory} />
      </div>
      )}

      {/* Onboarding Modal */}
      <Dialog open={showOnboardingModal} onOpenChange={setShowOnboardingModal}>
        <DialogContent className="max-w-lg card-glass">
          <DialogHeader>
            <DialogTitle className="text-center">
              <span className="text-3xl mb-2 block">🧠</span>
              <span className="gradient-text text-2xl font-black">
                Welcome to NEP System!
              </span>
            </DialogTitle>
            <DialogDescription className="text-center">
              Complete the Brain Profile Quiz to unlock personalized parenting strategies
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gradient-primary rounded-lg flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Personalized Strategies</p>
                  <p className="text-xs text-muted-foreground">Get custom scripts tailored to your child</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gradient-accent rounded-lg flex-shrink-0">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Brain Profile Match</p>
                  <p className="text-xs text-muted-foreground">Understand your child's unique wiring</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gradient-success rounded-lg flex-shrink-0">
                  <ThumbsUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Step-by-Step Guidance</p>
                  <p className="text-xs text-muted-foreground">Clear, actionable daily plan</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => navigate('/quiz')}
              size="lg"
              className="w-full gradient-primary hover-glow font-bold text-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start the Quiz
              <span className="ml-2">→</span>
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              ⏱️ Takes only 5 minutes
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
