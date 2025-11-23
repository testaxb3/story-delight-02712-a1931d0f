import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
        bg-[#1C1C1E] border border-[#333] rounded-2xl p-5
        ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
        transition-all duration-200
        hover:border-[#444] hover:shadow-lg
      `}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 blur-xl`} />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <motion.div 
            className="text-3xl font-bold text-white mb-1"
            key={displayValue}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {displayValue}
          </motion.div>
          <div className="text-sm text-gray-400 font-medium">{label}</div>
        </div>
        
        <div className="w-12 h-12 rounded-xl bg-[#2C2C2E] flex items-center justify-center">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
