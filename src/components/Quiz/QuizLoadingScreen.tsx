import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface ChecklistItem {
  text: string;
  completed: boolean;
}

export const QuizLoadingScreen = () => {
  const [percentage, setPercentage] = useState(0);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { text: 'Analyzing answers...', completed: false },
    { text: 'Calculating brain profile...', completed: false },
    { text: 'Matching strategies...', completed: false },
    { text: 'Personalizing recommendations...', completed: false }
  ]);

  useEffect(() => {
    // Animate percentage from 0 to 100
    const percentInterval = setInterval(() => {
      setPercentage((prev) => {
        if (prev >= 100) {
          clearInterval(percentInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    // Animate checklist items
    const checklistTimers = [
      setTimeout(() => updateChecklist(0), 500),
      setTimeout(() => updateChecklist(1), 1200),
      setTimeout(() => updateChecklist(2), 1900),
      setTimeout(() => updateChecklist(3), 2600)
    ];

    return () => {
      clearInterval(percentInterval);
      checklistTimers.forEach(clearTimeout);
    };
  }, []);

  const updateChecklist = (index: number) => {
    setChecklist((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, completed: true } : item
      )
    );
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-12">
      {/* Giant Percentage */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-primary/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="relative text-8xl md:text-9xl font-black bg-gradient-to-br from-primary via-accent to-primary bg-clip-text text-transparent">
          {percentage}%
        </div>
      </motion.div>

      {/* Progress Bar */}
      <div className="w-full max-w-md">
        <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="w-full max-w-md space-y-4">
        {checklist.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15, duration: 0.4 }}
            className="flex items-center gap-4"
          >
            {/* Icon */}
            <div className="flex-shrink-0">
              {item.completed ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </motion.div>
              ) : (
                <Loader2 className="w-6 h-6 text-muted-foreground/50 animate-spin" />
              )}
            </div>

            {/* Text */}
            <span
              className={`text-base font-medium transition-colors ${
                item.completed ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {item.text}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
