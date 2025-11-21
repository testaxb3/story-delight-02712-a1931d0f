import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
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
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={cn(
        "relative cursor-pointer rounded-2xl p-6 transition-all duration-300",
        "border-2 min-h-[80px] flex items-center justify-between",
        "hover:shadow-lg active:scale-[0.98]",
        isSelected
          ? "bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10 border-primary shadow-lg shadow-primary/20"
          : "bg-card border-border/30 hover:border-border/60 hover:shadow-md"
      )}
    >
      {/* Glow effect when selected */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 blur-xl -z-10"
        />
      )}

      <div className="flex items-center gap-4 flex-1">
        {/* Radio Circle */}
        <div
          className={cn(
            "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
            isSelected
              ? "border-primary bg-primary"
              : "border-muted-foreground/30"
          )}
        >
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="w-2 h-2 bg-primary-foreground rounded-full" />
            </motion.div>
          )}
        </div>

        {/* Label */}
        <span
          className={cn(
            "text-base font-medium transition-colors",
            isSelected ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {label}
        </span>
      </div>

      {/* Checkmark Icon */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
        </motion.div>
      )}
    </motion.div>
  );
};
