import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trophy, Target, Flame, Star, Award, Calendar, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ebookContent } from "@/data/ebookContent";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  color: string;
}

export const AchievementsBadges = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [readingStreak, setReadingStreak] = useState(0);
  const [totalChaptersRead, setTotalChaptersRead] = useState(0);

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('ebook-progress');
    const savedStreak = localStorage.getItem('ebook-reading-streak');
    const completedChapters = localStorage.getItem('ebook-completed-chapters');

    let progress = 0;
    if (savedProgress) {
      const data = JSON.parse(savedProgress);
      progress = data.progress || 0;
    }

    const streak = savedStreak ? parseInt(savedStreak) : 0;
    const chaptersRead = completedChapters ? JSON.parse(completedChapters).length : 0;

    setReadingStreak(streak);
    setTotalChaptersRead(chaptersRead);

    // Define achievements
    const allAchievements: Achievement[] = [
      {
        id: 'first-chapter',
        title: 'Getting Started',
        description: 'Read your first chapter',
        icon: BookOpen,
        unlocked: chaptersRead >= 1,
        progress: Math.min(chaptersRead, 1),
        maxProgress: 1,
        color: 'bg-blue-500'
      },
      {
        id: 'halfway',
        title: 'Halfway There',
        description: 'Read 50% of the ebook',
        icon: Target,
        unlocked: progress >= 50,
        progress: Math.min(progress, 50),
        maxProgress: 50,
        color: 'bg-green-500'
      },
      {
        id: 'complete-ebook',
        title: 'Knowledge Master',
        description: 'Complete the entire ebook',
        icon: Trophy,
        unlocked: progress >= 100,
        progress: Math.min(progress, 100),
        maxProgress: 100,
        color: 'bg-yellow-500'
      },
      {
        id: 'streak-3',
        title: 'Building Momentum',
        description: 'Read for 3 days in a row',
        icon: Flame,
        unlocked: streak >= 3,
        progress: Math.min(streak, 3),
        maxProgress: 3,
        color: 'bg-orange-500'
      },
      {
        id: 'streak-7',
        title: 'Week Warrior',
        description: 'Read for 7 days in a row',
        icon: Calendar,
        unlocked: streak >= 7,
        progress: Math.min(streak, 7),
        maxProgress: 7,
        color: 'bg-red-500'
      },
      {
        id: 'all-profiles',
        title: 'Profile Expert',
        description: 'Read all 3 profile chapters',
        icon: Star,
        unlocked: chaptersRead >= 3,
        progress: Math.min(chaptersRead, 3),
        maxProgress: 3,
        color: 'bg-purple-500'
      }
    ];

    setAchievements(allAchievements);
  }, []);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Your Achievements
          </CardTitle>
          <Badge variant="secondary" className="text-sm font-bold">
            {unlockedCount}/{totalCount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            const progressPercent = achievement.maxProgress
              ? (achievement.progress || 0) / achievement.maxProgress * 100
              : 0;

            return (
              <div
                key={achievement.id}
                className={cn(
                  "p-3 md:p-4 rounded-xl border-2 transition-all",
                  achievement.unlocked
                    ? "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/30 shadow-md"
                    : "bg-muted/20 border-border opacity-60"
                )}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  {/* Icon */}
                  <div className={cn(
                    "p-2 md:p-3 rounded-lg md:rounded-xl shrink-0",
                    achievement.unlocked ? achievement.color : "bg-muted",
                    achievement.unlocked ? "text-white" : "text-muted-foreground"
                  )}>
                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={cn(
                        "font-bold text-sm",
                        achievement.unlocked ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {achievement.title}
                      </h4>
                      {achievement.unlocked && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {achievement.description}
                    </p>

                    {/* Progress Bar */}
                    {!achievement.unlocked && achievement.maxProgress && (
                      <div className="space-y-1">
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn("h-full transition-all duration-500", achievement.color)}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          {achievement.progress}/{achievement.maxProgress}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reading Streak Indicator */}
        {readingStreak > 0 && (
          <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-2 border-orange-500/30 rounded-xl">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-orange-500 rounded-lg">
                <Flame className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {readingStreak} Day Streak! 🔥
                </p>
                <p className="text-xs text-muted-foreground">
                  Keep reading daily to maintain your streak
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
