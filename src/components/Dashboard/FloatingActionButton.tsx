import { memo } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';
import { SPRING } from './animations';

interface FloatingActionButtonProps {
  onPress: () => void;
}

export const FloatingActionButton = memo(function FloatingActionButton({
  onPress,
}: FloatingActionButtonProps) {
  const { triggerHaptic } = useHaptic();

  const handlePress = () => {
    triggerHaptic('medium');
    onPress();
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, ...SPRING.bouncy }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handlePress}
      className="fixed z-50 w-[60px] h-[60px] rounded-full flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 shadow-fab"
      style={{
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 6rem)',
        right: '1.25rem',
      }}
    >
      {/* Pulsing glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-full bg-orange-500 blur-xl"
      />

      <Plus className="relative z-10 w-7 h-7 text-white dark:text-white" strokeWidth={2.5} />
    </motion.button>
  );
});
