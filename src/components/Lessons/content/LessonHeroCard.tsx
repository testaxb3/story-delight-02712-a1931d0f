import { LessonHeroSection } from '@/types/lesson-content';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

interface Props {
  data: LessonHeroSection['data'];
}

export function LessonHeroCard({ data }: Props) {
  if (!data.coverImage) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 mx-5"
      >
        <h1 className="text-2xl font-bold text-[#393939] leading-tight">
          {data.title}
        </h1>
        {data.subtitle && (
          <p className="text-[#666] text-sm mt-2 leading-relaxed">{data.subtitle}</p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[20px] overflow-hidden mb-6 mx-5 relative"
    >
      {/* Image with gradient overlay */}
      <div className="relative">
        <img
          src={data.coverImage}
          alt={data.title}
          className="w-full h-56 object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold text-white leading-tight shadow-sm"
          >
            {data.title}
          </motion.h1>
          {data.subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/80 text-sm mt-1"
            >
              {data.subtitle}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
