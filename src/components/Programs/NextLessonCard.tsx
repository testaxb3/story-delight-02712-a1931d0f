import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Clock, Headphones, Play, Sparkles, BookOpen } from 'lucide-react';
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
      className="relative"
    >
      {/* Glow effect behind card */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF6631]/10 to-[#FFA300]/10 rounded-[20px] blur-xl" />

      {/* Main card */}
      <motion.div
        whileHover={{ y: -4 }}
        className="relative w-full flex flex-col bg-white dark:bg-card rounded-[20px] border border-border shadow-lg shadow-orange-500/5 overflow-hidden cursor-pointer"
        onClick={() => navigate(`/programs/${programSlug}/lesson/${lesson.day_number}`)}
      >
        {/* Header accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#FF6631] via-[#FFA300] to-[#FFB84D]" />

        {/* Header */}
        <div className="flex flex-row items-center justify-between gap-2.5 px-5 pt-4 pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-[#FF6631] to-[#FFA300]">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm text-foreground">Next Lesson</span>
          </div>

          <div className="flex items-center gap-3">
            {lesson.estimated_minutes && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                <Clock className="w-3 h-3" />
                {lesson.estimated_minutes} min
              </span>
            )}
            {lesson.audio_url && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                <Headphones className="w-3 h-3" />
                Audio
              </span>
            )}
            <span className="font-medium text-sm text-muted-foreground">
              <span className="text-[#FF6631] font-bold">{lesson.day_number}</span>/{totalLessons}
            </span>
          </div>
        </div>

        {/* Lesson Title */}
        <div className="px-5 py-3">
          <h3 className="text-xl text-foreground leading-tight">
            <span className="text-[#FF6631] font-semibold">Lesson {lesson.day_number}:</span>{' '}
            <span className="font-extrabold">{lesson.title}</span>
          </h3>
        </div>

        {/* Image Container */}
        <div className="relative mx-4 mb-4">
          <div className="rounded-[16px] overflow-hidden shadow-md">
            {lesson.image_url ? (
              <img
                alt="lesson thumbnail"
                loading="lazy"
                className="w-full h-[200px] object-cover transition-transform duration-500 hover:scale-105"
                src={lesson.image_url}
              />
            ) : (
              <div className="w-full h-[200px] bg-gradient-to-br from-[#FF6631]/20 via-[#FFA300]/20 to-[#FFB84D]/10 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <BookOpen className="w-16 h-16 text-[#FF6631]/40" />
                </motion.div>
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-[16px]" />
          </div>

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
            className="absolute right-3 top-3 z-[1] w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all disabled:opacity-50"
          >
            <Heart
              className={`w-5 h-5 transition-all ${isFavorite(lesson.id) ? 'text-red-500 fill-red-500' : 'text-foreground'}`}
            />
          </motion.button>

          {/* Play indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute left-3 bottom-3 flex items-center gap-2 bg-white/95 dark:bg-card/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Play className="w-3.5 h-3.5 text-[#FF6631] fill-[#FF6631]" />
            </motion.div>
            <span className="text-xs font-semibold text-foreground">Ready to play</span>
          </motion.div>
        </div>

        {/* Summary */}
        {lesson.summary && (
          <div className="px-5 mb-4">
            <p className={`text-[15px] text-[#666] font-normal leading-relaxed ${!isDescriptionExpanded && needsTruncation ? 'line-clamp-2' : ''}`}>
              {lesson.summary}
            </p>
            {needsTruncation && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDescriptionExpanded(!isDescriptionExpanded);
                }}
                className="text-sm text-[#FF6631] font-semibold mt-1 hover:underline focus:outline-none"
                aria-expanded={isDescriptionExpanded}
              >
                {isDescriptionExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        )}

        {/* Start Button */}
        <div className="px-4 pb-5">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/programs/${programSlug}/lesson/${lesson.day_number}`);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full py-4 bg-gradient-to-r from-[#FF6631] to-[#FFA300] text-white rounded-full font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all overflow-hidden flex items-center justify-center gap-2"
          >
            {/* Shine effect */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
            />

            <Play className="w-5 h-5 fill-white" />
            <span>{isFirstLesson ? 'Start Lesson' : 'Continue Lesson'}</span>
            <Sparkles className="w-4 h-4 opacity-80" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
