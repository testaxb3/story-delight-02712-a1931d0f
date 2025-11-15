import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedMetricCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  gradient: string;
  delay?: number;
  onClick?: () => void;
  subtitle?: string;
}

export const AnimatedMetricCard = ({
  icon: Icon,
  value,
  label,
  gradient,
  delay = 0,
  onClick,
  subtitle
}: AnimatedMetricCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "card-elevated p-4 rounded-xl cursor-pointer group relative overflow-hidden",
        onClick && "hover:shadow-glow"
      )}
      onClick={onClick}
    >
      {/* Animated gradient background on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle at center, hsl(var(--primary)) 0%, transparent 70%)'
        }}
      />

      <div className="flex items-center gap-3 relative z-10">
        {/* Animated Icon */}
        <motion.div
          className={`p-2 rounded-lg ${gradient}`}
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="w-5 h-5 text-white" />
        </motion.div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            className="text-2xl font-black"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring" }}
          >
            {value}
          </motion.div>
          <div className="text-xs text-muted-foreground">{label}</div>
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: delay + 0.3 }}
              className="text-xs text-primary mt-1"
            >
              {subtitle}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
