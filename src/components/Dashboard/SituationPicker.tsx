import { memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useHaptic } from '@/hooks/useHaptic';
import { cn } from '@/lib/utils';

// Quick situation buttons for "Exhausted Emily" at 8pm
const SITUATIONS = [
  { emoji: '😤', label: 'Tantrum', category: 'tantrums', color: 'from-red-500/20 to-red-600/10' },
  { emoji: '😴', label: 'Bedtime', category: 'bedtime', color: 'from-indigo-500/20 to-indigo-600/10' },
  { emoji: '🙅', label: 'Refusal', category: 'defiance', color: 'from-amber-500/20 to-amber-600/10' },
  { emoji: '🍽️', label: 'Mealtime', category: 'mealtime', color: 'from-green-500/20 to-green-600/10' },
] as const;

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

export const SituationPicker = memo(function SituationPicker() {
  const navigate = useNavigate();
  const { triggerHaptic } = useHaptic();

  const handlePress = (category: string) => {
    triggerHaptic('medium');
    navigate(`/scripts?category=${category}`);
  };

  return (
    <motion.div variants={itemVariants} className="mb-4">
      <p className="text-xs font-medium text-muted-foreground mb-3 px-1">
        What's happening right now?
      </p>
      
      <div className="grid grid-cols-4 gap-2">
        {SITUATIONS.map((situation, index) => (
          <motion.button
            key={situation.category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePress(situation.category)}
            className={cn(
              "relative flex flex-col items-center gap-1.5 p-3 rounded-2xl overflow-hidden",
              "min-h-[72px] touch-manipulation"
            )}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label={`Find scripts for ${situation.label}`}
          >
            {/* Gradient background */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br",
              situation.color
            )} />
            
            {/* Glass border */}
            <div className="absolute inset-0 rounded-2xl border border-border/50" />
            
            {/* Content */}
            <span className="relative text-2xl" role="img" aria-hidden="true">
              {situation.emoji}
            </span>
            <span className="relative text-[10px] font-semibold text-foreground/80">
              {situation.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
});
