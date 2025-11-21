import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface QuizPostSpeedMotivationalScreenProps {
  selectedGoals: string[];
  onContinue: () => void;
}

const goalMessages = {
  tantrums: {
    title: "Reducing tantrums",
    subtitle: "is a realistic target. It's not hard at all!",
    stat: "87% of parents say the change is obvious after using NEP System",
    color: "text-[#ec4899]"
  },
  sleep: {
    title: "Better sleep routines",
    subtitle: "are achievable faster than you think!",
    stat: "91% of families see improved bedtime within 2 weeks",
    color: "text-[#3b82f6]"
  },
  eating: {
    title: "Mealtime peace",
    subtitle: "is not a dream. It's totally doable!",
    stat: "84% of parents report calmer meals in the first month",
    color: "text-[#f97316]"
  },
  focus: {
    title: "Better focus",
    subtitle: "is absolutely within reach!",
    stat: "88% of children show improved concentration",
    color: "text-[#8b5cf6]"
  },
  family: {
    title: "Stronger family bonds",
    subtitle: "start happening sooner than you expect!",
    stat: "93% of families feel more connected after 3 weeks",
    color: "text-[#eab308]"
  },
  transitions: {
    title: "Smoother transitions",
    subtitle: "are totally achievable with the right strategies!",
    stat: "86% of parents report easier daily transitions in 2 weeks",
    color: "text-[#06b6d4]"
  },
  school: {
    title: "Better school behavior",
    subtitle: "is within reach with consistent support!",
    stat: "82% of children show improved school behavior in 3 weeks",
    color: "text-[#10b981]"
  }
};

export const QuizPostSpeedMotivationalScreen = ({ selectedGoals, onContinue }: QuizPostSpeedMotivationalScreenProps) => {
  const handleContinue = () => {
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
    onContinue();
  };

  // Pick the first selected goal or default to tantrums
  const primaryGoal = selectedGoals[0] || 'tantrums';
  const message = goalMessages[primaryGoal as keyof typeof goalMessages] || goalMessages.tantrums;

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
          <span className="text-xs font-bold text-black dark:text-white">5</span>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center space-y-8 max-w-2xl"
      >
        {/* Main Message */}
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black dark:text-white font-relative leading-tight">
            <span className={message.color}>{message.title}</span>
            <br />
            <span className="text-black dark:text-white">{message.subtitle}</span>
          </h2>
        </div>

        {/* Statistic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 md:p-8"
        >
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {message.stat}
          </p>
        </motion.div>

        {/* Encouragement */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-sm md:text-base text-gray-500 dark:text-gray-500"
        >
          You're making the right choice for your family 💙
        </motion.p>
      </motion.div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-12 w-full max-w-md"
      >
        <Button
          onClick={handleContinue}
          className="w-full h-14 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 text-base font-bold rounded-xl shadow-xl hover:shadow-2xl transition-shadow"
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
};
