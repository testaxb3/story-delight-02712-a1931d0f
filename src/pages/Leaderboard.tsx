import { AnimatedPage } from "@/components/common/AnimatedPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import { Skeleton } from "@/components/common/Skeleton";

export default function Leaderboard() {
  const leaders = [
    { rank: 1, name: "Alex Johnson", streak: 28, icon: Trophy, color: "text-yellow-500" },
    { rank: 2, name: "Sarah Williams", streak: 25, icon: Medal, color: "text-gray-400" },
    { rank: 3, name: "Mike Chen", streak: 22, icon: Award, color: "text-orange-600" },
    { rank: 4, name: "Emma Davis", streak: 20, icon: null, color: "" },
    { rank: 5, name: "James Brown", streak: 18, icon: null, color: "" },
  ];

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Leaderboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-8">
            Top NEP practitioners this month
          </p>

          <div className="space-y-4">
            {leaders.map((leader) => (
              <Card key={leader.rank} className={leader.rank <= 3 ? "border-primary/50" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-muted-foreground w-12">
                        #{leader.rank}
                      </div>
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>{leader.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-lg">{leader.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {leader.streak} day streak
                        </p>
                      </div>
                    </div>
                    {leader.icon && (
                      <leader.icon className={`w-8 h-8 ${leader.color}`} />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
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
