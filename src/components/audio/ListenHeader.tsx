import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Headphones, Clock, Flame, Trophy, Sparkles, Music2 } from 'lucide-react';

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
      className="space-y-5"
    >
      {/* Main Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            className="relative"
          >
            {/* Icon with glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF6631] to-[#FFA300] rounded-[16px] blur-lg opacity-40" />
            <div className="relative w-14 h-14 rounded-[16px] bg-gradient-to-br from-[#FF6631] to-[#FFA300] flex items-center justify-center shadow-xl shadow-orange-500/30">
              <Headphones className="w-7 h-7 text-white" />
            </div>

            {/* Animated listening indicator */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-white shadow-md flex items-center justify-center"
            >
              <Music2 className="w-2 h-2 text-white" />
            </motion.div>
          </motion.div>

          <div>
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-muted-foreground"
            >
              {greeting} ✨
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="text-2xl font-bold text-foreground"
            >
              Listen
            </motion.h1>
          </div>
        </div>

        {/* Streak badge */}
        {currentStreak > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF6631]/15 to-[#FFA300]/15 border border-[#FF6631]/30 shadow-sm"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame className="w-5 h-5 text-[#FF6631] fill-[#FF6631]" />
            </motion.div>
            <span className="text-base font-bold text-[#FF6631]">{currentStreak}</span>
          </motion.div>
        )}
      </div>

      {/* Stats Cards Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-3 gap-3"
      >
        {/* Time Listened */}
        <motion.div
          whileHover={{ y: -2 }}
          className="relative p-4 rounded-[16px] bg-white dark:bg-card border border-border shadow-sm overflow-hidden group"
        >
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#FF6631]/10 to-[#FFA300]/10 rounded-full blur-xl translate-x-4 -translate-y-4" />

          <div className="relative">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#FF6631]/10 to-[#FFA300]/10 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-[#FF6631]" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider">Listened</span>
            </div>
            <p className="text-xl font-bold text-foreground">{formattedTime}</p>
          </div>
        </motion.div>

        {/* Series Available */}
        <motion.div
          whileHover={{ y: -2 }}
          className="relative p-4 rounded-[16px] bg-white dark:bg-card border border-border shadow-sm overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-xl translate-x-4 -translate-y-4" />

          <div className="relative">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                <Headphones className="w-3.5 h-3.5 text-indigo-500" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider">Series</span>
            </div>
            <p className="text-xl font-bold text-foreground">{seriesCount}</p>
          </div>
        </motion.div>

        {/* Completed */}
        <motion.div
          whileHover={{ y: -2 }}
          className="relative p-4 rounded-[16px] bg-white dark:bg-card border border-border shadow-sm overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-xl translate-x-4 -translate-y-4" />

          <div className="relative">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center">
                <Trophy className="w-3.5 h-3.5 text-green-500" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider">Done</span>
            </div>
            <p className="text-xl font-bold text-foreground">{completedSeries}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Subtitle with sparkle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4 text-[#FFA300]" />
        <p className="text-sm text-muted-foreground">
          Audio guides for mindful parenting moments
        </p>
      </motion.div>
    </motion.div>
  );
});
