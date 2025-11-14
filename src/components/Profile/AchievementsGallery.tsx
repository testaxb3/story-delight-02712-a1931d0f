import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Lock } from 'lucide-react';
import { useAchievements } from '@/hooks/useAchievements';
import type { UserStats } from '@/hooks/useUserStats';

interface AchievementsGalleryProps {
  stats: UserStats;
}

export function AchievementsGallery({ stats }: AchievementsGalleryProps) {
  const { achievements, progress } = useAchievements(stats);

  return (
    <Card className="p-4 space-y-4">
      {/* Header compacto */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-foreground">Achievements</h3>
          <p className="text-xs text-muted-foreground">
            {progress.unlockedCount}/{progress.totalCount} unlocked
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-primary">{progress.level}</div>
          <Progress value={progress.percentage} className="h-1.5 w-20 mt-1" />
        </div>
      </div>

      {/* Grid de conquistas - 3 colunas no mobile */}
      <div className="grid grid-cols-3 gap-2">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`relative rounded-lg p-2 text-center transition-all ${
              achievement.unlocked
                ? `bg-gradient-to-br ${achievement.bgColor} border-2 ${achievement.borderColor}`
                : 'bg-muted/20 border border-border/30 opacity-50'
            }`}
          >
            {/* Lock overlay para não desbloqueadas */}
            {!achievement.unlocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-lg">
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
            )}

            {/* Emoji grande */}
            <div className="text-3xl mb-1">{achievement.emoji}</div>

            {/* Título compacto */}
            <h4 className={`text-[10px] font-bold leading-tight mb-0.5 ${
              achievement.unlocked ? achievement.textColor : 'text-muted-foreground'
            }`}>
              {achievement.title}
            </h4>

            {/* Progress para não desbloqueadas */}
            {!achievement.unlocked && achievement.progress && (
              <p className="text-[9px] text-muted-foreground">{achievement.progress}</p>
            )}

            {/* Badge para desbloqueadas */}
            {achievement.unlocked && (
              <div className={`mx-auto w-fit px-1.5 py-0.5 rounded-full text-[8px] font-bold ${achievement.badgeBg} ${achievement.badgeText}`}>
                ✓
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Next achievement */}
      {progress.nextAchievement && (
        <div className="bg-primary/5 rounded-lg p-2 border border-primary/20">
          <p className="text-xs font-semibold text-foreground mb-1">🎯 Next Goal</p>
          <p className="text-[10px] text-muted-foreground">{progress.nextAchievement}</p>
        </div>
      )}
    </Card>
  );
}
