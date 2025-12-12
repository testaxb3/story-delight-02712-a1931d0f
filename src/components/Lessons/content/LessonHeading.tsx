import { LessonHeadingSection } from '@/types/lesson-content';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Props {
  data: LessonHeadingSection['data'];
}

export function LessonHeading({ data }: Props) {
  const levels = {
    2: 'text-[22px] font-bold mb-4 mt-8',
    3: 'text-[18px] font-bold mb-3 mt-6',
  };

  const HeadingTag = `h${data.level || 2}` as 'h2' | 'h3';

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="mx-5"
    >
      <HeadingTag
        className={cn(
          'text-foreground relative inline-block',
          levels[data.level || 2]
        )}
      >
        {/* Decorative accent */}
        <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-[60%] bg-gradient-to-b from-[#FF6631] to-[#FFA300] rounded-full" />
        {data.text}
      </HeadingTag>
    </motion.div>
  );
}
