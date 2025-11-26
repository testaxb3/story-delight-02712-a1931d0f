import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';

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

const GoalButton = memo(({ 
  goal, 
  isSelected, 
  onToggle,
  index 
}: { 
  goal: typeof goalOptions[0]; 
  isSelected: boolean; 
  onToggle: (value: string) => void;
  index: number;
}) => {
  const { triggerHaptic } = useHaptic();
  
  const handleClick = useCallback(() => {
    triggerHaptic('light');
    onToggle(goal.value);
  }, [triggerHaptic, onToggle, goal.value]);

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className={`w-full p-5 rounded-2xl transition-all text-left flex items-center justify-between group ${
        isSelected
          ? 'bg-foreground text-background'
          : 'bg-card/50 backdrop-blur-sm border border-border/30 hover:border-border/60 text-foreground'
      }`}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isSelected 
            ? 'transparent'
            : 'radial-gradient(circle at center, hsl(var(--primary) / 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="flex items-center gap-3 relative z-10">
        <span className="text-2xl">{goal.icon}</span>
        <span className="font-medium text-base">
          {goal.label}
        </span>
      </div>

      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="flex-shrink-0 relative z-10"
        >
          <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center">
            <Check className="w-4 h-4 text-foreground" strokeWidth={3} />
          </div>
        </motion.div>
      )}
    </motion.button>
  );
});

export const QuizGoalsStep = memo(({ selectedGoals, onToggle }: QuizGoalsStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-left space-y-2 px-6">
        <h2 className="text-3xl font-bold text-foreground font-relative">
          What do you most want to improve?
        </h2>
        <p className="text-base text-muted-foreground">
          Select all that apply
        </p>
      </div>

      <div className="space-y-4 px-6">
        {goalOptions.map((goal, index) => (
          <GoalButton
            key={goal.value}
            goal={goal}
            isSelected={selectedGoals.includes(goal.value)}
            onToggle={onToggle}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
});
