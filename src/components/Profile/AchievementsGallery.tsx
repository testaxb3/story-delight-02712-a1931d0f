import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Flame, 
  BookOpen, 
  Target, 
  Zap, 
  Trophy, 
  Star,
  Award,
  Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: typeof Flame;
  progress: number;
  total: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementsGalleryProps {
  completedDays: number;
  scriptsUsed: number;
  currentStreak: number;
}

export function AchievementsGallery({ 
  completedDays, 
  scriptsUsed, 
  currentStreak 
}: AchievementsGalleryProps) {
  const achievements = useMemo((): Achievement[] => {
    return [
      {
        id: '7day',
        title: 'Week Warrior',
        description: 'Complete 7 consecutive days',
        icon: Flame,
        progress: currentStreak,
        total: 7,
        unlocked: currentStreak >= 7,
        rarity: 'common',
      },
      {
        id: '14day',
        title: 'Two Week Champion',
        description: 'Complete 14 consecutive days',
        icon: Flame,
        progress: currentStreak,
        total: 14,
        unlocked: currentStreak >= 14,
        rarity: 'rare',
      },
      {
        id: '30day',
        title: 'Transformation Complete',
        description: 'Complete the full 30-day journey',
        icon: Crown,
        progress: completedDays,
        total: 30,
        unlocked: completedDays >= 30,
        rarity: 'legendary',
      },
      {
        id: '50scripts',
        title: 'Script Master',
        description: 'Use 50 different scripts',
        icon: BookOpen,
        progress: scriptsUsed,
        total: 50,
        unlocked: scriptsUsed >= 50,
        rarity: 'rare',
      },
      {
        id: '100scripts',
        title: 'NEP Expert',
        description: 'Use 100 different scripts',
        icon: Star,
        progress: scriptsUsed,
        total: 100,
        unlocked: scriptsUsed >= 100,
        rarity: 'epic',
      },
      {
        id: '15days',
        title: 'Halfway Hero',
        description: 'Complete 15 days',
        icon: Target,
        progress: completedDays,
        total: 15,
        unlocked: completedDays >= 15,
        rarity: 'common',
      },
      {
        id: '21day',
        title: 'Habit Builder',
        description: 'Complete 21 consecutive days',
        icon: Zap,
        progress: currentStreak,
        total: 21,
        unlocked: currentStreak >= 21,
        rarity: 'epic',
      },
      {
        id: 'perfect_week',
        title: 'Perfect Week',
        description: 'Complete 7 days with low stress',
        icon: Trophy,
        progress: 0, // Would need stress data
        total: 7,
        unlocked: false,
        rarity: 'rare',
      },
    ];
  }, [completedDays, scriptsUsed, currentStreak]);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return 'from-yellow-400 to-orange-500';
      case 'epic':
        return 'from-purple-400 to-pink-500';
      case 'rare':
        return 'from-blue-400 to-cyan-500';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const nextAchievement = achievements.find(a => !a.unlocked);

  return (
    <Card className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold text-foreground">Achievements</h3>
          <Badge variant="outline" className="text-base">
            {unlockedCount}/{achievements.length}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Track your parenting journey milestones
        </p>
      </div>

      {/* Next Achievement Progress */}
      {nextAchievement && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20"
        >
          <p className="text-sm font-semibold text-foreground mb-2">Next Achievement</p>
          <div className="flex items-center gap-3 mb-3">
            {(() => {
              const Icon = nextAchievement.icon;
              return <Icon className="w-5 h-5 text-primary" />;
            })()}
            <div className="flex-1">
              <p className="font-bold text-foreground">{nextAchievement.title}</p>
              <p className="text-xs text-muted-foreground">{nextAchievement.description}</p>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{nextAchievement.progress}/{nextAchievement.total}</span>
            </div>
            <Progress 
              value={(nextAchievement.progress / nextAchievement.total) * 100} 
              className="h-2"
            />
          </div>
        </motion.div>
      )}

      {/* Achievements Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          const percentage = (achievement.progress / achievement.total) * 100;

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'relative p-4 rounded-xl border-2 transition-all',
                achievement.unlocked
                  ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} text-white cursor-pointer hover:scale-105`
                  : 'bg-muted/50 border-border grayscale opacity-50'
              )}
            >
              {/* Rarity Badge */}
              {achievement.unlocked && (
                <Badge 
                  className="absolute top-2 right-2 text-xs bg-black/30 text-white border-none"
                >
                  {achievement.rarity}
                </Badge>
              )}

              {/* Icon */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center',
                  achievement.unlocked ? 'bg-white/20' : 'bg-muted'
                )}>
                  <Icon className={cn(
                    'w-6 h-6',
                    achievement.unlocked ? 'text-white' : 'text-muted-foreground'
                  )} />
                </div>

                <div>
                  <p className={cn(
                    'font-bold text-xs',
                    achievement.unlocked ? 'text-white' : 'text-foreground'
                  )}>
                    {achievement.title}
                  </p>
                  {!achievement.unlocked && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {achievement.progress}/{achievement.total}
                    </p>
                  )}
                </div>

                {/* Progress for locked achievements */}
                {!achievement.unlocked && percentage > 0 && (
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
