import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Clock, Headphones } from 'lucide-react';
import { ProgramLesson } from '@/hooks/useProgramDetail';
import { useFavoriteLessons } from '@/hooks/useFavoriteLessons';

interface NextLessonCardProps {
  lesson: ProgramLesson;
  programSlug: string;
  programId: string;
  isFirstLesson?: boolean;
  totalLessons: number;
}

export function NextLessonCard({ lesson, programSlug, programId, isFirstLesson = false, totalLessons }: NextLessonCardProps) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavoriteLessons(programId);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Check if summary is long enough to need truncation (more than ~150 characters)
  const needsTruncation = (lesson.summary?.length || 0) > 150;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(255, 165, 0, 0.15)" }}
      className="w-full flex flex-col bg-white rounded-[10px] border border-[#F7F2F0] py-4 px-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/programs/${programSlug}/lesson/${lesson.day_number}`)}
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
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            if (lesson.id) {
              toggleFavorite.mutate({ lessonId: lesson.id, programId });
            }
          }}
          disabled={toggleFavorite.isPending}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-[34px] h-[34px] absolute right-3 top-3 z-[1] bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all disabled:opacity-50"
        >
          <Heart
            className={`w-4 h-4 transition-all ${isFavorite(lesson.id) ? 'text-red-500 fill-red-500 scale-110' : 'text-[#393939]'}`}
          />
        </motion.button>
      </div>

      {/* Summary */}
      {lesson.summary && (
        <div className="mb-4">
          <p className={`text-base text-[#393939] font-medium leading-relaxed ${!isDescriptionExpanded && needsTruncation ? 'line-clamp-3' : ''}`}>
            {lesson.summary}
          </p>
          {needsTruncation && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDescriptionExpanded(!isDescriptionExpanded);
              }}
              className="text-sm text-[#FFA500] font-semibold mt-1 hover:underline focus:outline-none focus:ring-2 focus:ring-[#FFA500] focus:ring-offset-2 rounded"
              aria-expanded={isDescriptionExpanded}
            >
              {isDescriptionExpanded ? 'Show less' : 'Learn more'}
            </button>
          )}
        </div>
      )}

      {/* Start Button */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/programs/${programSlug}/lesson/${lesson.day_number}`);
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 bg-gradient-to-r from-[#FFA500] to-[#FFB84D] text-white rounded-[29px] font-semibold text-lg shadow-md hover:shadow-lg hover:shadow-orange-500/40 transition-all"
      >
        {isFirstLesson ? 'Start Lesson' : 'Continue Lesson'}
      </motion.button>
    </motion.div>
  );
}
