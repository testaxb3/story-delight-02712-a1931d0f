import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
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
  const nextLessonNumber = program.lessons_completed.length + 1;
  const nextLesson = program.nextLesson;

  const imageUrl = nextLesson?.image_url || program.cover_image_url;
  const lessonTitle = nextLesson?.title || 'Continue Learning';
  const lessonSummary = nextLesson?.summary || program.description || 'Continue your parenting journey with this program.';

  // Check if summary is long enough to need truncation (more than ~150 characters)
  const needsTruncation = lessonSummary.length > 150;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(255, 102, 49, 0.15)" }}
      transition={{ duration: 0.2 }}
      className="w-full flex flex-col bg-[#FFFFFF] rounded-[10px] border border-[#F7F2F0] py-[14px] px-[16px] shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/programs/${program.slug}`)}
    >
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-[10px] border-b border-b-[#DADADA] pb-[9px]">
        <p className="font-[400] text-[14px] text-[#393939] truncate">{program.title}</p>
        <p className="font-[400] text-[14px] text-[#393939] whitespace-nowrap">
          <span className="text-[#76B9FF] font-[600]">{program.lessons_completed.length}</span> out of <span className="text-[#76B9FF] font-[600]">{program.total_lessons}</span>
        </p>
      </div>

      {/* Lesson Title */}
      <p className="py-[9px] text-[20px] text-[#393939]">
        Lesson {nextLessonNumber}: <span className="font-[800]">{lessonTitle}</span>
      </p>

      {/* Image */}
      <div className="relative mb-[12px]">
        <div className="rounded-[10px] w-full h-[160px] overflow-hidden relative">
           {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={lessonTitle}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-100" />
            )}
           {/* Heart Icon Overlay */}
           <div className="absolute right-[12px] top-[11px] z-[1] w-[29px] h-[29px] bg-white/80 rounded-full flex items-center justify-center cursor-pointer">
              <Heart className="w-[16px] h-[16px] text-[#393939]" />
           </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-[18px]">
        <p className={`text-[16px] text-[#393939] font-[500] leading-relaxed ${!isDescriptionExpanded && needsTruncation ? 'line-clamp-3' : ''}`}>
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
            {isDescriptionExpanded ? 'Show less' : 'Learn more'}
          </button>
        )}
      </div>

      {/* CTA Button */}
      <Button 
        className="w-full rounded-[29px] h-[48px] bg-[#FF6631] hover:bg-[#FF6631]/90 text-[20px] text-white font-[500] flex items-center justify-center gap-2 p-0"
        onClick={() => navigate(`/programs/${program.slug}`)}
      >
        Continue Learning
      </Button>
    </motion.div>
  );
}
