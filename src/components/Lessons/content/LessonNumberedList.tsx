import { LessonNumberedListSection } from '@/types/lesson-content';
import { motion } from 'framer-motion';

interface Props {
  data: LessonNumberedListSection['data'];
}

export function LessonNumberedList({ data }: Props) {
  if (data.variant === 'timeline') {
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
                key={item.number}
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
                  className="absolute -left-6 top-4 w-4 h-4 rounded-full bg-gradient-to-br from-[#FF6631] to-[#FFA300] shadow-md shadow-orange-500/30 flex items-center justify-center"
                >
                  <span className="text-[8px] font-bold text-white">{item.number}</span>
                </motion.div>

                {/* Card */}
                <div className="bg-gradient-to-r from-amber-50 to-white dark:from-amber-900/20 dark:to-card p-4 rounded-[14px] border border-amber-200 dark:border-amber-800/30 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-foreground text-[15px] mb-1">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-[14px] text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default / Circled Number style
  return (
    <div className="mb-6 mx-5">
      {data.title && (
        <motion.h3
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-lg font-bold text-[#393939] mb-4 flex items-center gap-2"
        >
          <span className="w-1 h-5 bg-gradient-to-b from-[#FF6631] to-[#FFA300] rounded-full" />
          {data.title}
        </motion.h3>
      )}
      {data.subtitle && (
        <p className="text-[15px] text-[#666] mb-4">{data.subtitle}</p>
      )}

      <div className="space-y-3">
        {data.items.map((item, index) => (
          <motion.div
            key={item.number}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className="flex gap-3 items-start group"
          >
            {/* Gradient circled number */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6631] to-[#FFA300] flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:shadow-lg group-hover:shadow-orange-500/30 transition-shadow"
            >
              <span className="text-white text-sm font-bold">{item.number}</span>
            </motion.div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <h4 className="font-bold text-[#393939] text-[15px] leading-tight">
                {item.title}
              </h4>
              {item.description && (
                <p className="text-[14px] text-[#666] mt-0.5 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
