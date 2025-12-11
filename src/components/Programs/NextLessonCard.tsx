import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
        <p className="font-normal text-sm text-[#393939]">
          <span className="text-[#76B9FF] font-semibold">{lesson.day_number}</span> out of{' '}
          <span className="text-[#76B9FF] font-semibold">{totalLessons}</span>
        </p>
      </div>

      {/* Lesson Title */}
      <p className="py-2 text-xl text-[#393939]">
        Lesson {lesson.day_number}: <span className="font-extrabold">{lesson.title}</span>
      </p>

      {/* Image Container */}
      <div className="relative">
        {lesson.image_url && (
          <div className="relative">
            <img
              alt="lesson thumbnail"
              loading="lazy"
              width={314}
              height={160}
              className="w-full mb-3 max-[380px]:max-h-[160px] rounded-[10px] object-cover"
              src={lesson.image_url}
            />
          </div>
        )}
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="w-[29px] h-[29px] absolute right-3 top-3 z-[1] bg-contain bg-no-repeat cursor-pointer transition-[background-image] duration-300"
          style={{
            backgroundImage: `url('/icons/challenges/${isFavorite ? 'favorite-active' : 'favorite-inactive'}.svg')`
          }}
        />
      </div>

      {/* Summary */}
      {lesson.summary && (
        <p className="line-clamp-5 text-base text-[#393939] font-medium leading-[20.8px] mb-4 font-['Raleway']">
          {lesson.summary}
        </p>
      )}

      {/* Start Button */}
      <button
        onClick={() => navigate(`/programs/${programSlug}/lesson/${lesson.day_number}`)}
        className="w-full py-4 bg-[#FF6631] text-white rounded-[10px] font-semibold text-lg hover:bg-[#e55a2a] transition-colors"
      >
        {isFirstLesson ? 'Start' : 'Continue'}
      </button>
    </motion.div>
  );
}
