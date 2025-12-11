import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ProgramWithProgress } from '@/hooks/usePrograms';
import { format } from 'date-fns';

interface CompletedProgramItemProps {
  program: ProgramWithProgress;
  index?: number;
}

export function CompletedProgramItem({ program, index = 0 }: CompletedProgramItemProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.98 }}
      className="flex flex-col gap-[10px] bg-[#FFFFFF] rounded-[10px] border border-[#F7F2F0] px-[10px] py-[20px] cursor-pointer"
      onClick={() => navigate(`/programs/${program.slug}`)}
    >
      <div className="flex flex-row items-center gap-[10px]">
        {/* Thumbnail Placeholder */}
        <div className="min-w-[90px] h-[90px] rounded-[10px] bg-slate-200 flex-shrink-0 overflow-hidden relative">
           <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-[10px] flex-1">
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
          <h3 className="text-[#393939] text-[20px] leading-[26px] font-[800]">
            {program.title}
          </h3>

          {/* Completion date */}
          <p className="text-[12px] text-[#8D8D8D] leading-[14px]">
            Finished on {program.completed_at ? format(new Date(program.completed_at), 'MMM d, yyyy') : 'N/A'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
