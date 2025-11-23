import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface RecommendationItem {
  text: string;
  percentage: number;
}

interface QuizLoadingScreenProps {
  onComplete?: () => void;
}

export const QuizLoadingScreen = ({ onComplete }: QuizLoadingScreenProps = {}) => {
  const [percentage, setPercentage] = useState(0);
  const [checklistItems, setChecklistItems] = useState([
    { text: 'Analyzing brain profile', completed: false },
    { text: 'Selecting scripts', completed: false },
    { text: 'Preparing videos', completed: false },
    { text: 'Customizing ebooks', completed: false },
    { text: 'Building roadmap', completed: false }
  ]);

  // ✅ Use ref to prevent re-triggering useEffect when onComplete changes
  const onCompleteRef = useRef(onComplete);
  
  // Update ref when onComplete changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

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

      // Complete checklist items based on progress
      setChecklistItems((prev) =>
        prev.map((item, index) => ({
          ...item,
          completed: progress >= (index + 1) / prev.length
        }))
      );

      if (currentStep >= steps) {
        clearInterval(percentTimer);
        setPercentage(100);
        setChecklistItems((prev) =>
          prev.map((item) => ({ ...item, completed: true }))
        );
        
        // Call onComplete after a short delay using ref
        if (onCompleteRef.current) {
          setTimeout(() => onCompleteRef.current?.(), 500);
        }
      }
    }, interval);

    return () => clearInterval(percentTimer);
  }, []); // ✅ Empty dependency array - run only once

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black px-6 py-12 relative"
    >
      {/* Page Number */}
      <div className="fixed top-4 left-4 z-50">
        <div className="w-8 h-8 bg-black/10 dark:bg-white/10 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-black dark:text-white">19</span>
        </div>
      </div>

      {/* Giant Percentage */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="text-[8rem] md:text-[10rem] lg:text-[12rem] font-black text-black dark:text-white tracking-tight font-relative leading-none">
          {percentage}%
        </div>
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl lg:text-4xl font-bold text-black dark:text-white text-center font-relative px-6 max-w-2xl leading-tight mb-8"
      >
        We're setting everything up for you
      </motion.h3>

      {/* Progress Bar */}
      <div className="w-full max-w-2xl px-6 md:px-8 mb-12">
        <div className="h-3 md:h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="w-full max-w-md space-y-4 px-6">
        {checklistItems.map((item, index) => (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              item.completed 
                ? 'bg-black dark:bg-white border-black dark:border-white' 
                : 'border-gray-300 dark:border-gray-700'
            }`}>
              {item.completed && (
                <svg className="w-3 h-3 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={`text-base md:text-lg transition-colors ${
              item.completed 
                ? 'text-black dark:text-white font-medium' 
                : 'text-gray-400 dark:text-gray-600'
            }`}>
              {item.text}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
