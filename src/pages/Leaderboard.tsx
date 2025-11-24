import { AnimatedPage } from "@/components/common/AnimatedPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import { Skeleton } from "@/components/common/Skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardEntry {
  rank: number;
  anonymous_name: string;
  brain_profile: string | null;
  completed_days: number;
  current_streak: number;
  last_active_date: string;
}

export default function Leaderboard() {
  const { data: leaders, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('rank', { ascending: true })
        .limit(10);

      if (error) throw error;
      return (data || []) as LeaderboardEntry[];
    }
  });

  const getIconAndColor = (rank: number) => {
    if (rank === 1) return { icon: Trophy, color: "text-yellow-500" };
    if (rank === 2) return { icon: Medal, color: "text-gray-400" };
    if (rank === 3) return { icon: Award, color: "text-orange-600" };
    return { icon: null, color: "" };
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Leaderboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-8">
            Top NEP practitioners this month
          </p>

          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              leaders?.map((leader) => {
                const { icon: Icon, color } = getIconAndColor(leader.rank);
                return (
                  <Card key={leader.rank} className={leader.rank <= 3 ? "border-primary/50" : ""}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl font-bold text-muted-foreground w-12">
                            #{leader.rank}
                          </div>
                          <Avatar className="w-12 h-12">
                            <AvatarFallback>{getInitials(leader.anonymous_name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-lg">{leader.anonymous_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {leader.completed_days} days • {leader.current_streak} day streak
                            </p>
                            {leader.brain_profile && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                {leader.brain_profile}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {Icon && (
                          <Icon className={`w-8 h-8 ${color}`} />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          <Card className="bg-accent/50">
            <CardHeader>
              <CardTitle>🎯 Your Rank</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Keep practicing to climb the leaderboard! Your current streak determines your position.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimatedPage>
  );
}
