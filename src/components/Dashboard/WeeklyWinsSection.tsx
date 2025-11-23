import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { WeeklyWin } from '@/hooks/useDashboardStats';

interface WeeklyWinsSectionProps {
  wins: WeeklyWin[];
}

export function WeeklyWinsSection({ wins }: WeeklyWinsSectionProps) {
  if (!wins || wins.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="px-6 mb-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-yellow-500/10 rounded-xl">
          <Trophy className="w-5 h-5 text-yellow-500" />
        </div>
        <h2 className="text-xl font-bold text-white">This Week's Wins</h2>
      </div>

      <div className="space-y-3">
        {wins.map((win, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + (index * 0.1) }}
            className="bg-[#1C1C1E] border border-[#333] rounded-2xl p-4 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[#2C2C2E] flex items-center justify-center text-2xl">
              {win.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-sm">{win.title}</h3>
              <p className="text-gray-400 text-xs">{win.metric}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
