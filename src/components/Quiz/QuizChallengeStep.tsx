import { memo } from 'react';
import { motion } from 'framer-motion';
import { HapticSlider } from '@/components/ui/haptic-slider';
import { useHaptic } from '@/hooks/useHaptic';

interface QuizChallengeStepProps {
  challengeLevel: number;
  challengeDuration: string;
  onLevelChange: (level: number) => void;
  onDurationChange: (duration: string) => void;
}

const durationOptions = [
  { value: 'weeks', label: 'A few weeks' },
  { value: 'months', label: 'Several months' },
  { value: 'years', label: 'Over a year' },
];

export const QuizChallengeStep = memo(({
  challengeLevel,
  challengeDuration,
  onLevelChange,
  onDurationChange,
}: QuizChallengeStepProps) => {
  const { triggerHaptic } = useHaptic();

  const handleLevelChange = (value: number[]) => {
    onLevelChange(value[0]);
  };

  const handleDurationChange = (duration: string) => {
    triggerHaptic('light');
    onDurationChange(duration);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 w-full max-w-md"
    >
      {/* Challenge Level */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center space-y-3"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground font-relative">
            How challenging is it?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            1 = manageable, 10 = extremely difficult
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
              {challengeLevel}
            </div>
          </motion.div>

          <HapticSlider
            value={[challengeLevel]}
            onValueChange={handleLevelChange}
            min={1}
            max={10}
            step={1}
            className="touch-none"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Manageable</span>
            <span>Extremely Difficult</span>
          </div>
        </div>
      </div>

      {/* Challenge Duration */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground font-relative text-center">
          How long has this been going on?
        </h3>
        <div className="space-y-3">
          {durationOptions.map((option, index) => (
            <motion.button
              key={option.value}
              onClick={() => handleDurationChange(option.value)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                challengeDuration === option.value
                  ? 'border-foreground bg-foreground/5'
                  : 'border-border bg-card/50 hover:border-foreground/30'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="font-medium text-foreground">
                {option.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
});
