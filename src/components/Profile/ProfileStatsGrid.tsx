import { memo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, BookOpen, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { UserStats } from '@/hooks/useUserStats';
import { routes } from '@/lib/navigation';

interface ProfileStatsGridProps {
  stats: UserStats;
}

// PERFORMANCE OPTIMIZATION: Memoized component to prevent unnecessary re-renders
const ProfileStatsGridComponent = ({ stats }: ProfileStatsGridProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Day Streak Card */}
      <Card className="relative overflow-hidden p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-left-3 duration-500">
        <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full blur-2xl"></div>
        <div className="relative">
          <div className="flex justify-center mb-2">
            <div className="relative">
              <Target className="w-10 h-10 text-orange-600" />
              {stats.dayStreak > 1 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-ping"></div>
              )}
            </div>
          </div>
          <div className="text-3xl font-black mb-1 text-center bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            {stats.dayStreak} {stats.dayStreak >= 3 ? '🔥' : ''}
          </div>
          <div className="text-xs font-semibold text-orange-900 text-center mb-3">
            Day Streak
          </div>
          <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-2 backdrop-blur-sm transition-colors duration-300">
            <div className="text-[10px] text-muted-foreground text-center mb-1">
              Best: {stats.bestStreak} {stats.bestStreak > 1 ? 'days' : 'day'}
            </div>
            <div className="text-[10px] text-orange-600 dark:text-orange-400 font-bold text-center">
              {stats.dayStreak >= 7 ? 'Amazing!' : 'Keep Going!'}
            </div>
          </div>
        </div>
      </Card>

      {/* Scripts Used Card */}
      <Card className="relative overflow-hidden p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75">
        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl"></div>
        <div className="relative">
          <div className="flex justify-center mb-2">
            <BookOpen className="w-10 h-10 text-purple-600" />
          </div>
          <div className="text-3xl font-black mb-1 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {stats.scriptsUsed}
          </div>
          <div className="text-xs font-semibold text-purple-900 text-center mb-2">
            Scripts Used
          </div>
          <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-2 backdrop-blur-sm transition-colors duration-300">
            <div className="text-[10px] text-muted-foreground text-center mb-1.5">
              Goal: <span className="font-bold text-purple-700 dark:text-purple-300">3/week</span>
            </div>
            <div className="w-full bg-purple-200/50 dark:bg-purple-900/30 rounded-full h-1.5 mb-1.5">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-600 dark:to-blue-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((stats.scriptsUsed / 3) * 100, 100)}%` }}
              ></div>
            </div>
            {stats.scriptsUsed === 0 && (
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-[10px] font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 w-full"
                onClick={() => navigate('/scripts')}
              >
                Start today →
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Videos Watched Card */}
      <Card className="relative overflow-hidden p-4 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border-pink-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-right-3 duration-500 delay-150">
        <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/10 rounded-full blur-2xl"></div>
        <div className="relative">
          <div className="flex justify-center mb-2">
            <Video className="w-10 h-10 text-pink-600" />
          </div>
          <div className="text-3xl font-black mb-1 text-center bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            {stats.videosWatched}
          </div>
          <div className="text-xs font-semibold text-pink-900 text-center mb-2">
            Videos Watched
          </div>
          <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-2 backdrop-blur-sm transition-colors duration-300">
            <div className="text-[10px] text-muted-foreground text-center mb-1.5">
              <span className="font-bold text-pink-700 dark:text-pink-300">
                {Math.max(3 - stats.videosWatched, 0)} videos
              </span>{' '}
              {stats.videosWatched >= 3 ? 'complete!' : 'waiting'}
            </div>
            <div className="w-full bg-pink-200/50 dark:bg-pink-900/30 rounded-full h-1.5 mb-1.5">
              <div
                className="bg-gradient-to-r from-pink-500 to-rose-500 dark:from-pink-600 dark:to-rose-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((stats.videosWatched / 3) * 100, 100)}%` }}
              ></div>
            </div>
            {stats.videosWatched === 0 && (
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-[10px] font-bold text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 w-full"
                onClick={() => navigate(routes.bonusesVideos)}
              >
                Watch Foundation →
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

// Export memoized version with custom comparison function
export const ProfileStatsGrid = memo(ProfileStatsGridComponent, (prevProps, nextProps) => {
  // Custom comparison: only re-render if stats actually change
  return (
    prevProps.stats.dayStreak === nextProps.stats.dayStreak &&
    prevProps.stats.bestStreak === nextProps.stats.bestStreak &&
    prevProps.stats.scriptsUsed === nextProps.stats.scriptsUsed &&
    prevProps.stats.videosWatched === nextProps.stats.videosWatched
  );
});
