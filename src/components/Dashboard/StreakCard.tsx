import { Flame, Trophy, TrendingUp } from 'lucide-react';
import { GradientText } from '@/components/common/GradientText';

interface StreakCardProps {
  currentStreak: number;
  scriptsUsed: number;
}

export const StreakCard = ({ currentStreak, scriptsUsed }: StreakCardProps) => {
  const isStrong = currentStreak >= 7;
  
  return (
    <div className={`
      card-gradient p-6 rounded-2xl relative overflow-hidden
      ${isStrong ? 'border-2 border-warning/30' : ''}
    `}>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`
              p-3 rounded-xl shadow-lg
              ${isStrong ? 'bg-gradient-warning' : 'bg-gradient-to-br from-orange-500 to-red-500'}
            `}>
              <Flame className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground font-medium mb-1">
                Day Streak
              </div>
              <GradientText className="text-4xl">
                {currentStreak}
              </GradientText>
            </div>
          </div>
          
          {isStrong && (
            <div className="text-right">
              <Trophy className="w-8 h-8 text-warning mb-1 mx-auto" />
              <p className="text-xs text-warning font-bold">
                {currentStreak} days strong!
              </p>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-success" />
          <span className="text-muted-foreground">
            You're becoming a <span className="font-bold text-success">NEP expert!</span>
          </span>
        </div>
      </div>
    </div>
  );
};
