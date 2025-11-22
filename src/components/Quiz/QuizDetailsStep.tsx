import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface QuizDetailsStepProps {
  childAge: number;
  onChange: (age: number) => void;
}

export const QuizDetailsStep = ({ childAge, onChange }: QuizDetailsStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center space-y-3">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black dark:text-white font-relative">
          How old is your child?
        </h2>
        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          This helps us tailor strategies to their developmental stage
        </p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        <div className="text-center">
          <div className="text-6xl md:text-7xl font-black text-black dark:text-white font-relative">
            {childAge}
          </div>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mt-2">
            years old
          </p>
        </div>

        <Slider
          value={[childAge]}
          onValueChange={(value) => onChange(value[0])}
          min={1}
          max={18}
          step={1}
          className="touch-none"
        />

        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>1 year</span>
          <span>18 years</span>
        </div>
      </div>
    </motion.div>
  );
};
