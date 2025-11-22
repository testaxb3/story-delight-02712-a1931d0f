import { motion } from 'framer-motion';
import { LottieIcon } from '@/components/LottieIcon';
import clapDark from '@/assets/lottie/calai/clap_dark.json';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface QuizThankYouScreenProps {
  onContinue: () => void;
}

export const QuizThankYouScreen = ({ onContinue }: QuizThankYouScreenProps) => {
  const { theme } = useTheme();
  
  const handleContinue = () => {
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
    onContinue();
  };

  const progress = 30;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col bg-white dark:bg-black"
    >
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="h-1 bg-gray-200 dark:bg-gray-800">
          <motion.div
            className="h-full bg-black dark:bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="px-4 h-14 flex items-center justify-end">
          {/* Page Number - Dynamic from Quiz parent */}
          <div className="w-8 h-8 bg-black/10 dark:bg-white/10 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-black dark:text-white">7</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-24">
        {/* Clapping Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
          className="mb-8"
        >
          <LottieIcon
            animationData={clapDark}
            isActive={true}
            size={window.innerWidth < 768 ? 100 : 140}
            loop={true}
            autoplay={true}
          />
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center space-y-6 max-w-md"
        >
          <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white font-relative leading-tight">
            Thank you for trusting us
          </h2>
          
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
            Now let's personalize NEP System for you...
          </p>

          <div className="pt-4 bg-gray-50 dark:bg-gray-900 rounded-2xl px-6 py-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Your privacy and security matter to us.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              We promise to always keep your personal information private and secure.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 p-4 z-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button
            onClick={handleContinue}
            className="w-full h-14 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 text-base font-bold rounded-xl shadow-xl hover:shadow-2xl transition-shadow"
          >
            Continue
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
