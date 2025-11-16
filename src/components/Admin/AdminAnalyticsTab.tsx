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
  INTENSE: 'hsl(var(--intense))',
  DISTRACTED: 'hsl(var(--distracted))',
  DEFIANT: 'hsl(var(--defiant))',
  primary: 'hsl(var(--primary))',
  success: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
};

// Custom tooltip component for dark mode support
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-foreground mb-1">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-muted-foreground">
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
      <div className="relative overflow-hidden rounded-2xl card-glass border shadow-lg">
        <div className="absolute inset-0 gradient-mesh opacity-5"></div>
        <div className="relative p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold flex items-center gap-3 gradient-text">
                <div className="p-2.5 rounded-xl gradient-primary shadow-glow">
                  <Activity className="w-7 h-7 text-primary-foreground" />
                </div>
                Analytics Dashboard
              </h2>
              <p className="text-sm text-muted-foreground font-medium">
                Real-time insights into your NEP System performance
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Tabs value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
                <TabsList className="bg-card/80 backdrop-blur-sm border border-border shadow-sm">
                  <TabsTrigger value="7d" className="data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
                    7 Days
                  </TabsTrigger>
                  <TabsTrigger value="30d" className="data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
                    30 Days
                  </TabsTrigger>
                  <TabsTrigger value="90d" className="data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
                    90 Days
                  </TabsTrigger>
                  <TabsTrigger value="all" className="data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
                    All Time
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button
                onClick={handleExportData}
                variant="outline"
                className="backdrop-premium"
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
        <div className="group relative overflow-hidden rounded-2xl card-glass border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl gradient-primary shadow-glow">
                <Users className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-foreground">
                {data.totalUsers.toLocaleString()}
              </div>
              <div className="text-sm font-semibold text-muted-foreground">
                Total Users
              </div>
              <div className="flex items-center gap-2 text-xs text-primary font-medium bg-primary/10 px-2.5 py-1.5 rounded-lg w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                {data.activeUsers7d} active (7d)
              </div>
            </div>
          </div>
        </div>

        {/* Scripts Used Card */}
        <div className="group relative overflow-hidden rounded-2xl card-glass border border-success/20 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
          <div className="absolute inset-0 bg-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl gradient-success shadow-glow">
                <BookOpen className="w-7 h-7 text-success-foreground" />
              </div>
              <div className="p-2 rounded-lg bg-success/10">
                <Zap className="w-4 h-4 text-success" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-foreground">
                {data.scriptsUsedTotal.toLocaleString()}
              </div>
              <div className="text-sm font-semibold text-muted-foreground">
                Scripts Used
              </div>
              <div className="flex items-center gap-2 text-xs text-success font-medium bg-success/10 px-2.5 py-1.5 rounded-lg w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div>
                {data.scriptsUsedToday} today
              </div>
            </div>
          </div>
        </div>

        {/* Video Watches Card */}
        <div className="group relative overflow-hidden rounded-2xl card-glass border border-accent/20 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
          <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl gradient-accent shadow-glow">
                <Video className="w-7 h-7 text-accent-foreground" />
              </div>
              <div className="p-2 rounded-lg bg-accent/10">
                <Eye className="w-4 h-4 text-accent" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-foreground">
                {data.videoWatchesTotal.toLocaleString()}
              </div>
              <div className="text-sm font-semibold text-muted-foreground">
                Video Watches
              </div>
              <div className="flex items-center gap-2 text-xs text-accent font-medium bg-accent/10 px-2.5 py-1.5 rounded-lg w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
                {data.totalVideos} videos available
              </div>
            </div>
          </div>
        </div>

        {/* Tracker Days Card */}
        <div className="group relative overflow-hidden rounded-2xl card-glass border border-warning/20 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
          <div className="absolute inset-0 bg-warning/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl gradient-warning shadow-glow">
                <Target className="w-7 h-7 text-warning-foreground" />
              </div>
              <div className="p-2 rounded-lg bg-warning/10">
                <CheckCircle2 className="w-4 h-4 text-warning" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-foreground">
                {data.trackerDaysCompleted.toLocaleString()}
              </div>
              <div className="text-sm font-semibold text-muted-foreground">
                Days Tracked
              </div>
              <div className="flex items-center gap-2 text-xs text-warning font-medium bg-warning/10 px-2.5 py-1.5 rounded-lg w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse"></div>
                {data.retentionRate.toFixed(0)}% retention
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics - Compact Glass Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group relative rounded-xl card-glass border p-5 shadow-md hover:shadow-lg transition-all duration-300 hover-lift">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Quiz Completion
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">
            {data.quizCompletionRate.toFixed(0)}%
          </div>
        </div>

        <div className="group relative rounded-xl card-glass border p-5 shadow-md hover:shadow-lg transition-all duration-300 hover-lift">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-success/10">
              <BookOpen className="w-5 h-5 text-success" />
            </div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Scripts/User
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">
            {data.avgScriptsPerUser.toFixed(1)}
          </div>
        </div>

        <div className="group relative rounded-xl card-glass border p-5 shadow-md hover:shadow-lg transition-all duration-300 hover-lift">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Users className="w-5 h-5 text-secondary" />
            </div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Community Posts
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">
            {data.communityPosts.toLocaleString()}
          </div>
        </div>

        <div className="group relative rounded-xl card-glass border p-5 shadow-md hover:shadow-lg transition-all duration-300 hover-lift">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <AlertCircle className="w-5 h-5 text-accent" />
            </div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Available Scripts
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">
            {data.totalScripts.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Charts Row 1 - New Users & Brain Profiles */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* New Users by Week */}
        <div className="group relative rounded-2xl backdrop-premium shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl gradient-primary shadow-glow">
                <Calendar className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                New Users Growth
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.newUsersByWeek}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  className="text-muted"
                  strokeOpacity={0.3}
                />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  className="text-muted-foreground"
                  stroke="currentColor"
                  strokeOpacity={0.3}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  className="text-muted-foreground"
                  stroke="currentColor"
                  strokeOpacity={0.3}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke={COLORS.primary}
                  strokeWidth={3}
                  dot={{ fill: COLORS.primary, r: 5, strokeWidth: 2, stroke: 'hsl(var(--card))' }}
                  activeDot={{ r: 7, strokeWidth: 2 }}
                  name="Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Brain Profile Distribution */}
        <div className="group relative rounded-2xl backdrop-premium shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl gradient-accent shadow-glow">
                <Brain className="w-5 h-5 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
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
                  fill="hsl(var(--primary))"
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
      <div className="group relative rounded-2xl backdrop-premium shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="absolute inset-0 gradient-mesh opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl gradient-hero shadow-glow">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Daily Engagement Trends
            </h3>
            <span className="ml-auto text-sm text-muted-foreground font-medium">
              Last 30 Days
            </span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data.engagementOverTime}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-muted"
                strokeOpacity={0.3}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: 'currentColor' }}
                className="text-muted-foreground"
                stroke="currentColor"
                strokeOpacity={0.3}
              />
              <YAxis
                tick={{ fontSize: 12, fill: 'currentColor' }}
                className="text-muted-foreground"
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
                activeDot={{ r: 5, strokeWidth: 2, stroke: 'hsl(var(--card))' }}
              />
              <Line
                type="monotone"
                dataKey="videos"
                stroke={COLORS.primary}
                strokeWidth={2.5}
                name="Videos Watched"
                dot={{ fill: COLORS.primary, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 2, stroke: 'hsl(var(--card))' }}
              />
              <Line
                type="monotone"
                dataKey="posts"
                stroke={COLORS.warning}
                strokeWidth={2.5}
                name="Posts Created"
                dot={{ fill: COLORS.warning, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 2, stroke: 'hsl(var(--card))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Scripts - Full Width */}
      <div className="group relative rounded-2xl backdrop-premium shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="absolute inset-0 gradient-mesh opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl gradient-accent shadow-glow">
              <TrendingUp className="w-5 h-5 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Top 10 Most Popular Scripts
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data.topScripts} layout="horizontal">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-muted"
                strokeOpacity={0.3}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 12, fill: 'currentColor' }}
                className="text-muted-foreground"
                stroke="currentColor"
                strokeOpacity={0.3}
              />
              <YAxis
                dataKey="title"
                type="category"
                width={180}
                tick={{ fontSize: 11, fill: 'currentColor' }}
                className="text-muted-foreground"
                stroke="currentColor"
                strokeOpacity={0.3}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="uses"
                fill={COLORS.primary}
                radius={[0, 8, 8, 0]}
                name="Uses"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
