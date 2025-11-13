import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Star, Trophy, Crown } from 'lucide-react';

interface LevelBadgeProps {
  completedDays: number;
  scriptsUsed: number;
}

export function LevelBadge({ completedDays, scriptsUsed }: LevelBadgeProps) {
  const levelData = useMemo(() => {
    // Calculate level based on days + scripts
    const points = completedDays * 10 + scriptsUsed * 2;
    const level = Math.floor(points / 100) + 1;
    
    const currentLevelPoints = (level - 1) * 100;
    const nextLevelPoints = level * 100;
    const progress = ((points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;

    // Determine rank title
    let title = 'Beginner';
    let icon = Sparkles;
    let gradient = 'from-gray-400 to-gray-600';

    if (level >= 20) {
      title = 'Master Parent';
      icon = Crown;
      gradient = 'from-yellow-400 to-orange-500';
    } else if (level >= 15) {
      title = 'Expert Parent';
      icon = Trophy;
      gradient = 'from-purple-400 to-pink-500';
    } else if (level >= 10) {
      title = 'Advanced Parent';
      icon = Trophy;
      gradient = 'from-blue-400 to-cyan-500';
    } else if (level >= 5) {
      title = 'Skilled Parent';
      icon = Star;
      gradient = 'from-green-400 to-emerald-500';
    }

    return { level, progress, title, icon, gradient, points };
  }, [completedDays, scriptsUsed]);

  const Icon = levelData.icon;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className={`w-16 h-16 rounded-full bg-gradient-to-br ${levelData.gradient} flex items-center justify-center shadow-lg`}
        >
          <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center">
            <span className="text-2xl font-black text-foreground">{levelData.level}</span>
          </div>
        </motion.div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge className={`bg-gradient-to-r ${levelData.gradient} text-white`}>
              <Icon className="w-3 h-3 mr-1" />
              Level {levelData.level}
            </Badge>
          </div>
          <p className="font-bold text-lg text-foreground">{levelData.title}</p>
          <p className="text-xs text-muted-foreground">
            {Math.round(levelData.progress)}% to Level {levelData.level + 1}
          </p>
        </div>
      </div>

      {/* Progress to next level */}
      <div className="space-y-1">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelData.progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full bg-gradient-to-r ${levelData.gradient}`}
          />
        </div>
      </div>
    </div>
  );
}
