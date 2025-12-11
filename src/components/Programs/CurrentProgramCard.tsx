import { motion } from 'framer-motion';
import { ChevronRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProgramWithProgress } from '@/hooks/usePrograms';

interface CurrentProgramCardProps {
  program: ProgramWithProgress;
}

export function CurrentProgramCard({ program }: CurrentProgramCardProps) {
  const navigate = useNavigate();
  const nextLesson = program.lessons_completed.length + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background border border-primary/20 p-4"
      onClick={() => navigate(`/programs/${program.slug}`)}
    >
      {/* Gradient Background Placeholder */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-rose-400 to-purple-500" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                In Progress
              </span>
              <span className="text-xs text-muted-foreground">{program.age_range}</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground line-clamp-1">
              {program.title}
            </h3>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>{program.lessons_completed.length} of {program.total_lessons} lessons</span>
            <span>{program.progress_percentage}%</span>
          </div>
          <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${program.progress_percentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
            />
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex items-center gap-3 p-3 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Continue Lesson {nextLesson}</p>
            <p className="text-xs text-muted-foreground">Pick up where you left off</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </motion.div>
  );
}
