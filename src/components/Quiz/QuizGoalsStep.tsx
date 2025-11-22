import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-left space-y-2 px-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          What do you most want to improve?
        </h2>
        <p className="text-base text-gray-500 dark:text-gray-400">
          Select all that apply
        </p>
      </div>

      <div className="space-y-4 px-6">
        {goalOptions.map((goal) => {
          const isSelected = selectedGoals.includes(goal.value);
          return (
            <motion.button
              key={goal.value}
              onClick={() => onToggle(goal.value)}
              className={`w-full p-5 rounded-2xl transition-all text-left flex items-center justify-between ${
                isSelected
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{goal.icon}</span>
                <span className="font-medium text-base">
                  {goal.label}
                </span>
              </div>

              {isSelected && (
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                    <Check className="w-4 h-4 text-gray-900 dark:text-white" strokeWidth={3} />
                  </div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};
