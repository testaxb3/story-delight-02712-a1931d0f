import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <button
      onClick={handleClick}
      className={cn(
        "relative w-full cursor-pointer rounded-2xl p-5 transition-all duration-200",
        "border-2 min-h-[60px] flex items-center justify-between text-left",
        isSelected
          ? "bg-black dark:bg-white border-black dark:border-white text-white dark:text-black"
          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-black dark:text-white hover:border-gray-300 dark:hover:border-gray-600"
      )}
    >
      <span className="text-base font-medium pr-3">{label}</span>
      
      {isSelected && (
        <div className="flex-shrink-0">
          <div className="w-6 h-6 rounded-full bg-white dark:bg-black flex items-center justify-center">
            <Check className="w-4 h-4 text-black dark:text-white" strokeWidth={3} />
          </div>
        </div>
      )}
    </button>
  );
};
