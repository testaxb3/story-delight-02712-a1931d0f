import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface RecommendationItem {
  text: string;
  percentage: number;
}

export const QuizLoadingScreen = () => {
  const [percentage, setPercentage] = useState(0);
  const [currentTask, setCurrentTask] = useState('Customizing parenting plan...');
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([
    { text: 'Scripts', percentage: 0 },
    { text: 'Videos', percentage: 0 },
    { text: 'Ebooks', percentage: 0 },
    { text: 'Strategies', percentage: 0 },
    { text: 'Brain Profile', percentage: 0 }
  ]);

  useEffect(() => {
    // Animate percentage from 0 to 100
    const duration = 3000;
    const steps = 100;
    const interval = duration / steps;

    let currentStep = 0;
    const percentTimer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setPercentage(Math.floor(100 * progress));

      // Update task text based on progress
      if (progress < 0.3) {
        setCurrentTask('Customizing parenting plan...');
      } else if (progress < 0.6) {
        setCurrentTask('Building your dashboard...');
      } else if (progress < 0.9) {
        setCurrentTask('Preparing personalized content...');
      } else {
        setCurrentTask('Almost ready...');
      }

      // Animate recommendations
      setRecommendations((prev) =>
        prev.map((item, index) => ({
          ...item,
          percentage: Math.min(100, Math.floor(progress * 100 + index * 5))
        }))
      );

      if (currentStep >= steps) {
        clearInterval(percentTimer);
        setPercentage(100);
        setRecommendations((prev) =>
          prev.map((item) => ({ ...item, percentage: 100 }))
        );
      }
    }, interval);

    return () => clearInterval(percentTimer);
  }, []);

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center min-h-[500px] md:min-h-[600px] py-12 md:py-16 space-y-8 md:space-y-10"
      >
          {/* Giant Percentage */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-4 md:mb-6"
          >
            <div className="text-[8rem] md:text-[10rem] lg:text-[12rem] font-black text-black dark:text-white tracking-tight font-relative leading-none">
              {percentage}%
            </div>
          </motion.div>

          {/* Task Title */}
          <motion.h3
            key={currentTask}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-black dark:text-white text-center font-relative px-6 max-w-2xl leading-tight"
          >
            We're setting everything up for you
          </motion.h3>

          {/* Progress Bar with Gradient */}
          <div className="w-full max-w-2xl px-6 md:px-8 my-4 md:my-6">
            <div className="h-3 md:h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Current Task Description */}
          <motion.p
            key={currentTask}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-base md:text-lg text-gray-500 dark:text-gray-400 text-center px-6 max-w-xl"
          >
            {currentTask}
          </motion.p>

          {/* Daily Recommendations List */}
          <div className="w-full max-w-2xl space-y-4 md:space-y-5 px-6 md:px-8 pt-6 md:pt-8">
            <h4 className="text-lg md:text-xl font-bold text-black dark:text-white mb-4 md:mb-6">
              Daily recommendation for
            </h4>
            {recommendations.map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.4 }}
                className="flex items-center justify-between py-1"
              >
                <div className="flex items-center gap-3">
                  <span className="text-black dark:text-white text-xl">•</span>
                  <span className="text-base md:text-lg text-black dark:text-white">
                    {item.text}
                  </span>
                </div>
                <motion.span
                  key={`${item.text}-${item.percentage}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-base md:text-lg font-bold text-primary"
                >
                  {item.percentage}%
                </motion.span>
              </motion.div>
            ))}
          </div>
      </motion.div>
  );
};
