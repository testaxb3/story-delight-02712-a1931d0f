import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Program } from '@/hooks/usePrograms';

interface AvailableProgramCardProps {
  program: Program;
  index?: number;
}

export function AvailableProgramCard({ program, index = 0 }: AvailableProgramCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -2, boxShadow: "0 8px 16px -4px rgba(39, 145, 224, 0.12)" }}
      className="flex flex-col gap-[10px] bg-[#FFFFFF] rounded-[10px] border border-[#F7F2F0] px-[16px] py-[20px] cursor-pointer shadow-sm hover:shadow-md transition-shadow"
      onClick={() => navigate(`/programs/${program.slug}`)}
    >
      <div className="flex flex-row items-center gap-[10px]">
        {/* Thumbnail Placeholder */}
        <div className="min-w-[90px] h-[90px] rounded-[10px] bg-slate-200 flex-shrink-0 overflow-hidden relative">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-[10px] flex-1 min-w-0">
          {/* Badges */}
          <div className="flex flex-row items-center gap-[5px]">
            <div className="flex justify-center items-center py-[2px] px-[5px] border border-[#FF5C16] rounded-[3px]">
              <p className="text-[14px] text-[#FF5C16] leading-[15px]">
                {program.total_lessons} Lessons
              </p>
            </div>
            {program.age_range && (
              <div className="flex justify-center items-center py-[2px] px-[5px] border border-[#2791E0] rounded-[3px]">
                <p className="text-[14px] text-[#2791E0] leading-[15px]">
                  {program.age_range}
                </p>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-[#393939] text-[20px] leading-[26px] font-[800] truncate">
            {program.title}
          </h3>

          {/* Description */}
          <p className="text-[14px] text-[#8D8D8D] leading-[1.2] line-clamp-2">
            {program.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
