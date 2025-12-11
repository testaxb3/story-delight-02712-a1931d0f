import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProgramsStreakCardProps {
  programsCompletedCount: number;
}

export function ProgramsStreakCard({ programsCompletedCount }: ProgramsStreakCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#FFFFFF] rounded-[10px] border border-[#F7F2F0] py-[16px] px-[16px]"
    >
      <div className="flex flex-col items-center gap-[4px]">
        <div className="flex items-center gap-[8px] text-[16px] font-[400] text-[#393939]">
          <Trophy className="w-[20px] h-[20px] text-[#FF5C16]" />
          <span>Programs Completed:</span>
          <span className="font-[800] text-[#FF5C16]">{programsCompletedCount}</span>
        </div>
        {programsCompletedCount > 0 && (
          <span className="text-[12px] text-[#8D8D8D]">Great progress! Keep going!</span>
        )}
      </div>
    </motion.div>
  );
}
