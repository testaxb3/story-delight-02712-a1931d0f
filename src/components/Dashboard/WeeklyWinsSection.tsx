import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { WeeklyWin } from '@/hooks/useDashboardStats';

interface WeeklyWinsSectionProps {
  wins: WeeklyWin[];
}

export function WeeklyWinsSection({ wins }: WeeklyWinsSectionProps) {
  if (!wins || wins.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-6 mb-6"
      >
        <div className="bg-card border border-dashed border-border rounded-3xl p-8 text-center">
          <div className="text-4xl mb-3">🏆</div>
          <h3 className="text-lg font-bold mb-2">No Wins Yet This Week</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Complete tracker entries to unlock weekly achievements
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="px-6 mb-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#FFFBEB] dark:bg-yellow-500/10 rounded-xl">
          <Trophy className="w-5 h-5 text-yellow-500" />
        </div>
        <h2 className="text-xl font-bold text-[#1A1A1A] dark:text-white">This Week's Wins</h2>
      </div>

      <div className="space-y-3">
        {wins.map((win, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + (index * 0.1) }}
            className="bg-white dark:bg-[#1C1C1E] border border-[#E5E7EB] dark:border-[#333] rounded-2xl p-4 flex items-center gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-none hover:bg-[#F9FAFB] dark:hover:bg-[#2C2C2E] transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-[#F3F4F6] dark:bg-[#2C2C2E] flex items-center justify-center text-2xl">
              {win.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-[#1A1A1A] dark:text-white font-bold text-sm">{win.title}</h3>
              <p className="text-[#6B7280] dark:text-gray-400 text-xs">{win.metric}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
