import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { LottieIcon } from '@/components/LottieIcon';
import fingerHeartDark from '@/assets/lottie/calai/finger_heart_dark.json';
import fingerHeartLight from '@/assets/lottie/calai/finger_heart_light.json';
import { useTheme } from '@/contexts/ThemeContext';
import { Sparkles, Star, Heart, CheckCircle2 } from 'lucide-react';

interface QuizFinalCelebrationProps {
  brainType: 'INTENSE' | 'DISTRACTED' | 'DEFIANT';
  onComplete: () => void;
}

const brainTypeGradients = {
  INTENSE: 'from-[#ec4899] to-[#ef4444]',
  DISTRACTED: 'from-[#3b82f6] to-[#8b5cf6]',
  DEFIANT: 'from-[#f97316] to-[#eab308]'
};

const brainTypeEmojis = {
  INTENSE: '🔥',
  DISTRACTED: '⚡',
  DEFIANT: '👑'
};

// Confetti particle component
const ConfettiParticle = ({ delay, color }: { delay: number; color: string }) => {
  const randomX = Math.random() * 100;
  const randomDuration = 2 + Math.random() * 2;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -50,
        x: `${randomX}vw`,
        rotate: 0,
        scale: 0
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: '100vh',
        rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
        scale: [0, 1, 1, 0.5]
      }}
      transition={{
        duration: randomDuration,
        delay: delay,
        ease: 'linear'
      }}
      className="fixed top-0 z-40 pointer-events-none"
      style={{ left: `${randomX}%` }}
    >
      <div
        className="w-3 h-3 rounded-sm"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
};

// Floating emoji animation
const FloatingEmoji = ({ emoji, delay }: { emoji: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0, y: 50 }}
    animate={{
      opacity: [0, 1, 1, 0],
      scale: [0, 1.5, 1, 0.5],
      y: [50, 0, -100, -200]
    }}
    transition={{
      duration: 2.5,
      delay: delay,
      ease: 'easeOut'
    }}
    className="absolute text-4xl"
    style={{
      left: `${20 + Math.random() * 60}%`,
      top: `${40 + Math.random() * 20}%`
    }}
  >
    {emoji}
  </motion.div>
);

export const QuizFinalCelebration = ({ brainType, onComplete }: QuizFinalCelebrationProps) => {
  const { theme } = useTheme();
  const [showConfetti, setShowConfetti] = useState(true);

  // Confetti colors
  const confettiColors = ['#f97316', '#eab308', '#22c55e', '#3b82f6', '#ec4899', '#8b5cf6'];

  useEffect(() => {
    // Auto-navigate after 4.5 seconds - more time to enjoy the celebration
    const timer = setTimeout(() => {
      onComplete();
    }, 4500);

    // Stop confetti after 3 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(confettiTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Confetti particles */}
      {showConfetti && confettiColors.flatMap((color, colorIndex) =>
        [...Array(5)].map((_, i) => (
          <ConfettiParticle
            key={`${colorIndex}-${i}`}
            delay={colorIndex * 0.1 + i * 0.15}
            color={color}
          />
        ))
      )}

      {/* Floating emojis */}
      {['🎉', '✨', '🌟', '💪', brainTypeEmojis[brainType]].map((emoji, i) => (
        <FloatingEmoji key={i} emoji={emoji} delay={0.5 + i * 0.3} />
      ))}

      {/* Animated background glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className={`absolute inset-0 bg-gradient-to-br ${brainTypeGradients[brainType]} opacity-20 blur-3xl`}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Success checkmark ring */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
          className="relative mb-6"
        >
          {/* Pulsing ring */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`absolute inset-0 rounded-full bg-gradient-to-r ${brainTypeGradients[brainType]}`}
            style={{ width: 120, height: 120 }}
          />

          {/* Main circle with Lottie */}
          <div
            className={`relative w-[120px] h-[120px] rounded-full bg-gradient-to-br ${brainTypeGradients[brainType]} flex items-center justify-center shadow-2xl`}
          >
            <LottieIcon
              animationData={theme === 'dark' ? fingerHeartDark : fingerHeartLight}
              isActive={true}
              size={80}
              loop={true}
              autoplay={true}
            />
          </div>

          {/* Orbiting stars */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ rotate: 360 }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'linear'
              }}
              className="absolute inset-0"
              style={{ transform: `rotate(${i * 120}deg)` }}
            >
              <Star
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 text-amber-400 fill-amber-400"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Big emoji */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="text-6xl mb-4"
        >
          {brainTypeEmojis[brainType]}
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center space-y-3 px-6"
        >
          <h2 className="text-4xl md:text-5xl font-black text-foreground">
            All Done!
          </h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Your personalized journey to calmer, happier parenting starts now
          </p>
        </motion.div>

        {/* Mini achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex items-center gap-6 mt-8"
        >
          {[
            { icon: CheckCircle2, label: 'Profile Created' },
            { icon: Sparkles, label: 'Plan Ready' },
            { icon: Heart, label: 'Journey Begins' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 + i * 0.15, type: 'spring' }}
              className="flex flex-col items-center gap-1"
            >
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${brainTypeGradients[brainType]} flex items-center justify-center`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-10"
        >
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${brainTypeGradients[brainType]}`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Loading your dashboard...
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
