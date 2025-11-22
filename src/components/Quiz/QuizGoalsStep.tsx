import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { useTheme } from '@/contexts/ThemeContext';

interface QuizGoalsStepProps {
  selectedGoals: string[];
  onToggle: (goal: string) => void;
}

const goalOptions = [
  { value: 'tantrums', label: 'Tantrums & Meltdowns', icon: '😤' },
  { value: 'sleep', label: 'Sleep Routine', icon: '😴' },
  { value: 'eating', label: 'Eating & Meals', icon: '🍽️' },
  { value: 'focus', label: 'Focus & Concentration', icon: '🎯' },
  { value: 'relationships', label: 'Family Relationships', icon: '👨‍👩‍👧‍👦' },
];

export const QuizGoalsStep = ({ selectedGoals, onToggle }: QuizGoalsStepProps) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-3">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black dark:text-white font-relative">
          What do you most want to improve?
        </h2>
        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Select all that apply
        </p>
      </div>

      <div className="space-y-3 max-w-md mx-auto">
        {goalOptions.map((goal) => {
          const isSelected = selectedGoals.includes(goal.value);
          return (
            <motion.button
              key={goal.value}
              onClick={() => onToggle(goal.value)}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                isSelected
                  ? 'border-black dark:border-white bg-black dark:bg-white'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Checkbox
                checked={isSelected}
                className={`${
                  isSelected
                    ? 'bg-white dark:bg-black border-white dark:border-black'
                    : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600'
                }`}
              />
              <span className="text-2xl">{goal.icon}</span>
              <span
                className={`font-medium ${
                  isSelected ? 'text-white dark:text-black' : 'text-black dark:text-white'
                }`}
              >
                {goal.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};
