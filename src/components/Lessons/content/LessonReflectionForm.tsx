import { LessonReflectionFormSection } from '@/types/lesson-content';
import { motion } from 'framer-motion';
import { PenLine, Sparkles } from 'lucide-react';

interface Props {
  data: LessonReflectionFormSection['data'];
}

export function LessonReflectionForm({ data }: Props) {
  return (
    <div className="mb-6 mx-5">
      {/* Header with icon */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 mb-4"
      >
        <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <PenLine className="w-5 h-5 text-white" />
        </div>
        <div>
          {data.title && (
            <h3 className="text-lg font-bold text-[#393939]">{data.title}</h3>
          )}
          {data.description && (
            <p className="text-sm text-[#8D8D8D]">{data.description}</p>
          )}
        </div>
      </motion.div>

      {/* Timeline-style fields */}
      <div className="relative pl-6">
        {/* Timeline line */}
        <div className="absolute left-[7px] top-3 bottom-3 w-[3px] bg-gradient-to-b from-amber-400 via-orange-400 to-amber-300 rounded-full" />

        <div className="space-y-4">
          {data.fields.map((field, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline dot */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                className="absolute -left-6 top-4 w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-amber-500/30 flex items-center justify-center"
              >
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </motion.div>

              {/* Field card */}
              <motion.div
                whileHover={{ x: 4 }}
                className="bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200/50 rounded-[14px] p-4 shadow-sm hover:shadow-md transition-all"
              >
                <h4 className="font-bold text-amber-600 text-[15px] mb-1">
                  {field.label}
                </h4>
                {field.description && (
                  <p className="text-sm text-[#666] mb-3">{field.description}</p>
                )}
                {field.placeholder && (
                  <div className="p-3 bg-white/80 rounded-[10px] border border-amber-200/30 shadow-inner">
                    <p className="text-sm text-[#ABABAB] italic">{field.placeholder}</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
