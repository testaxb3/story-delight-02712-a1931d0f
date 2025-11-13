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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-7 h-7 text-primary" />
            Analytics Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Real-time insights into your NEP System</p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
            <TabsList>
              <TabsTrigger value="7d">7 Days</TabsTrigger>
              <TabsTrigger value="30d">30 Days</TabsTrigger>
              <TabsTrigger value="90d">90 Days</TabsTrigger>
              <TabsTrigger value="all">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={handleExportData} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <Users className="w-8 h-8 text-blue-600" />
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-900">{data.totalUsers}</div>
          <div className="text-sm font-semibold text-blue-700">Total Users</div>
          <div className="text-xs text-blue-600 mt-1">{data.activeUsers7d} active (7d)</div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between mb-3">
            <BookOpen className="w-8 h-8 text-green-600" />
            <Zap className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-900">{data.scriptsUsedTotal}</div>
          <div className="text-sm font-semibold text-green-700">Scripts Used</div>
          <div className="text-xs text-green-600 mt-1">{data.scriptsUsedToday} today</div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <Video className="w-8 h-8 text-purple-600" />
            <Eye className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-purple-900">{data.videoWatchesTotal}</div>
          <div className="text-sm font-semibold text-purple-700">Video Watches</div>
          <div className="text-xs text-purple-600 mt-1">{data.avgVideosPerUser.toFixed(1)} avg/user</div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between mb-3">
            <Target className="w-8 h-8 text-orange-600" />
            <CheckCircle2 className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-orange-900">{data.trackerDaysCompleted}</div>
          <div className="text-sm font-semibold text-orange-700">Days Tracked</div>
          <div className="text-xs text-orange-600 mt-1">{data.retentionRate.toFixed(0)}% retention</div>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white/90 border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-primary" />
            <div className="text-xs font-medium text-muted-foreground">Quiz Completion</div>
          </div>
          <div className="text-2xl font-bold">{data.quizCompletionRate.toFixed(0)}%</div>
        </Card>

        <Card className="p-4 bg-white/90 border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-success" />
            <div className="text-xs font-medium text-muted-foreground">Avg Scripts/User</div>
          </div>
          <div className="text-2xl font-bold">{data.avgScriptsPerUser.toFixed(1)}</div>
        </Card>

        <Card className="p-4 bg-white/90 border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <div className="text-xs font-medium text-muted-foreground">Community Posts</div>
          </div>
          <div className="text-2xl font-bold">{data.communityPosts}</div>
        </Card>

        <Card className="p-4 bg-white/90 border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <div className="text-xs font-medium text-muted-foreground">Available Scripts</div>
          </div>
          <div className="text-2xl font-bold">{data.totalScripts}</div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* New Users by Week */}
        <Card className="p-6 bg-white/90 backdrop-blur-glass border-none shadow-lg">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            New Users (Last 8 Weeks)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.newUsersByWeek}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke={COLORS.primary}
                strokeWidth={3}
                dot={{ fill: COLORS.primary, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Brain Profile Distribution */}
        <Card className="p-6 bg-white/90 backdrop-blur-glass border-none shadow-lg">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Brain Profile Distribution
          </h3>
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
              >
                {data.brainProfileDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Engagement Over Time */}
      <Card className="p-6 bg-white/90 backdrop-blur-glass border-none shadow-lg">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Daily Engagement (Last 30 Days)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.engagementOverTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              stroke="#6b7280"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="scripts"
              stroke={COLORS.success}
              strokeWidth={2}
              name="Scripts Used"
            />
            <Line
              type="monotone"
              dataKey="videos"
              stroke={COLORS.primary}
              strokeWidth={2}
              name="Videos Watched"
            />
            <Line
              type="monotone"
              dataKey="posts"
              stroke={COLORS.warning}
              strokeWidth={2}
              name="Posts Created"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Top Scripts */}
      <Card className="p-6 bg-white/90 backdrop-blur-glass border-none shadow-lg">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Top 10 Most Used Scripts
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data.topScripts} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis
              dataKey="title"
              type="category"
              width={150}
              tick={{ fontSize: 11 }}
              stroke="#6b7280"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="uses" fill={COLORS.primary} radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
