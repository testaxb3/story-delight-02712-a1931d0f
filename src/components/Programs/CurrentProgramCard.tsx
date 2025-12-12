import { motion } from 'framer-motion';
import { Heart, Play, BookOpen, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProgramWithProgress } from '@/hooks/usePrograms';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface CurrentProgramCardProps {
  program: ProgramWithProgress;
}

export function CurrentProgramCard({ program }: CurrentProgramCardProps) {
  const navigate = useNavigate();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const nextLessonNumber = program.lessons_completed.length + 1;
  const nextLesson = program.nextLesson;

  const imageUrl = nextLesson?.image_url || program.cover_image_url;
  const lessonTitle = nextLesson?.title || 'Continue Learning';
  const lessonSummary = nextLesson?.summary || program.description || 'Continue your parenting journey with this program.';

  // Progress percentage
  const progressPercentage = Math.round((program.lessons_completed.length / program.total_lessons) * 100);

  // Check if summary is long enough to need truncation (more than ~150 characters)
  const needsTruncation = lessonSummary.length > 150;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="relative w-full overflow-hidden"
    >
      {/* Outer glow effect */}
      <div className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-[#FF6631]/20 to-[#FFA300]/20 blur-xl" />

      {/* Main card */}
      <div
        className="relative w-full flex flex-col bg-white rounded-[20px] border border-[#FF6631]/20 shadow-lg shadow-[#FF6631]/10 overflow-hidden cursor-pointer"
        onClick={() => navigate(`/programs/${program.slug}`)}
      >
        {/* Gradient accent bar at top */}
        <div className="h-[4px] w-full bg-gradient-to-r from-[#FF6631] via-[#FFA300] to-[#FF6631]" />

        {/* Header with program info */}
        <div className="flex flex-row items-center justify-between gap-[10px] px-[20px] pt-[16px] pb-[12px]">
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center justify-center w-[32px] h-[32px] rounded-full bg-gradient-to-br from-[#FF6631]/10 to-[#FFA300]/10">
              <BookOpen className="w-[16px] h-[16px] text-[#FF6631]" />
            </div>
            <p className="font-[600] text-[16px] text-[#393939] truncate">{program.title}</p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-[8px]">
            <div className="flex flex-col items-end">
              <span className="text-[12px] text-[#8D8D8D]">Progress</span>
              <span className="text-[14px] font-[700] text-[#FF6631]">{progressPercentage}%</span>
            </div>
            {/* Circular progress */}
            <div className="relative w-[40px] h-[40px]">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#F0E6DF"
                  strokeWidth="3"
                />
                <motion.path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="3"
                  strokeDasharray={`${progressPercentage}, 100`}
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${progressPercentage}, 100` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF6631" />
                    <stop offset="100%" stopColor="#FFA300" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-[700] text-[#393939]">
                  {program.lessons_completed.length}/{program.total_lessons}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Title */}
        <div className="px-[20px] pb-[12px]">
          <p className="text-[14px] text-[#8D8D8D] mb-[4px]">Next Lesson</p>
          <p className="text-[22px] text-[#393939] leading-[1.2]">
            <span className="text-[#FF6631] font-[600]">#{nextLessonNumber}</span>{' '}
            <span className="font-[800]">{lessonTitle}</span>
          </p>
        </div>

        {/* Image with overlay */}
        <div className="relative mx-[16px] mb-[16px]">
          <div className="rounded-[16px] w-full h-[180px] overflow-hidden relative">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={lessonTitle}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6631]/20 via-[#FFA300]/20 to-[#FF6631]/10 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <BookOpen className="w-16 h-16 text-[#FF6631]/40" />
                </motion.div>
              </div>
            )}

            {/* Gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />

            {/* Heart Icon */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorited(!isFavorited);
              }}
              className="absolute right-[12px] top-[12px] z-[1] w-[36px] h-[36px] bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all"
            >
              <Heart
                className={`w-[18px] h-[18px] transition-all ${isFavorited ? 'text-red-500 fill-red-500' : 'text-[#393939]'}`}
              />
            </motion.button>

            {/* Play indicator */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute left-[12px] bottom-[12px] flex items-center gap-[8px] bg-white/90 backdrop-blur-sm rounded-full px-[12px] py-[6px] shadow-lg"
            >
              <Play className="w-[14px] h-[14px] text-[#FF6631] fill-[#FF6631]" />
              <span className="text-[12px] font-[600] text-[#393939]">Ready to play</span>
            </motion.div>
          </div>
        </div>

        {/* Description */}
        <div className="px-[20px] mb-[16px]">
          <p className={`text-[15px] text-[#666] font-[400] leading-relaxed ${!isDescriptionExpanded && needsTruncation ? 'line-clamp-2' : ''}`}>
            {lessonSummary}
          </p>
          {needsTruncation && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDescriptionExpanded(!isDescriptionExpanded);
              }}
              className="text-[14px] text-[#FF6631] font-[600] mt-1 hover:underline"
            >
              {isDescriptionExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* CTA Button */}
        <div className="px-[16px] pb-[20px]">
          <Button
            className="relative w-full rounded-full h-[54px] bg-gradient-to-r from-[#FF6631] to-[#FFA300] hover:from-[#FF5520] hover:to-[#FF9500] text-[18px] text-white font-[600] flex items-center justify-center gap-3 shadow-lg shadow-[#FF6631]/30 overflow-hidden group"
            onClick={() => navigate(`/programs/${program.slug}`)}
          >
            {/* Shine effect */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
            />

            <Play className="w-5 h-5 fill-white transition-transform group-hover:scale-110" />
            <span>Continue Learning</span>
            <Sparkles className="w-4 h-4 opacity-70" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
