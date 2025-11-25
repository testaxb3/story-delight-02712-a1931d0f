import { motion } from 'framer-motion';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Star } from 'lucide-react';

interface CelebrationAnimationProps {
  onComplete: () => void;
  streak?: number;
  isNewRecord?: boolean;
}

export const CelebrationAnimation = ({ 
  onComplete, 
  streak = 1,
  isNewRecord = false 
}: CelebrationAnimationProps) => {
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    // Enhanced confetti with more particles
    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8B94'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8B94'],
      });

      // Center burst for new records
      if (isNewRecord) {
        confetti({
          particleCount: 3,
          angle: 90,
          spread: 360,
          origin: { x: 0.5, y: 0.5 },
          colors: ['#FFD700', '#FFA500', '#FF6B6B'],
        });
      }

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    const timer = setTimeout(onComplete, duration);
    return () => clearTimeout(timer);
  }, [onComplete, isNewRecord]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 px-6"
      >
        {/* Main emoji */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-8xl"
        >
          {isNewRecord ? '🏆' : '🎉'}
        </motion.div>

        {/* Title */}
        <motion.h2 
          className="text-5xl font-bold text-foreground"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isNewRecord ? 'New Record!' : 'Amazing!'}
        </motion.h2>

        {/* Subtitle */}
        <motion.p 
          className="text-2xl text-muted-foreground"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Routine completed!
        </motion.p>

        {/* Streak badge */}
        {streak > 1 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', damping: 15 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold text-xl"
          >
            <motion.span
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              🔥
            </motion.span>
            {streak} Day Streak!
          </motion.div>
        )}

        {/* Sparkles */}
        <motion.div className="flex justify-center gap-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [-10, 10, -10],
                rotate: [0, 180, 360],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              {i % 2 === 0 ? (
                <Sparkles className="w-6 h-6 text-yellow-400" />
              ) : (
                <Star className="w-6 h-6 text-orange-400 fill-current" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
