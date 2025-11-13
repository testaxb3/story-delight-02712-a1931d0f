import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Lock } from 'lucide-react';
import { useAchievements } from '@/hooks/useAchievements';
import type { UserStats } from '@/hooks/useUserStats';

interface AchievementsCardProps {
  stats: UserStats;
}

export function AchievementsCard({ stats }: AchievementsCardProps) {
  const { achievements, progress } = useAchievements(stats);

  return (
    <Card className="relative overflow-hidden p-6 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-950/30 dark:via-amber-950/30 dark:to-orange-950/30 border-yellow-200/50 dark:border-yellow-700/50 shadow-lg animate-in fade-in slide-in-from-bottom-6 duration-500 transition-colors">
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 dark:bg-yellow-500/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-400/20 dark:bg-orange-500/30 rounded-full blur-3xl"></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-yellow-600 dark:to-orange-600 flex items-center justify-center shadow-lg transition-colors">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-yellow-700 to-orange-700 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
                Achievements
              </h2>
              <p className="text-xs text-muted-foreground">
                {progress.unlockedCount} of {progress.totalCount} unlocked
              </p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-900/90 dark:to-orange-900/90 text-white border-none shadow-md transition-colors">
            {progress.level}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {achievements.map((achievement, index) =>
            achievement.unlocked ? (
              <div key={achievement.id} className="group relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-${achievement.gradient.from} to-${achievement.gradient.to} rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity`}
                ></div>
                <div
                  className={`relative flex flex-col items-center p-4 bg-gradient-to-br ${achievement.bgColor} border-2 ${achievement.borderColor} rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-in zoom-in duration-300`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative mb-2">
                    <div className="text-4xl animate-bounce">{achievement.emoji}</div>
                    <div
                      className={`absolute -top-1 -right-1 w-3 h-3 bg-${achievement.gradient.from.split('-')[0]}-500 rounded-full animate-ping`}
                    ></div>
                  </div>
                  <p className={`text-xs font-bold text-center ${achievement.textColor} mb-1`}>
                    {achievement.title}
                  </p>
                  <Badge
                    className={`${achievement.badgeBg} ${achievement.badgeText} ${achievement.badgeBorder} text-[10px] px-1.5 py-0`}
                  >
                    Unlocked!
                  </Badge>
                </div>
              </div>
            ) : (
              <div key={achievement.id} className="group relative">
                <div
                  className={`relative flex flex-col items-center p-4 bg-gradient-to-br ${achievement.bgColor} border-2 border-gray-300/50 rounded-xl opacity-60 hover:opacity-70 transition-all duration-300 animate-in fade-in duration-300`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative text-3xl mb-2 grayscale">
                    {achievement.emoji}
                    <Lock className="w-4 h-4 absolute -top-1 -right-1 text-gray-500" />
                  </div>
                  <p className="text-xs font-bold text-center text-gray-700 mb-0.5">
                    {achievement.title}
                  </p>
                  <p className="text-[9px] text-center text-gray-500">
                    {achievement.progress || achievement.description}
                  </p>
                </div>
              </div>
            )
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-5 pt-4 border-t border-yellow-200 dark:border-yellow-800/50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-yellow-900 dark:text-yellow-300">Achievement Progress</p>
            <p className="text-xs font-bold text-yellow-700 dark:text-yellow-400">{progress.percentage}%</p>
          </div>
          <div className="w-full bg-yellow-200/50 dark:bg-yellow-900/30 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 dark:from-yellow-600 dark:via-orange-600 dark:to-red-600 h-2 rounded-full shadow-lg transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            >
              <div className="w-full h-full bg-white/30 animate-pulse"></div>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
            {progress.nextAchievement}
          </p>
        </div>
      </div>
    </Card>
  );
}
