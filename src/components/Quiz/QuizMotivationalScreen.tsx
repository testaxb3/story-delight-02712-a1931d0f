import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { QuizComparisonChart } from './QuizComparisonChart';
import { LottieIcon } from '@/components/LottieIcon';
import clapDark from '@/assets/lottie/calai/clap_dark.json';

interface QuizMotivationalScreenProps {
  milestone: 25 | 50 | 75;
  brainType?: 'INTENSE' | 'DISTRACTED' | 'DEFIANT';
  onContinue: () => void;
}

export const QuizMotivationalScreen = ({ milestone, brainType, onContinue }: QuizMotivationalScreenProps) => {
  // For 75%, show comparison chart if brainType is available
  if (milestone === 75 && brainType) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-[50vh] md:min-h-[60vh] py-8 md:py-12 space-y-6 md:space-y-8"
      >
        <QuizComparisonChart brainType={brainType} />
        
        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Button
            onClick={onContinue}
            size="lg"
            className="rounded-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 px-8 md:px-12 py-5 md:py-6 text-base md:text-lg font-semibold font-relative"
          >
            Continue
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  // For 25% and 50%, show regular motivational content
  const content = {
    25: {
      title: "You're doing great!",
      subtitle: "Keep going, we're building your personalized profile...",
    },
    50: {
      title: "Halfway there!",
      subtitle: "Your insights are helping us personalize NEP System just for you",
    },
    75: {
      title: "Almost done!",
      subtitle: "Just a few more questions and we'll have everything we need",
    },
  };

  const { title, subtitle } = content[milestone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[50vh] md:min-h-[60vh] px-4 py-8 md:py-12 space-y-6 md:space-y-8"
    >
      {/* Celebration Lottie */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
      >
        <LottieIcon
          animationData={clapDark}
          isActive={true}
          size={window.innerWidth < 768 ? 80 : 120}
          loop={false}
          autoplay={true}
        />
      </motion.div>

      {/* Title with Relative Font */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-3xl md:text-4xl lg:text-5xl font-black text-center text-black dark:text-white max-w-2xl font-relative px-4"
      >
        {title}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-base md:text-lg lg:text-xl text-gray-500 dark:text-gray-400 text-center max-w-xl px-4"
      >
        {subtitle}
      </motion.p>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Button
          onClick={onContinue}
          size="lg"
          className="rounded-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 px-8 md:px-12 py-5 md:py-6 text-base md:text-lg font-semibold font-relative"
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
};
