import { LessonVisualDiagramSection } from '@/types/lesson-content';
import { motion } from 'framer-motion';

interface Props {
  data: LessonVisualDiagramSection['data'];
}

export function LessonVisualDiagram({ data }: Props) {
  return (
    <div className="mb-8 mx-5">
      <motion.h3
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-lg font-bold text-[#393939] mb-4 flex items-center gap-2"
      >
        <span className="w-1 h-5 bg-gradient-to-b from-[#FF6631] to-[#FFA300] rounded-full" />
        {data.title}
      </motion.h3>

      {/* Grid layout for labels */}
      <div className="grid gap-3">
        {data.labels.map((label, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, type: 'spring' }}
            whileHover={{ x: 4 }}
            className="flex items-start gap-4 p-4 rounded-[14px] bg-gradient-to-r from-[#FFF5ED] to-white border border-[#FFE4D1] shadow-sm hover:shadow-md transition-all"
          >
            {/* Number badge */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="flex-shrink-0 w-10 h-10 rounded-[10px] bg-gradient-to-br from-[#FF6631] to-[#FFA300] text-white text-sm font-bold flex items-center justify-center shadow-md shadow-orange-500/20"
            >
              {label.number}
            </motion.div>

            <p className="text-[15px] text-[#4A4A4A] leading-relaxed pt-2">
              {label.text}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Center image if provided */}
      {data.centerImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF6631]/20 to-[#FFA300]/20 rounded-[16px] blur-xl" />
            <img
              src={data.centerImage}
              alt="Diagram"
              className="relative max-w-[220px] h-auto rounded-[16px] shadow-lg"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
