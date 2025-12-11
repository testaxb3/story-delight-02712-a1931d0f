import { LessonWithProgress } from '@/hooks/useLessons';
import { Play, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CurrentLessonCardProps {
  lesson: LessonWithProgress;
  onClick: () => void;
}

export function CurrentLessonCard({ lesson, onClick }: CurrentLessonCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 cursor-pointer shadow-xl shadow-emerald-500/20"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-[-50%] right-[-20%] w-[60%] h-[200%] bg-white/20 rotate-12 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-4">
        {/* Day Badge */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-white/20 rounded-full text-white/90 text-sm font-medium">
            Day {lesson.day_number}
          </span>
          <span className="text-white/70 text-sm">Continue Learning</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white leading-tight">
          {lesson.title}
        </h3>

        {/* Summary */}
        {lesson.summary && (
          <p className="text-white/80 text-sm line-clamp-2">
            {lesson.summary}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4 text-white/70 text-sm">
            {lesson.estimated_minutes && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {lesson.estimated_minutes} min
              </span>
            )}
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              Lesson
            </span>
          </div>

          <Button 
            size="sm" 
            className="bg-white text-emerald-600 hover:bg-white/90 rounded-full gap-2 font-semibold shadow-lg"
          >
            <Play className="w-4 h-4 fill-current" />
            Start
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
