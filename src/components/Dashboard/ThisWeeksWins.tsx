import { TrendingUp } from 'lucide-react';
import { GradientText } from '@/components/common/GradientText';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import type { WeeklyWin } from '@/hooks/useDashboardStats';

interface ThisWeeksWinsProps {
  wins: WeeklyWin[];
  loading?: boolean;
}

export const ThisWeeksWins = ({ wins, loading = false }: ThisWeeksWinsProps) => {

  if (loading) {
    return (
      <div className="card-elevated p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-success" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  if (wins.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="card-elevated p-6 rounded-2xl"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-success" />
        <GradientText as="h3" className="text-xl">
          This Week's Wins
        </GradientText>
      </div>

      {/* Wins Grid */}
      <div className="space-y-3">
        {wins.map((win, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-muted/30 to-transparent border border-border/50 hover-lift cursor-pointer"
          >
            {/* Icon */}
            <motion.div
              className="text-3xl"
              animate={{
                rotate: [0, -10, 10, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.3
              }}
            >
              {win.icon}
            </motion.div>

            {/* Content */}
            <div className="flex-1">
              <h4 className="font-bold text-foreground">
                {win.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {win.metric}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
