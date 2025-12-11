import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProgramWithProgress } from '@/hooks/usePrograms';
import { Button } from '@/components/ui/button';

interface CurrentProgramCardProps {
  program: ProgramWithProgress;
  nextLessonTitle?: string;
}

export function CurrentProgramCard({ program, nextLessonTitle }: CurrentProgramCardProps) {
  const navigate = useNavigate();
  const nextLesson = program.lessons_completed.length + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex flex-col bg-[#FFFFFF] rounded-[10px] border border-[#F7F2F0] py-[14px] px-[10px]"
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
        Lesson {nextLesson}: <span className="font-[800]">{nextLessonTitle || 'Continue Learning'}</span>
      </p>

      {/* Image */}
      <div className="relative mb-[12px]">
        <div className="rounded-[10px] w-full h-[160px] bg-slate-200 overflow-hidden relative">
           {/* Fallback gradient or image if available */}
           <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-100" />
           {/* Heart Icon Overlay */}
           <div className="absolute right-[12px] top-[11px] z-[1] w-[29px] h-[29px] bg-white/80 rounded-full flex items-center justify-center cursor-pointer">
              <Heart className="w-[16px] h-[16px] text-[#393939]" />
           </div>
        </div>
      </div>

      {/* Description */}
      <p className="line-clamp-5 text-[16px] text-[#393939] font-[500] leading-[20.8px] mb-[18px]">
        {program.description || 'Continue your parenting journey with this program. Learn valuable skills and strategies.'}
      </p>

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
