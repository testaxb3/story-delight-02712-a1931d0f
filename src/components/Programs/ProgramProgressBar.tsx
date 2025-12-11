import { motion } from 'framer-motion';

interface ProgramProgressBarProps {
  completed: number;
  total: number;
  percentage: number;
}

export function ProgramProgressBar({ completed, total, percentage }: ProgramProgressBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-4"
    >
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-foreground font-medium">
          {completed} of {total} lessons completed
        </span>
        <span className="text-primary font-semibold">{percentage}%</span>
      </div>
      
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          className="h-full bg-gradient-to-r from-primary via-primary to-primary/80 rounded-full relative"
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, delay: 1, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
