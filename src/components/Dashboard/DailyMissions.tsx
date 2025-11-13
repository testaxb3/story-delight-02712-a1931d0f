import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { useDailyMissions, type DailyMission } from '@/hooks/useDailyMissions';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, CheckCircle2, ArrowRight, Trophy, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export function DailyMissions() {
  const { user } = useAuth();
  const { activeChild } = useChildProfiles();
  const { missions, loading, totalXP, completedToday, totalMissions } = useDailyMissions(
    user?.profileId,
    activeChild?.brain_profile
  );

  if (loading) {
    return (
      <Card className="p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-glass border-none shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-48"></div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const completionPercentage = totalMissions > 0 ? (completedToday / totalMissions) * 100 : 0;

  return (
    <Card className="p-6 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-slate-800/90 dark:via-slate-800/80 dark:to-slate-800/70 backdrop-blur-glass border-none shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Daily Missions</h3>
            <p className="text-sm text-muted-foreground">
              Complete to earn XP and build your streak
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-2xl font-bold text-purple-600 dark:text-purple-400">
            <Zap className="w-5 h-5" />
            {totalXP}
          </div>
          <p className="text-xs text-muted-foreground">XP Today</p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-6 p-4 bg-white/80 dark:bg-slate-900/80 rounded-xl border-2 border-purple-100 dark:border-purple-900/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-slate-200">
            Today's Progress
          </span>
          <Badge
            variant="secondary"
            className={cn(
              "text-xs font-bold dark:bg-slate-700 dark:text-slate-200",
              completedToday === totalMissions &&
                "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            )}
          >
            {completedToday}/{totalMissions} Complete
          </Badge>
        </div>
        <Progress value={completionPercentage} className="h-3" />
        {completedToday === totalMissions && totalMissions > 0 && (
          <div className="mt-3 flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400">
            <Trophy className="w-4 h-4" />
            All missions completed! You're a parenting champion! 🎉
          </div>
        )}
      </div>

      {/* Missions List */}
      <div className="space-y-3">
        {missions.map((mission: DailyMission) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
      </div>

      {/* Brain Type Badge */}
      {activeChild?.brain_profile && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
          <p className="text-xs text-center text-muted-foreground">
            Missions customized for{' '}
            <Badge variant="secondary" className="text-xs dark:bg-slate-700 dark:text-slate-200">
              {activeChild.brain_profile}
            </Badge>{' '}
            brain type
          </p>
        </div>
      )}
    </Card>
  );
}

function MissionCard({ mission }: { mission: DailyMission }) {
  const progressPercentage = (mission.progress / mission.target) * 100;

  return (
    <div
      className={cn(
        "relative p-4 rounded-xl border-2 transition-all",
        mission.completed
          ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-800 shadow-md"
          : "bg-white dark:bg-slate-900/90 border-gray-200 dark:border-slate-700 hover:border-purple-200 dark:hover:border-purple-700 hover:shadow-md"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={cn(
            "flex-shrink-0 text-3xl w-12 h-12 flex items-center justify-center rounded-lg",
            mission.completed ? "bg-green-100 dark:bg-green-900/50" : "bg-gray-100 dark:bg-slate-800"
          )}
        >
          {mission.completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          ) : (
            <span>{mission.icon}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h4 className={cn(
                "font-semibold text-sm text-foreground",
                mission.completed && "text-green-700 dark:text-green-400"
              )}>
                {mission.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {mission.description}
              </p>
            </div>
            <Badge
              variant="secondary"
              className={cn(
                "text-xs flex-shrink-0 dark:bg-slate-700 dark:text-slate-200",
                mission.completed && "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
              )}
            >
              +{mission.xpReward} XP
            </Badge>
          </div>

          {/* Progress Bar */}
          {!mission.completed && (
            <div className="mb-3">
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {mission.progress}/{mission.target} completed
              </p>
            </div>
          )}

          {/* Completion Status or Action */}
          {mission.completed ? (
            <div className="flex items-center gap-2 text-xs font-medium text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-4 h-4" />
              Mission completed! XP earned.
            </div>
          ) : mission.actionUrl ? (
            <Link to={mission.actionUrl}>
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700"
              >
                <span>Start Mission</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          ) : null}
        </div>
      </div>

      {/* Completion Animation Effect */}
      {mission.completed && (
        <div className="absolute -top-1 -right-1">
          <div className="relative">
            <span className="absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </div>
        </div>
      )}
    </div>
  );
}
