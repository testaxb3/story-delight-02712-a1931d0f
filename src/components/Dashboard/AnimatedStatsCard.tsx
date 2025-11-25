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
        bg-white dark:bg-[#1C1C1E] border border-[#E5E7EB] dark:border-[#333] rounded-2xl p-5
        ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
        transition-all duration-200
        hover:border-[#D1D5DB] dark:hover:border-[#444] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-none
      `}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-30 dark:opacity-50 blur-xl`} />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <motion.div
            className="text-3xl font-bold text-[#1A1A1A] dark:text-white mb-1 tabular-nums"
            key={displayValue}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {displayValue}
          </motion.div>
          <div className="text-sm text-[#6B7280] dark:text-gray-400 font-medium">{label}</div>
        </div>

        <div className="w-12 h-12 rounded-xl bg-[#F3F4F6] dark:bg-[#2C2C2E] flex items-center justify-center">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
