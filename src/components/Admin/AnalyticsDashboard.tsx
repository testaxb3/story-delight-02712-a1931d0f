import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, TrendingUp, MessageSquare, BookOpen, Video, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AnalyticsDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const [users, posts, scripts, videos, recentPosts, progress] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact" }),
        supabase.from("community_posts").select("id", { count: "exact" }),
        supabase.from("scripts").select("id", { count: "exact" }),
        supabase.from("videos").select("id", { count: "exact" }),
        supabase.from("community_posts")
          .select("id", { count: "exact" })
          .gte("created_at", sevenDaysAgo.toISOString()),
        supabase.from("user_progress")
          .select("scripts_used, videos_watched")
      ]);

      // Calculate most used scripts count
      const scriptUsageTotal = progress.data?.reduce((acc, p) => acc + (p.scripts_used || 0), 0) || 0;
      const videosWatchedTotal = progress.data?.reduce((acc, p) => acc + (p.videos_watched?.length || 0), 0) || 0;

      return {
        totalUsers: users.count || 0,
        communityPosts: posts.count || 0,
        totalScripts: scripts.count || 0,
        totalVideos: videos.count || 0,
        recentPosts: recentPosts.count || 0,
        scriptUsageTotal,
        videosWatchedTotal,
        postsGrowth: posts.count && recentPosts.count ? Math.round((recentPosts.count / posts.count) * 100) : 0,
      };
    },
  });

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-950",
      subtitle: "Registered accounts",
    },
    {
      title: "Community Posts",
      value: stats?.communityPosts || 0,
      icon: MessageSquare,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-950",
      subtitle: `${stats?.recentPosts || 0} in last 7 days`,
      trend: stats?.postsGrowth,
    },
    {
      title: "NEP Scripts",
      value: stats?.totalScripts || 0,
      icon: BookOpen,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-950",
      subtitle: `${stats?.scriptUsageTotal || 0} total uses`,
    },
    {
      title: "Video Lessons",
      value: stats?.totalVideos || 0,
      icon: Video,
      color: "text-orange-500",
      bgColor: "bg-orange-100 dark:bg-orange-950",
      subtitle: `${stats?.videosWatchedTotal || 0} total views`,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Analytics Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat) => (
              <div key={stat.title} className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${stat.bgColor}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  {stat.trend !== undefined && (
                    <Badge variant={stat.trend > 0 ? "default" : "secondary"} className="gap-1">
                      {stat.trend > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {stat.trend}%
                    </Badge>
                  )}
                </div>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm font-medium mb-1">{stat.title}</p>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
