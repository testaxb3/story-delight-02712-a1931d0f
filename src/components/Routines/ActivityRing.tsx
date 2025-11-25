import { motion } from 'framer-motion';

interface ActivityRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export const ActivityRing = ({ 
  progress, 
  size = 240, 
  strokeWidth = 12,
  color = 'hsl(var(--primary))'
}: ActivityRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background ring */}
      <svg className="absolute inset-0 -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="fill-none stroke-border/30"
          strokeWidth={strokeWidth}
        />
      </svg>

      {/* Progress ring */}
      <svg className="absolute inset-0 -rotate-90">
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="fill-none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ 
            duration: 0.8, 
            ease: [0.4, 0, 0.2, 1]
          }}
        />
      </svg>

      {/* Glow effect */}
      {progress > 0 && (
        <motion.div
          className="absolute inset-0 rounded-full blur-xl opacity-20"
          style={{ 
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          }}
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scale: [0.95, 1.05, 0.95]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  );
};
