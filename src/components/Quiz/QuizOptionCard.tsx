import { Check, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuizOptionCardProps {
  value: string;
  label: string;
  isSelected: boolean;
  onSelect: (value: string) => void;
}

export const QuizOptionCard = ({ value, label, isSelected, onSelect }: QuizOptionCardProps) => {
  const handleClick = () => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    onSelect(value);
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`relative w-full cursor-pointer rounded-2xl p-5 transition-all duration-200 min-h-[72px] flex items-center justify-between text-left ${
        isSelected
          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
      }`}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
          isSelected
            ? 'bg-white dark:bg-gray-900'
            : 'border-2 border-gray-300 dark:border-gray-600'
        }`}>
          {isSelected ? (
            <Circle className="w-3 h-3 fill-gray-900 dark:fill-white text-gray-900 dark:text-white" />
          ) : null}
        </div>
        <span className="text-base font-medium">{label}</span>
      </div>
    </motion.button>
  );
};
