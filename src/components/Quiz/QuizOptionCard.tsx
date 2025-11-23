import { memo, useCallback } from 'react';
import { Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHaptic } from '@/hooks/useHaptic';

interface QuizOptionCardProps {
  value: string;
  label: string;
  isSelected: boolean;
  onSelect: (value: string) => void;
  index?: number;
}

export const QuizOptionCard = memo(({ value, label, isSelected, onSelect, index = 0 }: QuizOptionCardProps) => {
  const { triggerHaptic } = useHaptic();

  const handleClick = useCallback(() => {
    triggerHaptic('light');
    onSelect(value);
  }, [triggerHaptic, onSelect, value]);

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className={`relative w-full cursor-pointer rounded-2xl p-5 transition-all duration-200 min-h-[72px] flex items-center justify-between text-left group ${
        isSelected
          ? 'bg-foreground text-background'
          : 'bg-card/50 backdrop-blur-sm border border-border/30 hover:border-border/60 text-foreground'
      }`}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isSelected 
            ? 'transparent'
            : 'radial-gradient(circle at center, hsl(var(--primary) / 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="flex items-center gap-4 flex-1 relative z-10">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
          isSelected
            ? 'bg-background'
            : 'border-2 border-border group-hover:border-primary/50'
        }`}>
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Circle className="w-3 h-3 fill-foreground text-foreground" />
            </motion.div>
          )}
        </div>
        <span className="text-base font-medium leading-snug">{label}</span>
      </div>
    </motion.button>
  );
});
