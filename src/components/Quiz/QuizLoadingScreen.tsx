import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center space-y-16 py-12 md:py-20">
      {/* Giant Percentage - BLACK & WHITE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-9xl md:text-[12rem] font-black text-black dark:text-white tracking-tighter">
          {percentage}%
        </div>
      </motion.div>

      {/* Progress Bar - BLACK */}
      <div className="w-full max-w-md px-4">
        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-black dark:bg-white rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Checklist - Minimalist */}
      <div className="w-full max-w-md space-y-6 px-4">
        {checklist.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="flex items-center gap-4"
          >
            {/* Icon - Black & White only */}
            <div className="flex-shrink-0">
              {item.completed ? (
                <CheckCircle2 className="w-6 h-6 text-black dark:text-white" strokeWidth={2} />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-700" />
              )}
            </div>

            {/* Text */}
            <span
              className={`text-base font-medium transition-colors ${
                item.completed 
                  ? 'text-black dark:text-white' 
                  : 'text-gray-400 dark:text-gray-600'
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
