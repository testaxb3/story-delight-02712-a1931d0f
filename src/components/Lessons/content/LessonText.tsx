import { LessonTextSection } from '@/types/lesson-content';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Props {
  data: LessonTextSection['data'];
}

export function LessonText({ data }: Props) {
  const variants = {
    default: 'text-[#4A4A4A]',
    lead: 'text-[#393939] font-medium text-[16px]',
    highlight: 'text-[#393939] bg-gradient-to-r from-[#FFF5ED] to-transparent px-3 py-2 rounded-lg border-l-3 border-[#FF6631]',
  };

  return (
    <motion.p
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'mb-5 mx-5 text-[15px] leading-[1.8]',
        variants[data.variant || 'default']
      )}
    >
      {data.content}
    </motion.p>
  );
}
