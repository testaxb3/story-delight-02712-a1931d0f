import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, Headphones, Check, ChevronRight, Play, Lock } from 'lucide-react';
import { ProgramLesson } from '@/hooks/useProgramDetail';

interface LessonListItemProps {
  lesson: ProgramLesson;
  programSlug: string;
  status: 'completed' | 'available' | 'locked';
  index: number;
}

export function LessonListItem({ lesson, programSlug, status, index }: LessonListItemProps) {
  const navigate = useNavigate();
  const isClickable = status !== 'locked';

  const handleClick = () => {
    if (isClickable) {
      navigate(`/programs/${programSlug}/lesson/${lesson.day_number}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.02, type: 'spring', stiffness: 100 }}
      whileHover={isClickable ? { x: 4, backgroundColor: '#FAFAFA' } : {}}
      whileTap={isClickable ? { scale: 0.99 } : {}}
      className={`group relative flex flex-row items-center gap-3 py-4 px-4 border-b border-[#F0F0F0] last:border-b-0 transition-colors ${isClickable ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
        }`}
      onClick={handleClick}
    >
      {/* Status indicator - left side */}
      <div className="relative flex-shrink-0">
        {/* Circle with status */}
        <motion.div
          initial={status === 'completed' ? { scale: 0 } : {}}
          animate={status === 'completed' ? { scale: 1 } : {}}
          transition={{ delay: 0.2 + index * 0.02, type: 'spring' }}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${status === 'completed'
              ? 'bg-gradient-to-br from-green-500 to-emerald-400 shadow-md shadow-green-500/30'
              : status === 'available'
                ? 'bg-gradient-to-br from-[#FF6631] to-[#FFA300] shadow-md shadow-orange-500/30'
                : 'border-2 border-[#E0E0E0] bg-gray-50'
            }`}
        >
          {status === 'completed' ? (
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          ) : status === 'available' ? (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
            </motion.div>
          ) : (
            <Lock className="w-4 h-4 text-gray-400" />
          )}
        </motion.div>

        {/* Connection line to next item */}
        {index < 100 && ( // Always show for reasonable list sizes
          <div className={`absolute left-1/2 top-full w-0.5 h-4 -translate-x-1/2 ${status === 'completed' ? 'bg-green-200' : 'bg-gray-200'
            }`} />
        )}
      </div>

      {/* Lesson Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status === 'completed'
              ? 'bg-green-100 text-green-700'
              : status === 'available'
                ? 'bg-orange-100 text-[#FF6631]'
                : 'bg-gray-100 text-gray-500'
            }`}>
            Day {lesson.day_number}
          </span>

          {status === 'available' && (
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[10px] font-semibold text-[#FF6631] uppercase tracking-wide"
            >
              Up Next
            </motion.span>
          )}
        </div>

        <h4 className={`text-[15px] font-semibold mt-1 transition-colors line-clamp-1 ${status === 'completed'
            ? 'text-[#666]'
            : status === 'available'
              ? 'text-[#393939] group-hover:text-[#FF6631]'
              : 'text-gray-400'
          }`}>
          {lesson.title}
        </h4>

        {/* Meta info */}
        <div className="flex items-center gap-3 mt-1.5">
          {lesson.estimated_minutes && (
            <span className={`flex items-center gap-1 text-[11px] ${status === 'locked' ? 'text-gray-400' : 'text-[#8D8D8D]'
              }`}>
              <Clock className="w-3 h-3" />
              {lesson.estimated_minutes} min
            </span>
          )}
          {lesson.audio_url && (
            <span className={`flex items-center gap-1 text-[11px] ${status === 'locked' ? 'text-gray-400' : 'text-[#8D8D8D]'
              }`}>
              <Headphones className="w-3 h-3" />
              Audio
            </span>
          )}
          {status === 'completed' && (
            <span className="flex items-center gap-1 text-[11px] text-green-600 font-medium">
              <Check className="w-3 h-3" />
              Completed
            </span>
          )}
        </div>
      </div>

      {/* Right arrow */}
      {isClickable && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-shrink-0"
        >
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${status === 'completed'
                ? 'bg-green-100 group-hover:bg-green-200'
                : 'bg-orange-100 group-hover:bg-orange-200'
              }`}
          >
            <ChevronRight className={`w-5 h-5 ${status === 'completed' ? 'text-green-600' : 'text-[#FF6631]'
              }`} />
          </motion.div>
        </motion.div>
      )}

      {/* Hover accent line */}
      <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 rounded-r-full transition-all duration-300 group-hover:h-[60%] ${status === 'completed'
          ? 'bg-gradient-to-b from-green-500 to-emerald-400'
          : 'bg-gradient-to-b from-[#FF6631] to-[#FFA300]'
        }`} />
    </motion.div>
  );
}
