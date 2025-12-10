import { memo } from 'react';
import { motion } from 'framer-motion';
import { HapticSlider } from '@/components/ui/haptic-slider';

interface QuizChallengeLevelStepProps {
  challengeLevel: number;
  onChange: (level: number) => void;
}

const getLevelFeedback = (level: number) => {
  if (level <= 3) return { text: "Manageable challenges", emoji: "💪" };
  if (level <= 5) return { text: "Moderate struggles", emoji: "😤" };
  if (level <= 7) return { text: "Daily battles", emoji: "🔥" };
  return { text: "Crisis mode", emoji: "🆘" };
};

export const QuizChallengeLevelStep = memo(({ challengeLevel, onChange }: QuizChallengeLevelStepProps) => {
  const feedback = getLevelFeedback(challengeLevel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 w-full max-w-md"
    >
      <div className="text-center space-y-2 px-4">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl md:text-3xl font-bold text-foreground font-relative"
        >
          How challenging is it right now?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm md:text-base text-muted-foreground"
        >
          Be honest—this helps us give you the right support
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-6 space-y-6"
      >
        {/* Level display */}
        <div className="text-center">
          <motion.div
            key={challengeLevel}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-3 bg-card/50 border border-border/30 rounded-2xl px-6 py-4"
          >
            <span className="text-4xl">{feedback.emoji}</span>
            <div className="text-left">
              <div className="text-3xl font-bold text-foreground">{challengeLevel}</div>
              <div className="text-sm text-muted-foreground">{feedback.text}</div>
            </div>
          </motion.div>
        </div>

        {/* Slider */}
        <div className="space-y-3">
          <HapticSlider
            value={[challengeLevel]}
            onValueChange={(value) => onChange(value[0])}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>Mild</span>
            <span>Intense</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});
