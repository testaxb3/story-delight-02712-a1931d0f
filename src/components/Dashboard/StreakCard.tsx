import { Flame, Trophy, TrendingUp } from 'lucide-react';
import { GradientText } from '@/components/common/GradientText';
import { motion } from 'framer-motion';

interface StreakCardProps {
  currentStreak: number;
  scriptsUsed: number;
}

export const StreakCard = ({ currentStreak, scriptsUsed }: StreakCardProps) => {
  const isStrong = currentStreak >= 7;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className={`
        card-gradient p-6 rounded-2xl relative overflow-hidden
        ${isStrong ? 'border-2 border-warning/30' : ''}
      `}
    >
      {/* Animated flame particles for strong streaks */}
      {isStrong && (
        <>
          <motion.div
            className="absolute top-4 right-4 text-2xl"
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ✨
          </motion.div>
          <motion.div
            className="absolute bottom-4 right-8 text-xl"
            animate={{
              y: [0, -8, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            🔥
          </motion.div>
        </>
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={isStrong ? {
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0]
              } : {}}
              transition={{
                duration: 2,
                repeat: isStrong ? Infinity : 0,
                ease: "easeInOut"
              }}
              className={`
                p-3 rounded-xl shadow-lg
                ${isStrong ? 'bg-gradient-warning' : 'bg-gradient-to-br from-orange-500 to-red-500'}
              `}
            >
              <Flame className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <div className="text-sm text-muted-foreground font-medium mb-1">
                Day Streak
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200
                }}
              >
                <GradientText className="text-4xl">
                  {currentStreak}
                </GradientText>
              </motion.div>
            </div>
          </div>
          
          {isStrong && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-right"
            >
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Trophy className="w-8 h-8 text-warning mb-1 mx-auto" />
              </motion.div>
              <p className="text-xs text-warning font-bold">
                {currentStreak} days strong!
              </p>
            </motion.div>
          )}
        </div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 text-sm"
        >
          <TrendingUp className="w-4 h-4 text-success" />
          <span className="text-muted-foreground">
            You're becoming a <span className="font-bold text-success">NEP expert!</span>
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};
