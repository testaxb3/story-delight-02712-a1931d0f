import { memo } from 'react';
import { motion } from 'framer-motion';
import { HapticSlider } from '@/components/ui/haptic-slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useHaptic } from '@/hooks/useHaptic';

interface QuizChallengeStepProps {
  challengeLevel: number;
  challengeDuration: string;
  triedApproaches: string[];
  onLevelChange: (level: number) => void;
  onDurationChange: (duration: string) => void;
  onApproachToggle: (approach: string) => void;
}

const durationOptions = [
  { value: 'weeks', label: 'A few weeks' },
  { value: 'months', label: 'Several months' },
  { value: 'years', label: 'Over a year' },
];

const approachOptions = [
  'Positive reinforcement',
  'Time-outs',
  'Reward charts',
  'Strict rules',
  'Ignoring behavior',
  'Therapy/counseling',
];

export const QuizChallengeStep = memo(({
  challengeLevel,
  challengeDuration,
  triedApproaches,
  onLevelChange,
  onDurationChange,
  onApproachToggle,
}: QuizChallengeStepProps) => {
  const { triggerHaptic } = useHaptic();

  const handleLevelChange = (value: number[]) => {
    onLevelChange(value[0]);
  };

  const handleDurationChange = (duration: string) => {
    triggerHaptic('light');
    onDurationChange(duration);
  };

  const handleApproachToggle = (approach: string) => {
    triggerHaptic('light');
    onApproachToggle(approach);
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
            How challenging is the situation?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Rate from 1 (manageable) to 10 (extremely difficult)
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
              <span className={`font-medium ${challengeDuration === option.value ? 'text-foreground' : 'text-foreground'}`}>
                {option.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tried Approaches */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground font-relative text-center">
          What have you already tried?
        </h3>
        <p className="text-sm text-muted-foreground text-center">
          Select all that apply (optional)
        </p>
        <div className="space-y-3">
          {approachOptions.map((approach, index) => {
            const isSelected = triedApproaches.includes(approach);
            return (
              <motion.div
                key={approach}
                onClick={() => handleApproachToggle(approach)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 cursor-pointer ${
                  isSelected
                    ? 'border-foreground bg-foreground/5'
                    : 'border-border bg-card/50 hover:border-foreground/30'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  isSelected ? 'bg-foreground border-foreground' : 'bg-card border-border'
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-background" viewBox="0 0 12 12" fill="none">
                      <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium text-foreground">{approach}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
});
