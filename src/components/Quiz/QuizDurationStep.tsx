import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useHaptic } from '@/hooks/useHaptic';

interface QuizDurationStepProps {
  challengeDuration: string;
  onChange: (duration: string) => void;
}

const durationOptions = [
  { value: 'weeks', label: 'Weeks', description: 'This is new', icon: '🌱' },
  { value: 'months', label: 'Months', description: 'Been building up', icon: '📅' },
  { value: 'years', label: 'Years', description: 'Long-standing pattern', icon: '⏳' },
];

export const QuizDurationStep = memo(({ challengeDuration, onChange }: QuizDurationStepProps) => {
  const { triggerHaptic } = useHaptic();

  const handleSelect = useCallback((value: string) => {
    triggerHaptic('light');
    onChange(value);
  }, [triggerHaptic, onChange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 w-full max-w-md"
    >
      <div className="text-center space-y-2 px-4">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl md:text-3xl font-bold text-foreground font-relative"
        >
          How long has this been going on?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm md:text-base text-muted-foreground"
        >
          This helps us understand the depth of the pattern
        </motion.p>
      </div>

      <div className="space-y-3 px-4">
        {durationOptions.map((option, index) => (
          <motion.button
            key={option.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            onClick={() => handleSelect(option.value)}
            className={`w-full p-5 rounded-2xl transition-all text-left flex items-center gap-4 ${
              challengeDuration === option.value
                ? 'bg-foreground text-background'
                : 'bg-card/50 backdrop-blur-sm border border-border/30 hover:border-border/60 text-foreground'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-3xl">{option.icon}</span>
            <div>
              <div className="font-semibold text-lg">{option.label}</div>
              <div className={`text-sm ${
                challengeDuration === option.value ? 'text-background/70' : 'text-muted-foreground'
              }`}>
                {option.description}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
});
