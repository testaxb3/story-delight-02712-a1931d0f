import { motion } from 'framer-motion';
import { LottieIcon } from '@/components/LottieIcon';
import fingerHeartDark from '@/assets/lottie/calai/finger_heart_dark.json';
import { Button } from '@/components/ui/button';

interface QuizPreLoadingScreenProps {
  brainType: 'INTENSE' | 'DISTRACTED' | 'DEFIANT';
  onContinue: () => void;
}

const brainTypeGradients = {
  INTENSE: 'from-[#ec4899] to-[#ef4444]',
  DISTRACTED: 'from-[#3b82f6] to-[#8b5cf6]',
  DEFIANT: 'from-[#f97316] to-[#eab308]'
};

export const QuizPreLoadingScreen = ({ brainType, onContinue }: QuizPreLoadingScreenProps) => {
  const handleContinue = () => {
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
    onContinue();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black px-6 py-12 relative"
    >
      {/* Page Number */}
      <div className="fixed top-4 left-4 z-50">
        <div className="w-8 h-8 bg-black/10 dark:bg-white/10 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-black dark:text-white">18</span>
        </div>
      </div>

      {/* Gradient Ring + Finger Heart */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="relative mb-8"
      >
        {/* Animated Ring */}
        <div 
          className={`absolute inset-0 rounded-full blur-2xl bg-gradient-to-r ${brainTypeGradients[brainType]} opacity-30 animate-pulse`}
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

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-center space-y-6 max-w-md"
      >
        <div className="text-4xl md:text-5xl mb-2">🧡</div>
        
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black dark:text-white font-relative leading-tight">
          All done!
        </h2>
        
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
          Time to generate your custom plan!
        </p>
      </motion.div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-12 w-full max-w-md"
      >
        <Button
          onClick={handleContinue}
          className="w-full h-14 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 text-base font-bold rounded-xl"
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
};
