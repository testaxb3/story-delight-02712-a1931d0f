import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface AnimatedStatsCardProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  gradient?: string;
  delay?: number;
  onClick?: () => void;
}

/**
 * Optimized AnimatedStatsCard using requestAnimationFrame
 * Provides smooth, 60fps animations with Apple-like easing
 */
export function AnimatedStatsCard({ 
  value, 
  label, 
  icon, 
  gradient = "from-purple-500/10 to-blue-500/10",
  delay = 0,
  onClick 
}: AnimatedStatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    // Easing function (easeOutQuart - Apple-like)
    const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

    let startTime: number;
    const duration = 1000; // 1 second animation

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Apply easing
      const eased = easeOutQuart(progress);
      setDisplayValue(Math.floor(eased * value));

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    // Start animation after delay
    const timeoutId = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay: delay / 1000,
        duration: 0.4,
        type: "spring",
        stiffness: 100
      }}
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-card border border-border/20 rounded-2xl p-5
        ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
        transition-all duration-200
        hover:border-border/40 hover:shadow-lg shadow-sm
      `}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 blur-xl`} />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <motion.div
            className="text-3xl font-bold mb-1 tabular-nums"
            key={displayValue}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {displayValue}
          </motion.div>
          <div className="text-sm text-muted-foreground font-medium">{label}</div>
        </div>

        <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
