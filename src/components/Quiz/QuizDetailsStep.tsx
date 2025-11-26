import { memo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useHaptic } from '@/hooks/useHaptic';

interface QuizDetailsStepProps {
  childAge: number;
  onChange: (age: number) => void;
}

export const QuizDetailsStep = memo(({ childAge, onChange }: QuizDetailsStepProps) => {
  const { triggerHaptic } = useHaptic();
  const lastAgeRef = useRef(childAge);

  const handleAgeChange = (value: number[]) => {
    if (value[0] !== lastAgeRef.current) {
      triggerHaptic('light');
      lastAgeRef.current = value[0];
      onChange(value[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 w-full max-w-md"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center space-y-3"
      >
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground font-relative">
          How old is your child?
        </h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          This helps us tailor strategies to their developmental stage
        </p>
      </motion.div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-center"
        >
          <div className="text-6xl md:text-7xl font-black text-foreground font-relative">
            {childAge}
          </div>
          <p className="text-lg md:text-xl text-muted-foreground mt-2">
            years old
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Slider
            value={[childAge]}
            onValueChange={handleAgeChange}
            min={1}
            max={18}
            step={1}
            className="touch-none"
          />
        </motion.div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 year</span>
          <span>18 years</span>
        </div>
      </div>
    </motion.div>
  );
});
