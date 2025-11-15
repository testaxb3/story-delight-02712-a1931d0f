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
import { useVideoProgress } from '@/hooks/useVideoProgress';

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
import { LoadingDashboard } from '@/components/Dashboard/LoadingDashboard';

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
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [trackerSummary, setTrackerSummary] = useState({
    averageStress: null as number | null,
    meltdownBefore: null as number | null,
    meltdownAfter: null as number | null,
    totalEntries: 0,
  });
  const [scriptsUsedCount, setScriptsUsedCount] = useState(0);
  const [loadingScriptsUsed, setLoadingScriptsUsed] = useState(false);
  const [contentCounts, setContentCounts] = useState({ scripts: 0, videos: 0, pdfs: 0 });
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [currentStory, setCurrentStory] = useState<SuccessStory>(getRandomSuccessStory());
  const { stats: liveStats, loading: loadingLiveStats } = useLiveStats();
  const { progress, loading: loadingProgress } = useVideoProgress();

  // Track initial loading state
  const isInitialLoading = loadingScriptsUsed || loadingVideos || summaryLoading;

  useEffect(() => {
    // ✅ SECURITY: Check quiz state from database instead of localStorage
    const quizInProgress = user?.quiz_in_progress;
    const quizCompleted = user?.quiz_completed;

    // Only show onboarding if quiz is NOT completed and NOT in progress
    // If quiz is completed but no children exist, that's a data issue we'll handle elsewhere
    if (!quizCompleted && !quizInProgress && onboardingRequired) {
      setShowOnboardingModal(true);
    } else {
      setShowOnboardingModal(false);
    }
  }, [onboardingRequired, user]);

  const meltdownValueMap = useMemo(() => ({
    '0': 0,
    '1-2': 1.5,
    '3-5': 4,
    '5+': 6,
  }), []);

  const loadSummary = useCallback(async () => {
    if (!user?.profileId || !activeChild?.id) {
      setTrackerSummary({
        averageStress: null,
        meltdownBefore: null,
        meltdownAfter: null,
        totalEntries: 0,
      });
      setSummaryLoading(false);
      return;
    }

    setSummaryLoading(true);
    const { data, error } = await supabase
      .from('tracker_days')
      .select('stress_level, meltdown_count, completed, completed_at')
      .eq('user_id', user.profileId)
      .eq('child_id', activeChild.id)
      .order('completed_at', { ascending: true })
      .returns<Array<{
        stress_level: number | null;
        meltdown_count: string | null;
        completed: boolean | null;
        completed_at: string | null;
      }>>();

    if (error) {
      console.error('Failed to load tracker summary', error);
      setTrackerSummary({
        averageStress: null,
        meltdownBefore: null,
        meltdownAfter: null,
        totalEntries: 0,
      });
      setSummaryLoading(false);
      return;
    }

    const completedEntries = (data || []).filter((entry) => entry.completed);
    const meltdownSeries = completedEntries
      .map((entry) => (entry.meltdown_count ? meltdownValueMap[entry.meltdown_count] : null))
      .filter((value): value is number => value !== null && value !== undefined);
    const stressSeries = completedEntries
      .map((entry) => entry.stress_level)
      .filter((value): value is number => typeof value === 'number');

    const average = (values: number[]) =>
      values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;

    const baselineSample = meltdownSeries.slice(0, Math.min(3, meltdownSeries.length));
    const latestSample = meltdownSeries.slice(Math.max(meltdownSeries.length - 3, 0));

    setTrackerSummary({
      averageStress: average(stressSeries),
      meltdownBefore: average(baselineSample),
      meltdownAfter: average(latestSample),
      totalEntries: completedEntries.length,
    });
    setSummaryLoading(false);
  }, [activeChild?.id, meltdownValueMap, user?.profileId]);

  const loadScriptsUsed = useCallback(async () => {
    if (!user?.id) {
      setScriptsUsedCount(0);
      setLoadingScriptsUsed(false);
      return;
    }

    setLoadingScriptsUsed(true);
    const { count, error } = await supabase
      .from('script_usage')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to load scripts used count', error);
      setScriptsUsedCount(0);
    } else {
      setScriptsUsedCount(count ?? 0);
    }
    setLoadingScriptsUsed(false);
  }, [user?.id]);

  const loadContentCounts = useCallback(async () => {
    const [scriptsResponse, videosResponse, pdfsResponse] = await Promise.all([
      supabase.from('scripts').select('id', { count: 'exact', head: true }),
      supabase.from('videos').select('id', { count: 'exact', head: true }),
      supabase.from('pdfs').select('id', { count: 'exact', head: true })
    ]);

    if (scriptsResponse.error) {
      console.error('Failed to load script count', scriptsResponse.error);
    }
    if (videosResponse.error) {
      console.error('Failed to load video count', videosResponse.error);
    }
    if (pdfsResponse.error) {
      console.error('Failed to load pdf count', pdfsResponse.error);
    }

    setContentCounts({
      scripts: scriptsResponse.count ?? 0,
      videos: videosResponse.count ?? 0,
      pdfs: pdfsResponse.count ?? 0,
    });
  }, []);

  const loadVideos = useCallback(async () => {
    setLoadingVideos(true);
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Failed to load videos', error);
      setVideos([]);
    } else {
      setVideos(data ?? []);
    }

    setLoadingVideos(false);
  }, []);


  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    loadScriptsUsed();
  }, [loadScriptsUsed]);

  useEffect(() => {
    loadContentCounts();
    loadVideos();
  }, [loadContentCounts, loadVideos]);

  // Welcome modal disabled - premium system being refactored

  // Rotate success story every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStory(getRandomSuccessStory());
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // PWA Install prompt disabled - we now show onboarding after signup at /onboarding
  // Users can still install PWA from browser menu
  const checkPWAInstall = () => {
    // Disabled - onboarding page handles PWA installation guide
  };

  const handleWelcomeModalClose = () => {
    // Welcome modal disabled - premium system being refactored
    checkPWAInstall();
  };

  const totalDays = 30;
  const currentDay = Math.min(trackerSummary.totalEntries + 1, totalDays);
  const scriptsUsed = scriptsUsedCount;
  const videosWatched = 0;
  const currentStreak = Math.max(trackerSummary.totalEntries, 1);

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
    if (summaryLoading) {
      return 'Crunching the latest progress…';
    }
    return 'Log your days in My Plan to see real progress here.';
  }, [trackerSummary, summaryLoading]);

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
        <LoadingDashboard />
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

        {/* This Week's Wins - Granular Metrics */}
        <ThisWeeksWins userId={user?.id} />

        {/* Quick Metrics Overview */}
        <div className="grid grid-cols-2 gap-4">
          {/* Scripts Used */}
          <AnimatedMetricCard
            icon={BookOpen}
            value={scriptsUsedCount}
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

        {/* Personalized Insights */}
        <PersonalizedInsights 
          userId={user?.id} 
          brainProfile={activeChild?.brain_profile || null}
        />

        {/* Recent Script Usage */}
        <RecentScriptUsage userId={user?.id} />

        {/* Compact Success Story at bottom */}
        <CompactSuccessStory story={currentStory} />

        {/* Community Live Stats */}
        <div className="card-glass p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-bold">Live Community Stats</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-black text-success">{liveStats.totalMembers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Parents</div>
              <div className="text-xs text-success mt-1">👥 {liveStats.activeUsersThisWeek} active now</div>
            </div>
            <div>
              <div className="text-2xl font-black text-primary">{liveStats.scriptsUsedToday}</div>
              <div className="text-sm text-muted-foreground">Scripts Today</div>
              <div className="text-xs text-primary mt-1">📊 {liveStats.scriptsUsedThisWeek} this week</div>
            </div>
          </div>
        </div>
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
