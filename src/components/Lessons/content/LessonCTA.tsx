import { LessonCTASection } from '@/types/lesson-content';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, X, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  data: LessonCTASection['data'];
  onAction?: (action: string) => void;
}

export function LessonCTA({ data, onAction }: Props) {
  const icons = {
    next: ArrowRight,
    diary: BookOpen,
    close: X,
  };

  const Icon = icons[data.buttonAction || 'next'];

  return (
    <motion.div
      className="mb-6 mx-5 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Card with gradient border */}
      <div className="p-[2px] rounded-[20px] bg-gradient-to-r from-[#FF6631] via-[#FFA300] to-[#FF6631]">
        <div className="relative p-6 bg-gradient-to-br from-[#FFF9F5] to-white rounded-[18px] overflow-hidden">
          {/* Decorative sparkles */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute top-4 right-4 text-[#FFA300]/30"
          >
            <Sparkles className="w-8 h-8" />
          </motion.div>

          {/* Content */}
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-[#393939] mb-2 pr-12">
              {data.text}
            </h3>
            {data.description && (
              <p className="text-sm text-[#666] mb-5 leading-relaxed">
                {data.description}
              </p>
            )}

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => onAction?.(data.buttonAction || 'next')}
                className="relative w-full h-12 rounded-full bg-gradient-to-r from-[#FF6631] to-[#FFA300] hover:from-[#FF5520] hover:to-[#FF9500] text-white font-semibold shadow-lg shadow-orange-500/30 overflow-hidden"
              >
                {/* Shine effect */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                />

                <span className="relative z-10 flex items-center gap-2">
                  {data.buttonText}
                  <Icon className="w-4 h-4" />
                </span>
              </Button>
            </motion.div>
          </div>

          {/* Decorative corner */}
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-[#FF6631]/10 to-transparent rounded-tl-full" />
        </div>
      </div>
    </motion.div>
  );
}
