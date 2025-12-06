import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Headphones, Clock, Flame, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ListenHeaderProps {
  totalMinutes?: number;
  seriesCount?: number;
  completedSeries?: number;
  currentStreak?: number;
}

export const ListenHeader = memo(function ListenHeader({
  totalMinutes = 0,
  seriesCount = 0,
  completedSeries = 0,
  currentStreak = 0,
}: ListenHeaderProps) {
  // Get time-based greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Format listening time
  const formattedTime = useMemo(() => {
    if (totalMinutes < 60) return `${totalMinutes}m`;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }, [totalMinutes]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Main Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            className="relative"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
              <Headphones className="w-6 h-6 text-primary-foreground" />
            </div>
            {/* Listening indicator */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-background"
            />
          </motion.div>
          <div>
            <p className="text-xs text-muted-foreground">{greeting}</p>
            <h1 className="text-xl font-bold text-foreground">Listen</h1>
          </div>
        </div>

        {/* Streak badge */}
        {currentStreak > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30"
          >
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="text-sm font-bold text-foreground">{currentStreak}</span>
          </motion.div>
        )}
      </div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-3 gap-2"
      >
        {/* Time Listened */}
        <div className="relative p-3 rounded-xl bg-card/50 border border-border/50 overflow-hidden">
          <div className="absolute top-0 right-0 w-12 h-12 bg-primary/5 rounded-full blur-xl" />
          <div className="relative">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium uppercase tracking-wide">Listened</span>
            </div>
            <p className="text-lg font-bold text-foreground">{formattedTime}</p>
          </div>
        </div>

        {/* Series Available */}
        <div className="relative p-3 rounded-xl bg-card/50 border border-border/50 overflow-hidden">
          <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-500/5 rounded-full blur-xl" />
          <div className="relative">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <Headphones className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium uppercase tracking-wide">Series</span>
            </div>
            <p className="text-lg font-bold text-foreground">{seriesCount}</p>
          </div>
        </div>

        {/* Completed */}
        <div className="relative p-3 rounded-xl bg-card/50 border border-border/50 overflow-hidden">
          <div className="absolute top-0 right-0 w-12 h-12 bg-green-500/5 rounded-full blur-xl" />
          <div className="relative">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <Trophy className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium uppercase tracking-wide">Done</span>
            </div>
            <p className="text-lg font-bold text-foreground">{completedSeries}</p>
          </div>
        </div>
      </motion.div>

      {/* Subtitle */}
      <p className="text-sm text-muted-foreground">
        Audio guides for mindful parenting moments
      </p>
    </motion.div>
  );
});
