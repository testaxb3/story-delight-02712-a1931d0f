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
      className="bg-card rounded-2xl border border-border p-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
          <Flame className="w-4 h-4 text-orange-500" />
        </div>
        <span className="text-base font-semibold text-foreground">
          My streak is {lessonsCompletedCount} {lessonsCompletedCount === 1 ? 'lesson' : 'lessons'}
        </span>
      </div>

      {/* Week Progress */}
      <div className="flex items-center justify-between">
        {days.map((day, index) => {
          const isToday = index === today;
          const isCompleted = progress[index];
          const isPast = index < today;

          return (
            <div key={index} className="flex flex-col items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-medium">{day}</span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-orange-500 text-white'
                    : isToday
                    ? 'ring-2 ring-orange-500 bg-transparent'
                    : isPast
                    ? 'bg-muted'
                    : 'border border-border bg-transparent'
                }`}
              >
                {isCompleted && <Check className="w-4 h-4" strokeWidth={3} />}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
