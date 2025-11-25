import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  streak: number;
  isRisk?: boolean; // If true, show warning that streak is at risk
  size?: 'sm' | 'md' | 'lg';
}

export const StreakBadge = ({ streak, isRisk = false, size = 'md' }: StreakBadgeProps) => {
  const sizeClasses = {
    sm: 'h-10 px-3 text-sm',
    md: 'h-12 px-4 text-base',
    lg: 'h-16 px-6 text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  if (streak === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`
        ${sizeClasses[size]}
        rounded-full 
        flex items-center gap-2
        font-bold
        ${isRisk 
          ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30' 
          : 'bg-gradient-to-br from-orange-500 to-red-500 text-white'
        }
      `}
    >
      <motion.div
        animate={isRisk ? {
          rotate: [0, -10, 10, -10, 0],
        } : {
          rotate: [0, -5, 5, -5, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Flame className={`${iconSizes[size]} fill-current`} />
      </motion.div>
      <span>{streak}</span>
      {isRisk && size !== 'sm' && (
        <span className="text-xs opacity-80">at risk</span>
      )}
    </motion.div>
  );
};
