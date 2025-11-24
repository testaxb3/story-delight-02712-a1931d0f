import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AnimatedStatsCardProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  gradient?: string;
  delay?: number;
  onClick?: () => void;
}

export function AnimatedStatsCard({ 
  value, 
  label, 
  icon, 
  gradient = "from-purple-500/10 to-blue-500/10",
  delay = 0,
  onClick 
}: AnimatedStatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay: delay,
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
            className="text-3xl font-bold text-[#1A1A1A] dark:text-white mb-1"
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