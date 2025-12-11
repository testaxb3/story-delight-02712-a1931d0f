import { motion } from 'framer-motion';
import { CheckCircle2, Lock, Circle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProgramLesson } from '@/hooks/useProgramDetail';

interface LessonListItemProps {
  lesson: ProgramLesson;
  programSlug: string;
  status: 'completed' | 'available' | 'locked';
  index: number;
}

export function LessonListItem({ lesson, programSlug, status, index }: LessonListItemProps) {
  const navigate = useNavigate();
  const isClickable = status !== 'locked';

  const handleClick = () => {
    if (isClickable) {
      navigate(`/programs/${programSlug}/lesson-${lesson.day_number}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.03 }}
      whileTap={isClickable ? { scale: 0.98 } : undefined}
      className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
        isClickable 
          ? 'cursor-pointer hover:bg-muted/50 active:bg-muted' 
          : 'opacity-50 cursor-not-allowed'
      }`}
      onClick={handleClick}
    >
      {/* Status Icon */}
      <div className="flex-shrink-0">
        {status === 'completed' ? (
          <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
        ) : status === 'locked' ? (
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <Lock className="w-4 h-4 text-muted-foreground" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Circle className="w-5 h-5 text-primary" />
          </div>
        )}
      </div>

      {/* Lesson Number */}
      <span className="text-sm text-muted-foreground w-6">
        {lesson.day_number}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-medium truncate ${
          status === 'locked' ? 'text-muted-foreground' : 'text-foreground'
        }`}>
          {lesson.title}
        </h4>
        {lesson.estimated_minutes && (
          <p className="text-xs text-muted-foreground">
            ~{lesson.estimated_minutes} min
          </p>
        )}
      </div>

      {/* Arrow */}
      {isClickable && (
        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      )}
    </motion.div>
  );
}
