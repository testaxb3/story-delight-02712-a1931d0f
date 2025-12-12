import { LessonAccordionSection } from '@/types/lesson-content';
import { motion } from 'framer-motion';

interface Props {
  data: LessonAccordionSection['data'];
}

export function LessonExpandedList({ data }: Props) {
  return (
    <div className="mb-6 mx-5">
      {data.title && (
        <motion.h3
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"
        >
          <span className="w-1 h-5 bg-gradient-to-b from-[#FF6631] to-[#FFA300] rounded-full" />
          {data.title}
        </motion.h3>
      )}

      <div className="relative pl-6">
        {/* Timeline line */}
        <div className="absolute left-[7px] top-3 bottom-3 w-[3px] bg-gradient-to-b from-[#FF6631] via-[#FFA300] to-[#FFB84D] rounded-full" />

        <div className="space-y-4">
          {data.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Animated dot */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                className="absolute -left-6 top-4 w-4 h-4 rounded-full bg-gradient-to-br from-[#FF6631] to-[#FFA300] shadow-md shadow-orange-500/30"
              />

              {/* Card */}
              <motion.div
                whileHover={{ x: 4 }}
                className="bg-gradient-to-r from-amber-50 to-white dark:from-amber-900/20 dark:to-card p-4 rounded-[14px] border border-amber-200 dark:border-amber-800/30 shadow-sm hover:shadow-md transition-all"
              >
                <h4 className="font-bold text-foreground text-[15px] mb-2">
                  {item.title}
                </h4>
                <p className="text-[14px] text-muted-foreground leading-relaxed">
                  {item.content}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
