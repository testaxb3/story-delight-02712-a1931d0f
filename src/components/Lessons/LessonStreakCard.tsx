import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface LessonStreakCardProps {
  streak: number;
}

export function LessonStreakCard({ streak }: LessonStreakCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20"
    >
      {/* Flame Icon */}
      <div className="relative">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30"
        >
          <Flame className="w-6 h-6 text-white fill-white" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground">{streak}</span>
          <span className="text-lg font-medium text-muted-foreground">day streak!</span>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          Keep learning daily to maintain your streak
        </p>
      </div>
    </motion.div>
  );
}
