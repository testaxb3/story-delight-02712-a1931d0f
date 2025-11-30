import { memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useHaptic } from '@/hooks/useHaptic';
import { cn } from '@/lib/utils';

// All script categories with emojis and gradient colors
const SITUATIONS = [
  { emoji: '😤', label: 'Tantrums', category: 'Tantrums', color: 'from-red-500/20 to-red-600/10' },
  { emoji: '😴', label: 'Bedtime', category: 'Bedtime', color: 'from-indigo-500/20 to-indigo-600/10' },
  { emoji: '🍽️', label: 'Mealtime', category: 'Mealtime', color: 'from-green-500/20 to-green-600/10' },
  { emoji: '📱', label: 'Screens', category: 'Screens', color: 'from-blue-500/20 to-blue-600/10' },
  { emoji: '☀️', label: 'Morning', category: 'Morning Routines', color: 'from-orange-500/20 to-orange-600/10' },
  { emoji: '👋', label: 'Social', category: 'Social', color: 'from-purple-500/20 to-purple-600/10' },
  { emoji: '🦷', label: 'Hygiene', category: 'Hygiene', color: 'from-teal-500/20 to-teal-600/10' },
  { emoji: '📚', label: 'Homework', category: 'Homework', color: 'from-amber-500/20 to-amber-600/10' },
  { emoji: '🔄', label: 'Transitions', category: 'Transitions', color: 'from-cyan-500/20 to-cyan-600/10' },
  { emoji: '🏪', label: 'Public', category: 'Public Behavior', color: 'from-pink-500/20 to-pink-600/10' },
  { emoji: '✅', label: 'Tasks', category: 'Daily Responsibilities', color: 'from-emerald-500/20 to-emerald-600/10' },
  { emoji: '🏫', label: 'School', category: 'School', color: 'from-sky-500/20 to-sky-600/10' },
  { emoji: '🧠', label: 'Learning', category: 'Learning', color: 'from-violet-500/20 to-violet-600/10' },
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
    navigate(`/scripts?category=${encodeURIComponent(category)}`);
  };

  return (
    <motion.div variants={itemVariants} className="mb-4">
      <p className="text-xs font-medium text-muted-foreground mb-3 px-1">
        What's happening right now?
      </p>
      
      {/* Horizontal scroll container */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide snap-x">
        {SITUATIONS.map((situation, index) => (
          <motion.button
            key={situation.category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePress(situation.category)}
            className={cn(
              "relative flex flex-col items-center gap-1.5 p-3 rounded-2xl overflow-hidden flex-shrink-0 snap-start",
              "min-w-[72px] min-h-[72px] touch-manipulation"
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
            <span className="relative text-[10px] font-semibold text-foreground/80 whitespace-nowrap">
              {situation.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
});
