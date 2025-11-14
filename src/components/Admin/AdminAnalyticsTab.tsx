import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  BookOpen,
  Video,
  Download,
  TrendingUp,
  Activity,
  Target,
  Brain,
  Loader2,
  Calendar,
  Zap,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type DateRange = '7d' | '30d' | '90d' | 'all';

interface AnalyticsData {
  totalUsers: number;
  activeUsers7d: number;
  totalScripts: number;
  scriptsUsedTotal: number;
  scriptsUsedToday: number;
  totalVideos: number;
  videoWatchesTotal: number;
  communityPosts: number;
  trackerDaysCompleted: number;
  quizCompletionRate: number;
  avgScriptsPerUser: number;
  avgVideosPerUser: number;
  brainProfileDistribution: { name: string; value: number; color: string }[];
  newUsersByWeek: { week: string; users: number }[];
  topScripts: { title: string; uses: number; profile: string }[];
  engagementOverTime: { date: string; scripts: number; videos: number; posts: number }[];
  retentionRate: number;
}

const COLORS = {
  INTENSE: '#ef4444',
  DISTRACTED: '#f59e0b',
  DEFIANT: '#8b5cf6',
  primary: '#9b87f5',
  success: '#10b981',
  warning: '#f59e0b',
};

// Custom tooltip component for dark mode support
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-gray-700 dark:text-gray-300">
            <span style={{ color: entry.color }} className="font-semibold">
              {entry.name}:
            </span>{' '}
            {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AdminAnalyticsTab() {
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);

    try {
      // Calculate date ranges
      const now = new Date();
      const ranges = {
        '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        '90d': new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        'all': new Date(0)
      };
      const startDate = ranges[dateRange];

      // Fetch all data in parallel
      const [
        profilesResult,
        scriptsResult,
        scriptFeedbackResult,
        videosResult,
        videoProgressResult,
        communityPostsResult,
        trackerDaysResult,
      ] = await Promise.all([
        supabase.from('profiles').select('id, created_at, brain_profile, quiz_completed'),
        supabase.from('scripts').select('id, title, profile'),
        supabase.from('script_feedback').select('script_id, user_id, created_at'),
        supabase.from('videos').select('id'),
        supabase.from('video_progress').select('user_id, video_id, created_at'),
        supabase.from('community_posts').select('id, created_at'),
        supabase.from('tracker_days').select('completed, completed_at'),
      ]);

      if (profilesResult.error) throw profilesResult.error;
      if (scriptsResult.error) throw scriptsResult.error;
      if (scriptFeedbackResult.error) throw scriptFeedbackResult.error;
      if (videosResult.error) throw videosResult.error;
      if (videoProgressResult.error) throw videoProgressResult.error;
      if (communityPostsResult.error) throw communityPostsResult.error;
      if (trackerDaysResult.error) throw trackerDaysResult.error;

      const profiles = profilesResult.data || [];
      const scripts = scriptsResult.data || [];
      const scriptFeedback = scriptFeedbackResult.data || [];
      const videos = videosResult.data || [];
      const videoProgress = videoProgressResult.data || [];
      const communityPosts = communityPostsResult.data || [];
      const trackerDays = trackerDaysResult.data || [];

      // Filter by date range
      const filteredProfiles = profiles.filter(p =>
        new Date(p.created_at || 0) >= startDate
      );
      const filteredScriptFeedback = scriptFeedback.filter(s =>
        new Date(s.created_at || 0) >= startDate
      );
      const filteredVideoProgress = videoProgress.filter(v =>
        new Date(v.created_at || 0) >= startDate
      );
      const filteredCommunityPosts = communityPosts.filter(p =>
        new Date(p.created_at || 0) >= startDate
      );

      // Calculate metrics
      const totalUsers = profiles.length;
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const activeUsers7d = new Set([
        ...scriptFeedback.filter(s => new Date(s.created_at || 0) >= sevenDaysAgo).map(s => s.user_id),
        ...videoProgress.filter(v => new Date(v.created_at || 0) >= sevenDaysAgo).map(v => v.user_id),
      ]).size;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const scriptsUsedToday = scriptFeedback.filter(s => {
        const createdDate = new Date(s.created_at || 0);
        createdDate.setHours(0, 0, 0, 0);
        return createdDate.getTime() === today.getTime();
      }).length;

      const uniqueScriptUsers = new Set(scriptFeedback.map(s => s.user_id)).size;
      const uniqueVideoUsers = new Set(videoProgress.map(v => v.user_id)).size;

      const avgScriptsPerUser = uniqueScriptUsers > 0 ? scriptFeedback.length / uniqueScriptUsers : 0;
      const avgVideosPerUser = uniqueVideoUsers > 0 ? videoProgress.length / uniqueVideoUsers : 0;

      const quizCompleted = profiles.filter(p => p.quiz_completed).length;
      const quizCompletionRate = totalUsers > 0 ? (quizCompleted / totalUsers) * 100 : 0;

      const completedTrackerDays = trackerDays.filter(t => t.completed).length;

      // Brain profile distribution
      const brainCounts = profiles.reduce((acc, p) => {
        const profile = p.brain_profile || 'UNKNOWN';
        acc[profile] = (acc[profile] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const brainProfileDistribution = Object.entries(brainCounts).map(([name, value]) => ({
        name,
        value,
        color: COLORS[name as keyof typeof COLORS] || '#6b7280'
      }));

      // New users by week (last 8 weeks)
      const newUsersByWeek: { week: string; users: number }[] = [];
      for (let i = 7; i >= 0; i--) {
        const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
        const usersInWeek = profiles.filter(p => {
          const created = new Date(p.created_at || 0);
          return created >= weekStart && created < weekEnd;
        }).length;

        newUsersByWeek.push({
          week: `Week ${8 - i}`,
          users: usersInWeek
        });
      }

      // Top 10 most used scripts
      const scriptFeedbackCounts = filteredScriptFeedback.reduce((acc, feedback) => {
        acc[feedback.script_id] = (acc[feedback.script_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topScripts = Object.entries(scriptFeedbackCounts)
        .map(([scriptId, uses]) => {
          const script = scripts.find(s => s.id === scriptId);
          return {
            title: script?.title || 'Unknown Script',
            uses,
            profile: script?.profile || 'UNKNOWN'
          };
        })
        .sort((a, b) => b.uses - a.uses)
        .slice(0, 10);

      // Engagement over time (last 30 days)
      const engagementOverTime: { date: string; scripts: number; videos: number; posts: number }[] = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        date.setHours(0, 0, 0, 0);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const scriptsOnDay = scriptFeedback.filter(s => {
          const created = new Date(s.created_at || 0);
          created.setHours(0, 0, 0, 0);
          return created.getTime() === date.getTime();
        }).length;

        const videosOnDay = videoProgress.filter(v => {
          const created = new Date(v.created_at || 0);
          created.setHours(0, 0, 0, 0);
          return created.getTime() === date.getTime();
        }).length;

        const postsOnDay = communityPosts.filter(p => {
          const created = new Date(p.created_at || 0);
          created.setHours(0, 0, 0, 0);
          return created.getTime() === date.getTime();
        }).length;

        engagementOverTime.push({
          date: dateStr,
          scripts: scriptsOnDay,
          videos: videosOnDay,
          posts: postsOnDay
        });
      }

      // Retention rate (users who came back after 7 days)
      const usersOlderThan7Days = profiles.filter(p => {
        const created = new Date(p.created_at || 0);
        return created < sevenDaysAgo;
      });
      const activeFromOldUsers = usersOlderThan7Days.filter(p => {
        return scriptFeedback.some(s => s.user_id === p.id && new Date(s.created_at || 0) >= sevenDaysAgo) ||
               videoProgress.some(v => v.user_id === p.id && new Date(v.created_at || 0) >= sevenDaysAgo);
      }).length;
      const retentionRate = usersOlderThan7Days.length > 0
        ? (activeFromOldUsers / usersOlderThan7Days.length) * 100
        : 0;

      setData({
        totalUsers,
        activeUsers7d,
        totalScripts: scripts.length,
        scriptsUsedTotal: filteredScriptFeedback.length,
        scriptsUsedToday,
        totalVideos: videos.length,
        videoWatchesTotal: filteredVideoProgress.length,
        communityPosts: filteredCommunityPosts.length,
        trackerDaysCompleted: completedTrackerDays,
        quizCompletionRate,
        avgScriptsPerUser,
        avgVideosPerUser,
        brainProfileDistribution,
        newUsersByWeek,
        topScripts,
        engagementOverTime,
        retentionRate
      });

    } catch (error) {
      console.error('Failed to load analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    if (!data) return;

    const csvContent = [
      ['Metric', 'Value'],
      ['Total Users', data.totalUsers.toString()],
      ['Active Users (7d)', data.activeUsers7d.toString()],
      ['Total Scripts', data.totalScripts.toString()],
      ['Scripts Used', data.scriptsUsedTotal.toString()],
      ['Scripts Today', data.scriptsUsedToday.toString()],
      ['Total Videos', data.totalVideos.toString()],
      ['Video Watches', data.videoWatchesTotal.toString()],
      ['Community Posts', data.communityPosts.toString()],
      ['Tracker Days Completed', data.trackerDaysCompleted.toString()],
      ['Quiz Completion Rate', `${data.quizCompletionRate.toFixed(1)}%`],
      ['Avg Scripts/User', data.avgScriptsPerUser.toFixed(1)],
      ['Avg Videos/User', data.avgVideosPerUser.toFixed(1)],
      ['Retention Rate', `${data.retentionRate.toFixed(1)}%`],
      ['', ''],
      ['Top Scripts', 'Uses'],
      ...data.topScripts.map(s => [s.title, s.uses.toString()]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Analytics data exported!');
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border border-blue-100 dark:border-blue-900/50 shadow-lg">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                Analytics Dashboard
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Real-time insights into your NEP System performance
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Tabs value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
                <TabsList className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm">
                  <TabsTrigger value="7d" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                    7 Days
                  </TabsTrigger>
                  <TabsTrigger value="30d" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                    30 Days
                  </TabsTrigger>
                  <TabsTrigger value="90d" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                    90 Days
                  </TabsTrigger>
                  <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                    All Time
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button
                onClick={handleExportData}
                variant="outline"
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-900 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics - Glass Morphism Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent dark:from-blue-500/20 dark:via-blue-500/10 dark:to-transparent border border-blue-200/50 dark:border-blue-500/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent dark:from-blue-500/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                {data.totalUsers.toLocaleString()}
              </div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Total Users
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1.5 rounded-lg w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></div>
                {data.activeUsers7d} active (7d)
              </div>
            </div>
          </div>
        </div>

        {/* Scripts Used Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent dark:from-green-500/20 dark:via-green-500/10 dark:to-transparent border border-green-200/50 dark:border-green-500/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent dark:from-green-500/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                {data.scriptsUsedTotal.toLocaleString()}
              </div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Scripts Used
              </div>
              <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-2.5 py-1.5 rounded-lg w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400 animate-pulse"></div>
                {data.scriptsUsedToday} today
              </div>
            </div>
          </div>
        </div>

        {/* Video Watches Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent dark:from-purple-500/20 dark:via-purple-500/10 dark:to-transparent border border-purple-200/50 dark:border-purple-500/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent dark:from-purple-500/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30">
                <Video className="w-7 h-7 text-white" />
              </div>
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                {data.videoWatchesTotal.toLocaleString()}
              </div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Video Watches
              </div>
              <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 font-medium bg-purple-50 dark:bg-purple-900/20 px-2.5 py-1.5 rounded-lg w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400 animate-pulse"></div>
                {data.avgVideosPerUser.toFixed(1)} avg/user
              </div>
            </div>
          </div>
        </div>

        {/* Days Tracked Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent dark:from-orange-500/20 dark:via-orange-500/10 dark:to-transparent border border-orange-200/50 dark:border-orange-500/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent dark:from-orange-500/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                {data.trackerDaysCompleted.toLocaleString()}
              </div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Days Tracked
              </div>
              <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400 font-medium bg-orange-50 dark:bg-orange-900/20 px-2.5 py-1.5 rounded-lg w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-600 dark:bg-orange-400 animate-pulse"></div>
                {data.retentionRate.toFixed(0)}% retention
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics - Compact Glass Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group relative rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Quiz Completion
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {data.quizCompletionRate.toFixed(0)}%
          </div>
        </div>

        <div className="group relative rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Scripts/User
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {data.avgScriptsPerUser.toFixed(1)}
          </div>
        </div>

        <div className="group relative rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Community Posts
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {data.communityPosts.toLocaleString()}
          </div>
        </div>

        <div className="group relative rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
              <AlertCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Available Scripts
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {data.totalScripts.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Charts Row 1 - New Users & Brain Profiles */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* New Users by Week */}
        <div className="group relative rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent dark:from-blue-500/10 dark:via-purple-500/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                New Users Growth
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.newUsersByWeek}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  className="text-gray-200 dark:text-gray-700"
                  strokeOpacity={0.3}
                />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  className="text-gray-600 dark:text-gray-400"
                  stroke="currentColor"
                  strokeOpacity={0.3}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  className="text-gray-600 dark:text-gray-400"
                  stroke="currentColor"
                  strokeOpacity={0.3}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="url(#colorUsers)"
                  strokeWidth={3}
                  dot={{ fill: COLORS.primary, r: 5, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, strokeWidth: 2 }}
                  name="Users"
                />
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Brain Profile Distribution */}
        <div className="group relative rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-transparent dark:from-purple-500/10 dark:via-pink-500/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Brain Profile Distribution
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.brainProfileDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  className="text-sm font-semibold"
                >
                  {data.brainProfileDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Engagement Over Time - Full Width */}
      <div className="group relative rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5 dark:from-green-500/10 dark:via-blue-500/10 dark:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 shadow-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Daily Engagement Trends
            </h3>
            <span className="ml-auto text-sm text-gray-500 dark:text-gray-400 font-medium">
              Last 30 Days
            </span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data.engagementOverTime}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-gray-200 dark:text-gray-700"
                strokeOpacity={0.3}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
                stroke="currentColor"
                strokeOpacity={0.3}
              />
              <YAxis
                tick={{ fontSize: 12, fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
                stroke="currentColor"
                strokeOpacity={0.3}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                iconType="circle"
              />
              <Line
                type="monotone"
                dataKey="scripts"
                stroke={COLORS.success}
                strokeWidth={2.5}
                name="Scripts Used"
                dot={{ fill: COLORS.success, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="videos"
                stroke={COLORS.primary}
                strokeWidth={2.5}
                name="Videos Watched"
                dot={{ fill: COLORS.primary, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="posts"
                stroke={COLORS.warning}
                strokeWidth={2.5}
                name="Posts Created"
                dot={{ fill: COLORS.warning, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Scripts - Full Width */}
      <div className="group relative rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Top 10 Most Popular Scripts
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data.topScripts} layout="horizontal">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-gray-200 dark:text-gray-700"
                strokeOpacity={0.3}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 12, fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
                stroke="currentColor"
                strokeOpacity={0.3}
              />
              <YAxis
                dataKey="title"
                type="category"
                width={180}
                tick={{ fontSize: 11, fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
                stroke="currentColor"
                strokeOpacity={0.3}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="uses"
                fill="url(#colorBar)"
                radius={[0, 8, 8, 0]}
                name="Uses"
              />
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
