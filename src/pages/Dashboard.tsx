import { useCallback, useEffect, useMemo, useState } from 'react';
import { BookOpen, Clock, FileText, Gift, Loader2, Play, Sparkles, Target, ThumbsUp, TrendingDown, Users, Video, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { MainLayout } from '@/components/Layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { WelcomeGiftModal } from '@/components/WelcomeGiftModal';
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

  useEffect(() => {
    // ✅ SECURITY: Check quiz state from database instead of localStorage
    const quizInProgress = user?.quiz_in_progress;
    const quizCompleted = user?.quiz_completed;

    if (onboardingRequired && !quizInProgress && !quizCompleted) {
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
      <div className="space-y-6">
        {/* Hero Welcome Section - Dark Mode Optimized */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 dark:from-purple-900/90 dark:via-purple-800/80 dark:to-pink-900/90 p-8 text-white shadow-2xl dark:shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 dark:bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 dark:bg-white/5 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-semibold">Day {currentDay} of 30</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
                  Welcome back,<br />{getName()}! 🎉
                </h1>
                <p className="text-lg text-purple-100 mb-6 max-w-2xl">
                  You're making real progress in transforming your parenting journey
                </p>
              </div>
              <div className="text-7xl ml-4 animate-pulse hidden sm:block">🧠</div>
            </div>

            {/* Progress Section - Dark Mode Optimized */}
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-purple-100 dark:text-purple-200 font-medium">Your Transformation Progress</span>
                <span className="text-2xl font-black">{currentDay}/{totalDays}</span>
              </div>
              <div className="relative">
                <Progress value={(currentDay / totalDays) * 100} className="h-3 bg-white/20 dark:bg-white/10" />
                <div className="absolute -top-1 left-0" style={{ left: `${(currentDay / totalDays) * 100}%` }}>
                  <div className="w-5 h-5 bg-white rounded-full shadow-lg -ml-2.5 flex items-center justify-center">
                    <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white/10 dark:bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/20 dark:border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-yellow-300 dark:text-yellow-400" />
                  <p className="font-bold text-yellow-300 dark:text-yellow-400">Today's Mission</p>
                </div>
                <p className="text-sm text-purple-50 dark:text-purple-100">
                  Watch one Foundation video and try your first NEP phrase with your child
                </p>
              </div>
            </div>

            {/* Quick Action Buttons - Dark Mode Optimized */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <Button
                className="bg-white text-purple-600 hover:bg-purple-50 dark:bg-slate-100 dark:text-purple-700 dark:hover:bg-slate-200 font-bold shadow-lg h-12"
                onClick={() => navigate('/tracker')}
              >
                <Target className="w-4 h-4 mr-2" />
                My Plan
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 text-white border-white/30 dark:border-white/20 font-bold backdrop-blur-sm h-12"
                onClick={() => navigate('/videos')}
              >
                <Play className="w-4 h-4 mr-2" />
                Watch Videos
              </Button>
            </div>
          </div>

          {/* Urgency Strip - Dark Mode Optimized */}
          {showBanner && (
            <div className="relative z-10 mt-6 bg-gradient-to-r from-yellow-400/90 to-orange-400/90 dark:from-yellow-600/80 dark:to-orange-600/80 backdrop-blur-sm rounded-xl p-4 border border-yellow-300/50 dark:border-yellow-500/30">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-orange-900 dark:text-orange-100 hover:bg-white/20 dark:hover:bg-white/10 h-6 w-6"
                onClick={() => setShowBanner(false)}
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-orange-900 dark:text-orange-100" />
                <div>
                  <p className="font-bold text-orange-900 dark:text-orange-100">⏰ Day {currentDay} Challenge Active!</p>
                  <p className="text-sm text-orange-800 dark:text-orange-200">Don't break your streak! Use 1 script today</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Success Story Card - Dark Mode Optimized */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 dark:from-emerald-700/80 dark:via-green-700/70 dark:to-teal-700/80 p-6 text-white shadow-2xl dark:shadow-2xl border-2 border-emerald-400/50 dark:border-emerald-600/30">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 dark:bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/20 dark:bg-emerald-900/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 dark:bg-white/10 rounded-xl backdrop-blur-sm">
                <ThumbsUp className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-white/90 dark:bg-white/80 text-emerald-700 dark:text-emerald-800 border-none font-bold">
                    Success Story
                  </Badge>
                  <Badge className="bg-white/30 dark:bg-white/20 text-white border-white/30 dark:border-white/20 text-xs">
                    {getBrainTypeIcon(currentStory.brainType)} {currentStory.brainType} Brain
                  </Badge>
                </div>
                <h2 className="text-2xl font-black">
                  {currentStory.name}'s Journey
                </h2>
              </div>
              <span className="text-4xl animate-bounce">🎉</span>
            </div>

            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/20 dark:border-white/10">
              <p className="text-lg font-medium italic leading-relaxed">
                "{currentStory.quote}"
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/20 dark:border-white/10 text-center">
                <TrendingDown className="w-5 h-5 mx-auto mb-1 text-yellow-300 dark:text-yellow-400" />
                <div className="font-black text-lg">{currentStory.before.value}</div>
                <div className="text-2xl my-1">↓</div>
                <div className="font-black text-lg text-yellow-300 dark:text-yellow-400">{currentStory.after.value}</div>
              </div>
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/20 dark:border-white/10 text-center">
                <Clock className="w-5 h-5 mx-auto mb-1" />
                <div className="text-xs opacity-80 mb-1">Timeline</div>
                <div className="font-bold">{currentStory.timeline}</div>
              </div>
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/20 dark:border-white/10 text-center">
                <Users className="w-5 h-5 mx-auto mb-1" />
                <div className="text-xs opacity-80 mb-1">Child Age</div>
                <div className="font-bold">{currentStory.childAge}</div>
              </div>
            </div>

            <p className="text-xs text-white/60 dark:text-white/50 text-center mt-3">
              💫 Stories rotate every 30 seconds
            </p>
          </div>
        </div>

        {/* Child's Living Progress Card - Dark Mode Optimized */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 dark:from-blue-800/80 dark:via-blue-700/70 dark:to-cyan-800/80 p-6 text-white shadow-2xl dark:shadow-2xl border-2 border-blue-400/50 dark:border-blue-600/30">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 dark:bg-white/5 rounded-full -mr-28 -mt-28 blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 dark:bg-white/10 rounded-xl backdrop-blur-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black">
                    {activeChild ? `${activeChild.name}'s Progress` : 'Living Progress'}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl">{getBrainTypeIcon(activeChild?.brain_profile)}</span>
                    <span className="text-lg font-bold">{activeChild?.brain_profile ?? 'INTENSE'} Brain</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 mb-4">
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/20 dark:border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-yellow-400/30 dark:bg-yellow-500/20 rounded-lg">
                    <Sparkles className="w-4 h-4 text-yellow-300 dark:text-yellow-400" />
                  </div>
                  <p className="font-bold text-yellow-300 dark:text-yellow-400">This Week's Wins</p>
                </div>
                <p className="text-sm leading-relaxed">{meltdownCopy}</p>
              </div>

              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/20 dark:border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-orange-400/30 dark:bg-orange-500/20 rounded-lg">
                    <TrendingDown className="w-4 h-4 text-orange-300 dark:text-orange-400" />
                  </div>
                  <p className="font-bold text-orange-300 dark:text-orange-400">Nervous System Check-in</p>
                </div>
                <p className="text-sm leading-relaxed">{stressCopy}</p>
              </div>

              <div className="bg-gradient-to-r from-cyan-500/30 to-blue-500/30 dark:from-cyan-700/20 dark:to-blue-700/20 backdrop-blur-sm p-4 rounded-xl border border-cyan-300/30 dark:border-cyan-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-cyan-400/30 dark:bg-cyan-500/20 rounded-lg">
                    <Target className="w-4 h-4 text-cyan-200 dark:text-cyan-300" />
                  </div>
                  <p className="font-bold text-cyan-200 dark:text-cyan-300">Next Best Action</p>
                </div>
                <p className="text-sm leading-relaxed">
                  Open My Plan to unlock Day {currentDay} for {activeChild?.name ?? 'your child'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                className="bg-white text-blue-600 hover:bg-blue-50 dark:bg-slate-100 dark:text-blue-700 dark:hover:bg-slate-200 font-bold shadow-lg h-11"
                onClick={() => navigate('/tracker')}
              >
                <Target className="w-4 h-4 mr-2" />
                My Plan
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 text-white border-white/30 dark:border-white/20 font-bold backdrop-blur-sm h-11"
                onClick={() => navigate('/quiz')}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Quiz
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Video Card - Dark Mode Optimized */}
        {(loadingVideos || loadingProgress) ? (
          <Card className="p-6 glass border-none shadow-lg">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          </Card>
        ) : lastWatchedVideo ? (
          <Card className="p-6 glass border-none shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-warning">
                <span className="text-xl">⭐</span>
                <span className="font-semibold uppercase text-sm">Continue Where You Left Off</span>
              </div>
              <Badge variant="secondary">{getProgressPercentage(lastWatchedVideo.id)}% Complete</Badge>
            </div>

            <div
              className="relative mb-4 bg-gradient-accent rounded-xl overflow-hidden aspect-video flex items-center justify-center cursor-pointer group transition-all hover:scale-[1.02]"
              onClick={() => navigate('/videos')}
            >
              {lastWatchedVideo.thumbnail_url ? (
                <>
                  <img
                    src={lastWatchedVideo.thumbnail_url}
                    alt={lastWatchedVideo.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 opacity-80 group-hover:opacity-90 transition-opacity" />
              )}

              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Play className="w-12 h-12 fill-white" />
                  <span className="text-lg">Continue</span>
                </div>
              </div>

              {lastWatchedVideo.duration && (
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                  {lastWatchedVideo.duration}
                </div>
              )}
              {lastWatchedVideo.section && (
                <div className="absolute bottom-4 left-4 z-10">
                  <Badge className="bg-warning text-white border-none">
                    {getSectionDisplay(lastWatchedVideo.section).icon} {getSectionDisplay(lastWatchedVideo.section).name}
                  </Badge>
                </div>
              )}

              {/* Progress bar overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20 z-10">
                <div
                  className="h-full bg-warning transition-all"
                  style={{ width: `${getProgressPercentage(lastWatchedVideo.id)}%` }}
                />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-2">{lastWatchedVideo.title}</h3>

            {lastWatchedVideo.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {lastWatchedVideo.description}
              </p>
            )}

            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress: {getProgressPercentage(lastWatchedVideo.id)}% complete</span>
            </div>
            <Progress value={getProgressPercentage(lastWatchedVideo.id)} className="h-2 mb-4" />

            <Button className="w-full" onClick={() => navigate('/videos')}>
              <Play className="w-4 h-4 mr-2" />
              Continue Watching
            </Button>
          </Card>
        ) : (
          <Card className="p-6 glass border-none shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-warning">
                <span className="text-xl">⭐</span>
                <span className="font-semibold uppercase text-sm">Start Your Journey</span>
              </div>
              <Badge variant="secondary">NEW</Badge>
            </div>

            <div
              className="relative mb-4 bg-gradient-accent rounded-xl overflow-hidden aspect-video flex items-center justify-center cursor-pointer group transition-all hover:scale-[1.02]"
              onClick={() => navigate('/videos')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center z-20">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-white font-semibold">
                  <Play className="w-6 h-6" />
                  <span>Watch Now</span>
                </div>
              </div>
              <Play className="w-16 h-16 text-white relative z-10 group-hover:opacity-0 transition-opacity" />
              <div className="absolute bottom-4 left-4 z-10">
                <Badge className="bg-warning text-white border-none">💡 Foundations</Badge>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-2">Start with Foundations Videos</h3>

            <div className="bg-primary/10 p-3 rounded-lg mb-4">
              <p className="text-sm font-semibold text-primary mb-1">Begin your journey:</p>
              <p className="text-sm">Learn the science behind your child's brain and transform your parenting</p>
            </div>

            <Button className="w-full" onClick={() => navigate('/videos')}>
              <Play className="w-4 h-4 mr-2" />
              Start Watching
            </Button>
          </Card>
        )}

        {/* Enhanced Stats Cards - Dark Mode Optimized */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Scripts Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 p-5 shadow-lg hover:shadow-xl transition-shadow border-2 border-purple-300/50 dark:border-purple-700/30">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-300/30 dark:bg-purple-700/20 rounded-full -mr-12 -mt-12"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-purple-500 dark:bg-purple-600 rounded-xl shadow-md">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <Sparkles className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              </div>
              <div className="text-4xl font-black text-purple-900 dark:text-purple-100 mb-1">
                {loadingScriptsUsed ? '...' : scriptsUsed}
              </div>
              <div className="text-sm font-bold text-purple-700 dark:text-purple-300 mb-2">Scripts Used</div>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium leading-tight">{getStatsMessage('scripts')}</p>
            </div>
          </div>

          {/* Streak Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 p-5 shadow-lg hover:shadow-xl transition-shadow border-2 border-orange-300/50 dark:border-orange-700/30">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-300/30 dark:bg-orange-700/20 rounded-full -mr-12 -mt-12"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-orange-500 dark:bg-orange-600 rounded-xl shadow-md">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl">🔥</span>
              </div>
              <div className="text-4xl font-black text-orange-900 dark:text-orange-100 mb-1">{currentStreak}</div>
              <div className="text-sm font-bold text-orange-700 dark:text-orange-300 mb-2">Day Streak</div>
              <p className="text-xs text-orange-600 dark:text-orange-400 font-medium leading-tight">{getStatsMessage('streak')}</p>
            </div>
          </div>

          {/* Community Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 p-5 shadow-lg hover:shadow-xl transition-shadow border-2 border-green-300/50 dark:border-green-700/30">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-300/30 dark:bg-green-700/20 rounded-full -mr-12 -mt-12"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-green-500 dark:bg-green-600 rounded-xl shadow-md">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <Sparkles className="w-4 h-4 text-green-500 dark:text-green-400" />
              </div>
              <div className="text-4xl font-black text-green-900 dark:text-green-100 mb-1">
                {loadingLiveStats ? '...' : liveStats.totalMembers.toLocaleString()}
              </div>
              <div className="text-sm font-bold text-green-700 dark:text-green-300 mb-2">Total Parents</div>
              <p className="text-xs text-green-600 dark:text-green-400 font-medium leading-tight">
                👥 {loadingLiveStats ? 'Loading...' : `${liveStats.activeUsersThisWeek} active`}
              </p>
            </div>
          </div>

          {/* Scripts Today Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 p-5 shadow-lg hover:shadow-xl transition-shadow border-2 border-blue-300/50 dark:border-blue-700/30">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-300/30 dark:bg-blue-700/20 rounded-full -mr-12 -mt-12"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-blue-500 dark:bg-blue-600 rounded-xl shadow-md">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl">🌟</span>
              </div>
              <div className="text-4xl font-black text-blue-900 dark:text-blue-100 mb-1">
                {loadingLiveStats ? '...' : liveStats.scriptsUsedToday.toLocaleString()}
              </div>
              <div className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-2">Scripts Today</div>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium leading-tight">
                📊 {loadingLiveStats ? 'Loading...' : `${liveStats.scriptsUsedThisWeek} this week`}
              </p>
            </div>
          </div>
        </div>


        {/* Enhanced Quick Access */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">✨</span>
            <h2 className="text-xl font-bold">Quick Access</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {quickAccessItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  'group relative rounded-2xl p-4 glass shadow-lg transition-transform transition-shadow hover:-translate-y-1 hover:shadow-xl hover-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  item.isNew
                    ? 'border-2 border-warning shadow-warning/20 animate-pulse'
                    : item.isRecommended
                      ? 'border-2 border-success shadow-success/20'
                      : 'border border-transparent',
                )}
                aria-label={`Access ${item.label}`}
              >
                {item.isRecommended && (
                  <Badge className="absolute top-2 right-2 bg-success text-white border-none text-xs shadow-lg">
                    RECOMMENDED
                  </Badge>
                )}
                {item.isNew && (
                  <Badge className="absolute top-2 right-2 bg-warning text-white border-none text-xs shadow-lg">
                    NEW
                  </Badge>
                )}
                <div
                  className={cn(
                    'mb-3 flex h-12 w-12 items-center justify-center rounded-2xl',
                    item.gradient,
                    item.isRecommended && 'shadow-lg shadow-success/50',
                    item.isNew && 'shadow-lg shadow-warning/50',
                  )}
                >
                  <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <h3 className="mb-1 font-semibold">{item.label}</h3>
                {item.count && <p className="text-xs text-muted-foreground">{item.count}</p>}
              </Link>
            ))}
          </div>
        </div>

      </div>

      <Dialog open={showOnboardingModal} onOpenChange={() => {}}>
        <DialogContent
          className="max-w-lg border-none bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/40 dark:via-pink-950/40 dark:to-orange-950/40 p-0 overflow-hidden"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 dark:from-purple-600/10 dark:to-pink-600/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-400/20 to-yellow-400/20 dark:from-orange-600/10 dark:to-yellow-600/10 rounded-full -ml-16 -mb-16 blur-3xl"></div>

          <div className="relative z-10 p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 dark:from-purple-500 dark:to-pink-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 dark:from-purple-600 dark:via-pink-600 dark:to-orange-600 p-5 rounded-full shadow-xl">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>

            {/* Header */}
            <DialogHeader className="text-center space-y-3 mb-6">
              <DialogTitle className="text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 dark:from-purple-400 dark:via-pink-400 dark:to-orange-400 bg-clip-text text-transparent leading-tight">
                Discover Your Child's Unique Profile!
              </DialogTitle>
              <DialogDescription className="text-base text-foreground/80 dark:text-foreground/70 leading-relaxed">
                Take our personalized NEP quiz to unlock a customized plan designed specifically for your child's needs and temperament.
              </DialogDescription>
            </DialogHeader>

            {/* Benefits */}
            <div className="space-y-3 mb-6 bg-white/50 dark:bg-black/20 rounded-2xl p-5 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/30">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-lg flex-shrink-0">
                  <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Personalized Strategies</p>
                  <p className="text-xs text-muted-foreground">Get custom scripts tailored to your child</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gradient-to-br from-pink-100 to-orange-100 dark:from-pink-900/50 dark:to-orange-900/50 rounded-lg flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Brain Profile Match</p>
                  <p className="text-xs text-muted-foreground">Understand your child's unique wiring</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/50 dark:to-yellow-900/50 rounded-lg flex-shrink-0">
                  <ThumbsUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Step-by-Step Guidance</p>
                  <p className="text-xs text-muted-foreground">Clear, actionable daily plan</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={() => navigate('/quiz')}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white font-bold text-lg h-14 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start the Quiz
              <span className="ml-2">→</span>
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-4">
              ⏱️ Takes only 5 minutes
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
