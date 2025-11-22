import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useTheme } from '@/contexts/ThemeContext';

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

export const QuizChallengeStep = ({
  challengeLevel,
  challengeDuration,
  triedApproaches,
  onLevelChange,
  onDurationChange,
  onApproachToggle,
}: QuizChallengeStepProps) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Challenge Level */}
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black dark:text-white font-relative">
            How challenging is the situation?
          </h2>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400">
            Rate from 1 (manageable) to 10 (extremely difficult)
          </p>
        </div>

        <div className="space-y-6 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-6xl md:text-7xl font-black text-black dark:text-white font-relative">
              {challengeLevel}
            </div>
          </div>

          <Slider
            value={[challengeLevel]}
            onValueChange={(value) => onLevelChange(value[0])}
            min={1}
            max={10}
            step={1}
            className="touch-none"
          />

          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Manageable</span>
            <span>Extremely Difficult</span>
          </div>
        </div>
      </div>

      {/* Challenge Duration */}
      <div className="space-y-4 max-w-md mx-auto">
        <h3 className="text-xl font-bold text-black dark:text-white font-relative text-center">
          How long has this been going on?
        </h3>
        <div className="space-y-3">
          {durationOptions.map((option) => (
            <motion.button
              key={option.value}
              onClick={() => onDurationChange(option.value)}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                challengeDuration === option.value
                  ? 'border-black dark:border-white bg-black dark:bg-white'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span
                className={`font-medium ${
                  challengeDuration === option.value
                    ? 'text-white dark:text-black'
                    : 'text-black dark:text-white'
                }`}
              >
                {option.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tried Approaches */}
      <div className="space-y-4 max-w-md mx-auto">
        <h3 className="text-xl font-bold text-black dark:text-white font-relative text-center">
          What have you already tried?
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Select all that apply (optional)
        </p>
        <div className="space-y-3">
          {approachOptions.map((approach) => {
            const isSelected = triedApproaches.includes(approach);
            return (
              <motion.button
                key={approach}
                onClick={() => onApproachToggle(approach)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                  isSelected
                    ? 'border-black dark:border-white bg-black/5 dark:bg-white/5'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Checkbox
                  checked={isSelected}
                  className={`${
                    isSelected
                      ? 'bg-black dark:bg-white border-black dark:border-white'
                      : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600'
                  }`}
                />
                <span className={`text-sm font-medium text-black dark:text-white`}>
                  {approach}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
