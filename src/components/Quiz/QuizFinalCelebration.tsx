import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { LottieIcon } from '@/components/LottieIcon';
import fingerHeartDark from '@/assets/lottie/calai/finger_heart_dark.json';

interface QuizFinalCelebrationProps {
  brainType: 'INTENSE' | 'DISTRACTED' | 'DEFIANT';
  onComplete: () => void;
}

const brainTypeGradients = {
  INTENSE: 'from-[#ec4899] to-[#ef4444]',
  DISTRACTED: 'from-[#3b82f6] to-[#8b5cf6]',
  DEFIANT: 'from-[#f97316] to-[#eab308]'
};

export const QuizFinalCelebration = ({ brainType, onComplete }: QuizFinalCelebrationProps) => {
  useEffect(() => {
    // Auto-navigate after 2.5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 bg-white dark:bg-black flex flex-col items-center justify-center"
    >
      {/* Gradient Ring */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="relative"
      >
        {/* Animated Ring */}
        <div className={`absolute inset-0 rounded-full blur-2xl bg-gradient-to-r ${brainTypeGradients[brainType]} opacity-30 animate-pulse`} 
          style={{ 
            width: window.innerWidth < 768 ? '200px' : '280px',
            height: window.innerWidth < 768 ? '200px' : '280px',
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top: '50%'
          }}
        />

        {/* Finger Heart Lottie */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
          className="relative z-10"
        >
          <LottieIcon
            animationData={fingerHeartDark}
            isActive={true}
            size={window.innerWidth < 768 ? 140 : 180}
            loop={true}
            autoplay={true}
          />
        </motion.div>
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-center space-y-3 mt-8 px-6"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black dark:text-white font-relative">
          All done!
        </h2>
        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-md">
          Let's start your journey to calmer, happier parenting
        </p>
      </motion.div>

      {/* Loading Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-12"
      >
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className={`w-2 h-2 rounded-full bg-gradient-to-r ${brainTypeGradients[brainType]}`}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
