import { motion } from 'framer-motion';
import { ActivityRing } from './ActivityRing';

interface StepTimerProps {
  timeRemaining: number;
  totalTime: number;
}

export const StepTimer = ({ timeRemaining, totalTime }: StepTimerProps) => {
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isUrgent = timeRemaining <= 10;

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Activity Ring */}
      <ActivityRing 
        progress={progress} 
        size={256}
        strokeWidth={16}
        color={isUrgent ? 'hsl(0 84% 60%)' : 'hsl(var(--primary))'}
      />

      {/* Time display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          className="text-center"
          animate={isUrgent ? {
            scale: [1, 1.05, 1],
          } : {}}
          transition={{
            duration: 1,
            repeat: isUrgent ? Infinity : 0,
          }}
        >
          <motion.div 
            className={`text-6xl font-bold tabular-nums ${
              isUrgent ? 'text-red-500' : 'text-foreground'
            }`}
            key={`${minutes}:${seconds}`}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {minutes}:{seconds.toString().padStart(2, '0')}
          </motion.div>
          <div className="text-sm text-muted-foreground mt-2">remaining</div>
        </motion.div>
      </div>

      {/* Pulse effect when urgent */}
      {isUrgent && (
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-red-500"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        />
      )}
    </div>
  );
};
