import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { useStreakData, type StreakDay, type StreakMilestone } from '@/hooks/useStreakData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flame, TrendingUp, Award, AlertCircle, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakVisualizationProps {
  compact?: boolean;
}

export function StreakVisualization({ compact = false }: StreakVisualizationProps) {
  const { user } = useAuth();
  const { activeChild } = useChildProfiles();
  const { streakData, loading } = useStreakData(user?.profileId, activeChild?.id);

  if (loading) {
    return (
      <Card className="p-6 bg-white/90 backdrop-blur-glass border-none shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-32"></div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const { currentStreak, longestStreak, totalDays, last30Days, milestones, canRecover, recoveryDeadline } = streakData;

  // Group days by week for calendar display
  const weeks: StreakDay[][] = [];
  let currentWeek: StreakDay[] = [];

  last30Days.forEach((day, index) => {
    currentWeek.push(day);
    if ((index + 1) % 7 === 0 || index === last30Days.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  const getDayColor = (day: StreakDay) => {
    if (!day.completed) return 'bg-gray-100 border-gray-200';
    return 'bg-gradient-to-br from-orange-400 to-red-500 border-orange-500 shadow-lg';
  };

  const getStreakMessage = () => {
    if (canRecover) {
      return {
        icon: AlertCircle,
        text: "You missed yesterday! Complete today to save your streak!",
        color: "text-amber-600",
        bgColor: "bg-amber-50 border-amber-200"
      };
    }
    if (currentStreak === 0) {
      return {
        icon: Flame,
        text: "Start your transformation journey today!",
        color: "text-purple-600",
        bgColor: "bg-purple-50 border-purple-200"
      };
    }
    if (currentStreak >= 30) {
      return {
        icon: Award,
        text: `Incredible! ${currentStreak} days of consistency! 🎉`,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50 border-yellow-200"
      };
    }
    if (currentStreak >= 7) {
      return {
        icon: TrendingUp,
        text: `Amazing progress! Keep going! 💪`,
        color: "text-green-600",
        bgColor: "bg-green-50 border-green-200"
      };
    }
    return {
      icon: Flame,
      text: `Great start! ${currentStreak} day${currentStreak > 1 ? 's' : ''} and counting!`,
      color: "text-orange-600",
      bgColor: "bg-orange-50 border-orange-200"
    };
  };

  const message = getStreakMessage();
  const MessageIcon = message.icon;

  if (compact) {
    return (
      <Card className="p-4 bg-white/90 backdrop-blur-glass border-none shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-3xl font-bold">
            {currentStreak} <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">Your Streak</div>
            <p className="text-xs text-muted-foreground">
              {currentStreak === 0 ? "Start today!" : `${currentStreak} days strong!`}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/95 backdrop-blur-glass border-none shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Flame className="w-8 h-8 text-orange-500" />
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              {currentStreak} Day Streak
              {currentStreak > 0 && <span className="text-3xl">🔥</span>}
            </h3>
            <p className="text-sm text-muted-foreground">
              Longest: {longestStreak} days • Total: {totalDays} days
            </p>
          </div>
        </div>
        <Calendar className="w-6 h-6 text-muted-foreground" />
      </div>

      {/* Status Message */}
      <div className={cn("mb-6 p-4 rounded-lg border-2 flex items-start gap-3", message.bgColor)}>
        <MessageIcon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", message.color)} />
        <p className={cn("text-sm font-medium", message.color)}>{message.text}</p>
      </div>

      {/* Visual Calendar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-700">Last 30 Days</h4>
          <Badge variant="secondary" className="text-xs">
            {last30Days.filter(d => d.completed).length} active days
          </Badge>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {last30Days.map((day, index) => {
            const date = new Date(day.date);
            const dayOfMonth = date.getDate();
            const isToday = new Date().toISOString().split('T')[0] === day.date;

            return (
              <div
                key={day.date}
                className={cn(
                  "relative aspect-square rounded-lg border-2 flex flex-col items-center justify-center transition-all hover:scale-105",
                  getDayColor(day),
                  isToday && "ring-2 ring-purple-500 ring-offset-2"
                )}
                title={`${day.date}${day.completed ? ' - Completed ✓' : ' - Not completed'}`}
              >
                <span className={cn(
                  "text-xs font-bold",
                  day.completed ? "text-white" : "text-gray-500"
                )}>
                  {dayOfMonth}
                </span>
                {day.completed && (
                  <span className="text-xs">✓</span>
                )}
                {isToday && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <span>← {weeks[0]?.[0]?.date ? new Date(weeks[0][0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</span>
          <span>Today →</span>
        </div>
      </div>

      {/* Milestone Badges */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Milestone Achievements</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {milestones.map((milestone: StreakMilestone) => (
            <div
              key={milestone.days}
              className={cn(
                "p-3 rounded-lg border-2 transition-all",
                milestone.unlocked
                  ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-md"
                  : "bg-gray-50 border-gray-200 opacity-50"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{milestone.icon}</span>
                {milestone.unlocked && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    ✓
                  </Badge>
                )}
              </div>
              <div className={cn(
                "text-xs font-semibold",
                milestone.unlocked ? milestone.color : "text-gray-500"
              )}>
                {milestone.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {milestone.days} days
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recovery Option */}
      {canRecover && recoveryDeadline && (
        <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-amber-900 mb-1">Streak Recovery Available!</h4>
              <p className="text-xs text-amber-800 mb-3">
                You had a {longestStreak}-day streak going! Complete a task today to continue your journey.
              </p>
              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                Recover My Streak
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
