import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Clock, Headphones } from 'lucide-react';
import { ProgramLesson } from '@/hooks/useProgramDetail';

interface NextLessonCardProps {
  lesson: ProgramLesson;
  programSlug: string;
  isFirstLesson?: boolean;
  totalLessons: number;
}

export function NextLessonCard({ lesson, programSlug, isFirstLesson = false, totalLessons }: NextLessonCardProps) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full flex flex-col bg-white rounded-[10px] border border-[#F7F2F0] py-3.5 px-2.5"
    >
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-2.5 border-b border-[#DADADA] pb-2">
        <p className="font-normal text-sm text-[#393939]">Next lesson</p>
        <div className="flex items-center gap-3">
          {lesson.estimated_minutes && (
            <span className="flex items-center gap-1 text-xs text-[#8D8D8D]">
              <Clock className="w-3 h-3" />
              {lesson.estimated_minutes} min
            </span>
          )}
          {lesson.audio_url && (
            <Headphones className="w-3.5 h-3.5 text-[#8D8D8D]" />
          )}
          <p className="font-normal text-sm text-[#393939]">
            <span className="text-[#76B9FF] font-semibold">{lesson.day_number}</span> out of {totalLessons}
          </p>
        </div>
      </div>

      {/* Lesson Title */}
      <p className="py-2 text-xl text-[#393939]">
        Lesson {lesson.day_number}: <span className="font-extrabold">{lesson.title}</span>
      </p>

      {/* Image Container */}
      <div className="relative mb-3">
        {lesson.image_url ? (
          <img
            alt="lesson thumbnail"
            loading="lazy"
            className="w-full h-[200px] rounded-[10px] object-cover"
            src={lesson.image_url}
          />
        ) : (
          <div className="w-full h-[200px] rounded-[10px] bg-gradient-to-br from-amber-50 to-orange-100" />
        )}
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="w-[32px] h-[32px] absolute right-3 top-3 z-[1] bg-white/80 rounded-full flex items-center justify-center cursor-pointer hover:bg-white transition-colors"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${isFavorite ? 'text-red-500 fill-red-500' : 'text-[#393939]'}`} 
          />
        </button>
      </div>

      {/* Summary */}
      {lesson.summary && (
        <p className="line-clamp-3 text-base text-[#393939] font-medium leading-[20.8px] mb-4">
          {lesson.summary}
        </p>
      )}

      {/* Start Button */}
      <button
        onClick={() => navigate(`/programs/${programSlug}/lesson/${lesson.day_number}`)}
        className="w-full py-4 bg-[#FFA500] text-white rounded-[29px] font-semibold text-lg hover:bg-[#e69500] transition-colors"
      >
        {isFirstLesson ? 'Start Lesson' : 'Continue Lesson'}
      </button>
    </motion.div>
  );
}
