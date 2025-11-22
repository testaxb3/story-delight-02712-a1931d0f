import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizCountdownProps {
  onComplete: () => void;
}

export const QuizCountdown = ({ onComplete }: QuizCountdownProps) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    // Haptic feedback on mount
    if (navigator.vibrate) navigator.vibrate(20);

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // Small delay before completion
          return 0;
        }
        
        // Haptic feedback on each count
        if (navigator.vibrate) navigator.vibrate(15);
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-white dark:bg-black flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {count > 0 ? (
          <motion.div
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ 
              duration: 0.5,
              ease: [0.43, 0.13, 0.23, 0.96]
            }}
            className="flex flex-col items-center justify-center"
          >
            {/* Giant Number */}
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.3,
                type: "spring",
                stiffness: 200
              }}
              className="text-[12rem] md:text-[18rem] lg:text-[24rem] font-black text-black dark:text-white font-relative leading-none"
            >
              {count}
            </motion.span>
          </motion.div>
        ) : (
          <motion.div
            key="ready"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4"
          >
            <span className="text-5xl md:text-7xl font-black text-black dark:text-white font-relative">
              Ready!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
