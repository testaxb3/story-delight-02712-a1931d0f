import { motion } from 'framer-motion';

interface MoodSelectorProps {
  value: 'happy' | 'neutral' | 'sad' | 'frustrated' | null;
  onChange: (mood: 'happy' | 'neutral' | 'sad' | 'frustrated') => void;
  label: string;
}

const moods = [
  { value: 'happy' as const, emoji: '😊', label: 'Happy' },
  { value: 'neutral' as const, emoji: '😐', label: 'Okay' },
  { value: 'sad' as const, emoji: '😢', label: 'Sad' },
  { value: 'frustrated' as const, emoji: '😤', label: 'Frustrated' },
];

export const MoodSelector = ({ value, onChange, label }: MoodSelectorProps) => {
  return (
    <div className="space-y-3">
      <p className="text-center text-foreground font-medium">{label}</p>
      <div className="flex justify-center gap-4">
        {moods.map((mood) => (
          <motion.button
            key={mood.value}
            type="button"
            onClick={() => onChange(mood.value)}
            className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center gap-1 transition-colors ${
              value === mood.value
                ? 'bg-foreground text-background'
                : 'bg-card border border-border'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-xs">{mood.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
