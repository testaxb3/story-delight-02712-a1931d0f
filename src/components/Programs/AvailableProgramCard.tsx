import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Program } from '@/hooks/usePrograms';
import { BookOpen, Clock, Users, ChevronRight } from 'lucide-react';

interface AvailableProgramCardProps {
  program: Program;
  index?: number;
}

export function AvailableProgramCard({ program, index = 0 }: AvailableProgramCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
      whileTap={{ scale: 0.98 }}
      whileHover={{ x: 4 }}
      className="group relative flex flex-row gap-[14px] bg-white rounded-[16px] border border-[#E8E4E1] p-[14px] cursor-pointer shadow-sm hover:shadow-md hover:border-[#2791E0]/30 transition-all duration-300"
      onClick={() => navigate(`/programs/${program.slug}`)}
    >
      {/* Thumbnail with gradient fallback */}
      <div className="relative min-w-[100px] h-[100px] rounded-[12px] overflow-hidden flex-shrink-0">
        {program.cover_image_url ? (
          <img
            src={program.cover_image_url}
            alt={program.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2791E0]/20 via-[#76B9FF]/20 to-[#2791E0]/10 flex items-center justify-center">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <BookOpen className="w-10 h-10 text-[#2791E0]/50" />
            </motion.div>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Lesson count badge */}
        <div className="absolute bottom-[6px] left-[6px] flex items-center gap-[4px] bg-white/95 backdrop-blur-sm rounded-full px-[8px] py-[3px] shadow-sm">
          <BookOpen className="w-[10px] h-[10px] text-[#FF6631]" />
          <span className="text-[10px] font-[700] text-[#393939]">{program.total_lessons}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 min-w-0 py-[2px]">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-[6px]">
          {/* Lessons badge with icon */}
          <div className="flex items-center gap-[4px] py-[4px] px-[8px] bg-gradient-to-r from-[#FF6631]/10 to-[#FFA300]/10 rounded-full">
            <Clock className="w-[12px] h-[12px] text-[#FF6631]" />
            <span className="text-[11px] font-[600] text-[#FF6631]">
              {program.total_lessons} Lessons
            </span>
          </div>

          {/* Age range badge */}
          {program.age_range && (
            <div className="flex items-center gap-[4px] py-[4px] px-[8px] bg-gradient-to-r from-[#2791E0]/10 to-[#76B9FF]/10 rounded-full">
              <Users className="w-[12px] h-[12px] text-[#2791E0]" />
              <span className="text-[11px] font-[600] text-[#2791E0]">
                {program.age_range}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-[#393939] text-[17px] leading-[1.25] font-[700] line-clamp-2 group-hover:text-[#2791E0] transition-colors">
          {program.title}
        </h3>

        {/* Description */}
        <p className="text-[13px] text-[#8D8D8D] leading-[1.35] line-clamp-1">
          {program.description}
        </p>
      </div>

      {/* Arrow indicator */}
      <div className="flex items-center">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          className="flex items-center justify-center w-[32px] h-[32px] rounded-full bg-[#2791E0]/10 group-hover:bg-[#2791E0] transition-colors"
        >
          <ChevronRight className="w-[18px] h-[18px] text-[#2791E0] group-hover:text-white transition-colors" />
        </motion.div>
      </div>

      {/* Hover accent line */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-gradient-to-b from-[#2791E0] to-[#76B9FF] rounded-r-full group-hover:h-[60%] transition-all duration-300" />
    </motion.div>
  );
}
