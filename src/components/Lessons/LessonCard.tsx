import { LessonWithProgress } from '@/hooks/useLessons';
import { Lock, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface LessonCardProps {
  lesson: LessonWithProgress;
  onClick: () => void;
}

export function LessonCard({ lesson, onClick }: LessonCardProps) {
  const isCompleted = lesson.progress?.completed;
  const isLocked = lesson.isLocked;

  return (
    <motion.div
      whileTap={!isLocked ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-4 p-4 rounded-2xl border transition-all",
        isLocked 
          ? "bg-muted/30 border-border/30 cursor-not-allowed opacity-60"
          : isCompleted
            ? "bg-emerald-500/5 border-emerald-500/20 cursor-pointer hover:bg-emerald-500/10"
            : "bg-card border-border/60 cursor-pointer hover:bg-accent/5 hover:border-primary/30"
      )}
    >
      {/* Day Number Circle */}
      <div className={cn(
        "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg",
        isLocked
          ? "bg-muted text-muted-foreground"
          : isCompleted
            ? "bg-emerald-500 text-white"
            : "bg-primary/10 text-primary"
      )}>
        {isCompleted ? (
          <CheckCircle2 className="w-6 h-6" />
        ) : isLocked ? (
          <Lock className="w-5 h-5" />
        ) : (
          lesson.day_number
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className={cn(
          "font-semibold text-[15px] truncate",
          isLocked ? "text-muted-foreground" : "text-foreground"
        )}>
          {lesson.title}
        </h4>
        <div className="flex items-center gap-3 mt-1">
          <span className={cn(
            "text-xs",
            isLocked ? "text-muted-foreground/60" : "text-muted-foreground"
          )}>
            Day {lesson.day_number}
          </span>
          {lesson.estimated_minutes && (
            <span className={cn(
              "flex items-center gap-1 text-xs",
              isLocked ? "text-muted-foreground/60" : "text-muted-foreground"
            )}>
              <Clock className="w-3 h-3" />
              {lesson.estimated_minutes} min
            </span>
          )}
        </div>
      </div>

      {/* Arrow */}
      {!isLocked && (
        <ChevronRight className={cn(
          "w-5 h-5 flex-shrink-0",
          isCompleted ? "text-emerald-500" : "text-muted-foreground"
        )} />
      )}
    </motion.div>
  );
}
