import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { LottieIcon } from '@/components/LottieIcon';
import fingerHeartDark from '@/assets/lottie/calai/finger_heart_dark.json';

interface RecommendationItem {
  text: string;
  percentage: number;
}

export const QuizLoadingScreen = () => {
  const [phase, setPhase] = useState<'welcome' | 'loading'>('welcome');
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
    // Welcome phase for 2 seconds
    const welcomeTimer = setTimeout(() => {
      setPhase('loading');
    }, 2000);

    return () => clearTimeout(welcomeTimer);
  }, []);

  useEffect(() => {
    if (phase !== 'loading') return;

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
  }, [phase]);

  return (
    <AnimatePresence mode="wait">
      {phase === 'welcome' ? (
        // Welcome Screen with Hand
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px] py-8 md:py-12 space-y-6 md:space-y-8"
        >
          {/* Hand Lottie */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <LottieIcon
              animationData={fingerHeartDark}
              isActive={true}
              size={window.innerWidth < 768 ? 120 : 180}
              loop={true}
              autoplay={true}
            />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center space-y-3 md:space-y-4 px-4"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-black dark:text-white font-relative">
              Thank you for trusting us
            </h2>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
              Now let's personalize NEP System for you...
            </p>
          </motion.div>

          {/* Privacy Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-center space-y-2 px-6 pt-4 md:pt-8"
          >
            <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">🔒</span>
            </div>
            <p className="text-xs md:text-sm font-semibold text-black dark:text-white">
              Your privacy and security matter to us.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              We promise to always keep your personal information private and secure.
            </p>
          </motion.div>
        </motion.div>
      ) : (
        // Loading Screen with Percentage
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px] py-8 md:py-12 space-y-6 md:space-y-8"
        >
          {/* Giant Percentage */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="text-7xl md:text-8xl lg:text-9xl font-black text-black dark:text-white tracking-tight font-relative">
              {percentage}%
            </div>
          </motion.div>

          {/* Task Title */}
          <motion.h3
            key={currentTask}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl md:text-2xl font-bold text-black dark:text-white text-center font-relative px-4"
          >
            We're setting everything up for you
          </motion.h3>

          {/* Progress Bar with Gradient */}
          <div className="w-full max-w-md px-6">
            <div className="h-2 md:h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
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
            className="text-sm md:text-base text-gray-500 dark:text-gray-400 text-center px-4"
          >
            {currentTask}
          </motion.p>

          {/* Daily Recommendations List */}
          <div className="w-full max-w-md space-y-3 md:space-y-4 px-6 pt-4">
            <h4 className="text-base md:text-lg font-bold text-black dark:text-white mb-3 md:mb-4">
              Daily recommendation for
            </h4>
            {recommendations.map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.4 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-black dark:text-white text-lg">•</span>
                  <span className="text-sm md:text-base text-black dark:text-white">
                    {item.text}
                  </span>
                </div>
                <motion.span
                  key={`${item.text}-${item.percentage}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-sm md:text-base font-bold text-primary"
                >
                  {item.percentage}%
                </motion.span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
