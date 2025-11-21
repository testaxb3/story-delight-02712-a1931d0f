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
          ? "bg-black border-black text-white"
          : "bg-white border-gray-200 text-black hover:border-gray-300"
      )}
    >
      <span className="text-base font-medium pr-3">{label}</span>
      
      {isSelected && (
        <div className="flex-shrink-0">
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
            <Check className="w-4 h-4 text-black" strokeWidth={3} />
          </div>
        </div>
      )}
    </button>
  );
};
