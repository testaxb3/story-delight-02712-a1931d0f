import { motion } from 'framer-motion';

interface StepTimerProps {
  timeRemaining: number;
  totalTime: number;
}

export const StepTimer = ({ timeRemaining, totalTime }: StepTimerProps) => {
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Background circle */}
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="96"
          cy="96"
          r="88"
          className="fill-none stroke-border"
          strokeWidth="8"
        />
        <motion.circle
          cx="96"
          cy="96"
          r="88"
          className="fill-none stroke-foreground"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 88}`}
          strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
          initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
          animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - progress / 100) }}
          transition={{ duration: 0.5 }}
        />
      </svg>

      {/* Time display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl font-bold text-foreground tabular-nums">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-muted-foreground mt-1">remaining</div>
        </div>
      </div>
    </div>
  );
};
