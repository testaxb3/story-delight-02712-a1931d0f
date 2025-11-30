import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { itemVariants } from './animations';

interface InsightCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  color: string;
  delay?: number;
  onPress: () => void;
}

export const InsightCard = memo(function InsightCard({
  icon,
  label,
  value,
  trend,
  color,
  delay = 0,
  onPress,
}: InsightCardProps) {
  return (
    <motion.button
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onPress}
      className="relative flex-1 p-4 rounded-panel overflow-hidden text-left"
    >
      {/* Glass background */}
      <div className="absolute inset-0 bg-card/50 backdrop-blur-xl" />
      <div className="absolute inset-0 rounded-panel border border-border" />

      {/* Colored accent glow */}
      <div
        className={cn("absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-30", color)}
      />

      <div className="relative z-10">
        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-3", color.replace('bg-', 'bg-') + '/20')}>
          {icon}
        </div>

        <p className="text-2xl font-bold text-foreground mb-0.5">{value}</p>
        <p className="text-xs text-muted-foreground font-medium">{label}</p>

        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <div className="w-1 h-1 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-emerald-400 font-medium">{trend}</span>
          </div>
        )}
      </div>
    </motion.button>
  );
});
