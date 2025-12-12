import { LessonDividerSection } from '@/types/lesson-content';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface Props {
  data?: LessonDividerSection['data'];
}

export function LessonDivider({ data }: Props) {
  const style = data?.style || 'line';

  if (style === 'space') {
    return <div className="h-8" />;
  }

  if (style === 'dots') {
    return (
      <div className="flex items-center justify-center gap-3 my-8 px-5">
        <motion.span
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6631] to-[#FFA300]"
        />
        <motion.span
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6631] to-[#FFA300]"
        />
        <motion.span
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6631] to-[#FFA300]"
        />
      </div>
    );
  }

  // Default line style - enhanced with gradient
  return (
    <div className="flex items-center gap-3 my-8 px-5">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E8E8E6] to-[#E8E8E6]" />
      <Sparkles className="w-4 h-4 text-[#E8E8E6]" />
      <div className="flex-1 h-px bg-gradient-to-r from-[#E8E8E6] via-[#E8E8E6] to-transparent" />
    </div>
  );
}
