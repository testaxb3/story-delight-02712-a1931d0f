import { Flame, Trophy, TrendingUp } from 'lucide-react';
import { GradientText } from '@/components/common/GradientText';

interface StreakCardProps {
  currentStreak: number;
  scriptsUsed: number;
}

export const StreakCardOptimized = ({ currentStreak, scriptsUsed }: StreakCardProps) => {
  const isStrong = currentStreak >= 7;
  
  return (
    <div
      className={`
        card-gradient p-6 rounded-2xl relative overflow-hidden animate-scale-in
        ${isStrong ? 'border-2 border-warning/30' : ''}
      `}
    >
      {/* Animated flame particles for strong streaks */}
      {isStrong && (
        <>
          <div className="absolute top-4 right-4 text-2xl animate-bounce">
            ✨
          </div>
          <div
            className="absolute bottom-4 right-8 text-xl animate-pulse"
            style={{ animationDelay: '500ms' }}
          >
            🔥
          </div>
        </>
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`
                p-3 rounded-xl shadow-lg transition-transform duration-300
                ${isStrong ? 'bg-gradient-warning hover:scale-110' : 'bg-gradient-to-br from-orange-500 to-red-500'}
              `}
            >
              <Flame className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground font-medium mb-1">
                Day Streak
              </div>
              <div className="animate-scale-in">
                <GradientText className="text-4xl">
                  {currentStreak}
                </GradientText>
              </div>
            </div>
          </div>
          
          {isStrong && (
            <div className="text-right animate-fade-in">
              <div className="animate-bounce">
                <Trophy className="w-8 h-8 text-warning mb-1 mx-auto" />
              </div>
              <p className="text-xs text-warning font-bold">
                {currentStreak} days strong!
              </p>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 text-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
          <TrendingUp className="w-4 h-4 text-success" />
          <span className="text-muted-foreground">
            You're becoming a <span className="font-bold text-success">NEP expert!</span>
          </span>
        </div>
      </div>
    </div>
  );
};
