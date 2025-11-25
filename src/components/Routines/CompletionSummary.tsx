import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Target, TrendingUp } from 'lucide-react';

interface CompletionSummaryProps {
  totalTime: number; // in seconds
  stepsCompleted: number;
  totalSteps: number;
  moodBefore: 'happy' | 'neutral' | 'sad' | 'frustrated' | null;
  moodAfter: 'happy' | 'neutral' | 'sad' | 'frustrated' | null;
  streak?: number;
}

const moodEmojis = {
  happy: '😊',
  neutral: '😐',
  sad: '😢',
  frustrated: '😤',
};

export const CompletionSummary = ({
  totalTime,
  stepsCompleted,
  totalSteps,
  moodBefore,
  moodAfter,
  streak = 1,
}: CompletionSummaryProps) => {
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;
  const timeString = `${minutes}m ${seconds}s`;

  const getMoodChange = () => {
    if (!moodBefore || !moodAfter) return null;
    const moodOrder = ['frustrated', 'sad', 'neutral', 'happy'];
    const beforeIndex = moodOrder.indexOf(moodBefore);
    const afterIndex = moodOrder.indexOf(moodAfter);
    const change = afterIndex - beforeIndex;
    return { before: moodBefore, after: moodAfter, change };
  };

  const moodChange = getMoodChange();

  const statItems = [
    {
      icon: Clock,
      label: 'Total Time',
      value: timeString,
      color: 'text-blue-500',
    },
    {
      icon: CheckCircle2,
      label: 'Steps',
      value: `${stepsCompleted}/${totalSteps}`,
      color: 'text-green-500',
    },
    {
      icon: Target,
      label: 'Streak',
      value: `🔥 ${streak} day${streak > 1 ? 's' : ''}`,
      color: 'text-orange-500',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-6 space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', damping: 15 }}
          className="text-6xl"
        >
          ✓
        </motion.div>
        <h3 className="text-2xl font-bold text-foreground">Routine Complete!</h3>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        {statItems.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
            className="text-center space-y-1"
          >
            <stat.icon className={`w-5 h-5 mx-auto ${stat.color}`} />
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-sm font-semibold text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Mood Change */}
      {moodChange && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-3 py-4 bg-secondary/20 rounded-xl"
        >
          <span className="text-2xl">{moodEmojis[moodChange.before]}</span>
          <TrendingUp className={`w-5 h-5 ${
            moodChange.change > 0 ? 'text-green-500' : 
            moodChange.change < 0 ? 'text-red-500' : 
            'text-muted-foreground'
          }`} />
          <span className="text-2xl">{moodEmojis[moodChange.after]}</span>
          {moodChange.change > 0 && (
            <span className="text-xs font-medium text-green-500">
              (+{moodChange.change} mood improvement!)
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};
