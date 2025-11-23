import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface QuizProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  color?: string;
}

export const QuizProgressRing = ({
  progress,
  size = 120,
  strokeWidth = 8,
  showPercentage = true,
  color = 'hsl(var(--primary))',
}: QuizProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const containerSize = useMemo(() => ({
    width: size,
    height: size
  }), [size]);

  return (
    <div className="relative inline-flex items-center justify-center" style={containerSize}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        style={{ filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.3))' }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          opacity={0.2}
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      </svg>

      {/* Percentage text */}
      {showPercentage && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <span 
            className="text-2xl font-black font-relative"
            style={{ color }}
          >
            {Math.round(progress)}%
          </span>
        </motion.div>
      )}
    </div>
  );
};