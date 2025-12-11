import { Flame, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProgramsStreakCardProps {
  lessonsCompletedCount: number;
  weekProgress?: boolean[]; // 7 days, true = completed
}

export function ProgramsStreakCard({ lessonsCompletedCount, weekProgress = [] }: ProgramsStreakCardProps) {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date().getDay(); // 0 = Sunday
  
  // Pad weekProgress to 7 days
  const progress = [...weekProgress, ...Array(7 - weekProgress.length).fill(false)].slice(0, 7);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#FFFFFF] rounded-[10px] border border-[#F7F2F0] py-[12px] px-[10px] space-y-[16px]"
    >
      {/* Header */}
      <div className="flex justify-center items-center gap-[5px] text-[16px] font-[400] text-[#393939]">
        <Flame className="w-[17px] h-[17px] text-[#FF5C16] fill-current" />
        <span>My streak is</span>
        <span className="font-[800] text-[#FF5C16]">{lessonsCompletedCount}</span>
        <span>{lessonsCompletedCount === 1 ? 'day' : 'days'}</span>
      </div>

      <div className="border-t border-[#F7F2F0]"></div>

      {/* Week Progress */}
      <div className="grid grid-cols-7 justify-between items-center">
        {days.map((day, index) => {
          const isToday = index === today;
          const isCompleted = progress[index];
          const isPast = index < today;

          return (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-[18px] h-[18px] rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-[#FF5C16] text-white'
                    : isToday
                    ? 'border border-[#FF5C16] bg-transparent text-[#FF5C16]'
                    : 'border border-[#D1D1D5] bg-transparent text-[#D1D1D5]'
                }`}
              >
                {isCompleted && <Check className="w-3 h-3" strokeWidth={3} />}
              </div>
              <div className="text-center font-[500] text-[11px] leading-[100%] pt-[5px] text-[#393939]">
                {day}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
