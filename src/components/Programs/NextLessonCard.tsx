import { motion } from 'framer-motion';
import { Play, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProgramLesson } from '@/hooks/useProgramDetail';

interface NextLessonCardProps {
  lesson: ProgramLesson;
  programSlug: string;
  isFirstLesson?: boolean;
}

export function NextLessonCard({ lesson, programSlug, isFirstLesson = false }: NextLessonCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mx-4 p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
          {isFirstLesson ? 'Start Here' : 'Continue'}
        </span>
        <span className="text-xs text-muted-foreground">
          Lesson {lesson.day_number}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-1">
        {lesson.title}
      </h3>
      
      {lesson.summary && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {lesson.summary}
        </p>
      )}

      <div className="flex items-center justify-between">
        {lesson.estimated_minutes && (
          <span className="text-xs text-muted-foreground">
            ~{lesson.estimated_minutes} min
          </span>
        )}
        
        <Button
          onClick={() => navigate(`/programs/${programSlug}/lesson-${lesson.day_number}`)}
          className="gap-2"
        >
          <Play className="w-4 h-4" />
          {isFirstLesson ? 'Start Lesson' : 'Continue'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
