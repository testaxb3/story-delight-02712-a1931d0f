import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ProgramWithProgress } from '@/hooks/usePrograms';
import { format } from 'date-fns';
import { CheckCircle2, BookOpen, Calendar, Trophy, ChevronRight } from 'lucide-react';

interface CompletedProgramItemProps {
  program: ProgramWithProgress;
  index?: number;
}

export function CompletedProgramItem({ program, index = 0 }: CompletedProgramItemProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
      whileTap={{ scale: 0.98 }}
      whileHover={{ x: 4 }}
      className="group relative flex flex-row gap-[14px] bg-gradient-to-r from-white to-[#F0FDF4] rounded-[16px] border border-[#11C222]/20 p-[14px] cursor-pointer shadow-sm hover:shadow-md hover:border-[#11C222]/40 transition-all duration-300"
      onClick={() => navigate(`/programs/${program.slug}`)}
    >
      {/* Completed badge indicator on left */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-[70%] bg-gradient-to-b from-[#11C222] to-[#22D933] rounded-r-full" />

      {/* Thumbnail with completion overlay */}
      <div className="relative min-w-[90px] h-[90px] rounded-[12px] overflow-hidden flex-shrink-0 ml-1">
        {program.cover_image_url ? (
          <img
            src={program.cover_image_url}
            alt={program.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-[#11C222]/50" />
          </div>
        )}

        {/* Completion overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#11C222]/60 to-transparent flex items-end justify-center pb-2">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
            <CheckCircle2 className="w-3 h-3 text-[#11C222]" />
            <span className="text-[9px] font-[700] text-[#11C222]">COMPLETED</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 min-w-0 py-[2px]">
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-[6px]">
          {/* Lessons badge */}
          <div className="flex items-center gap-[4px] py-[4px] px-[8px] bg-[#11C222]/10 rounded-full">
            <Trophy className="w-[12px] h-[12px] text-[#11C222]" />
            <span className="text-[11px] font-[600] text-[#11C222]">
              {program.total_lessons} Lessons Done
            </span>
          </div>

          {/* Age range badge */}
          {program.age_range && (
            <div className="flex items-center gap-[4px] py-[4px] px-[8px] bg-[#2791E0]/10 rounded-full">
              <span className="text-[11px] font-[600] text-[#2791E0]">
                {program.age_range}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-foreground text-[17px] leading-[1.25] font-[700] line-clamp-2 group-hover:text-[#11C222] transition-colors">
          {program.title}
        </h3>

        {/* Completion date */}
        <div className="flex items-center gap-[6px]">
          <Calendar className="w-[12px] h-[12px] text-muted-foreground" />
          <p className="text-[12px] text-muted-foreground leading-[14px]">
            Finished on {program.completed_at ? format(new Date(program.completed_at), 'MMM d, yyyy') : 'N/A'}
          </p>
        </div>
      </div>

      {/* Right side decoration */}
      <div className="flex items-center">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="flex items-center justify-center w-[36px] h-[36px] rounded-full bg-[#11C222]/10 group-hover:bg-[#11C222] transition-colors"
        >
          <ChevronRight className="w-[18px] h-[18px] text-[#11C222] group-hover:text-white transition-colors" />
        </motion.div>
      </div>
    </motion.div>
  );
}
