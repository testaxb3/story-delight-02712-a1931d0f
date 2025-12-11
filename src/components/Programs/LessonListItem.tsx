import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, Headphones, Check } from 'lucide-react';
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
      navigate(`/programs/${programSlug}/lesson/${lesson.day_number}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.015 }}
      className={`flex flex-row items-center justify-between py-3.5 px-4 border-b border-[#F0F0F0] last:border-b-0 ${
        isClickable ? 'cursor-pointer active:bg-gray-50' : 'opacity-50'
      }`}
      onClick={handleClick}
    >
      {/* Lesson Info */}
      <div className="flex-1 min-w-0 pr-3">
        <p className="text-[15px] text-[#393939]">
          <span className="font-normal">Lesson {lesson.day_number}:</span>{' '}
          <span className="font-medium">{lesson.title}</span>
        </p>
        {/* Meta info */}
        <div className="flex items-center gap-3 mt-1">
          {lesson.estimated_minutes && (
            <span className="flex items-center gap-1 text-[11px] text-[#8D8D8D]">
              <Clock className="w-3 h-3" />
              {lesson.estimated_minutes} min
            </span>
          )}
          {lesson.audio_url && (
            <span className="flex items-center gap-1 text-[11px] text-[#8D8D8D]">
              <Headphones className="w-3 h-3" />
              Audio
            </span>
          )}
        </div>
      </div>

      {/* Status Circle - Right side */}
      <div
        className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center ${
          status === 'completed'
            ? 'bg-[#4CAF50]'
            : status === 'available' && index === 0
            ? 'bg-[#FF6631]'
            : 'border-2 border-[#E0E0E0] bg-transparent'
        }`}
      >
        {status === 'completed' && (
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        )}
      </div>
    </motion.div>
  );
}
