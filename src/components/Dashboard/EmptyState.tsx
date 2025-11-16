import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GradientText } from '@/components/common/GradientText';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  emoji?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  emoji
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="card-glass p-12 rounded-2xl text-center"
    >
      {/* Animated Icon/Emoji */}
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mb-6 inline-block"
      >
        {emoji ? (
          <span className="text-6xl drop-shadow-lg">{emoji}</span>
        ) : (
          <div className="p-6 rounded-full bg-gradient-primary/10 inline-block hover-lift-strong">
            <Icon className="w-12 h-12 text-primary" />
          </div>
        )}
      </motion.div>

      {/* Title */}
      <GradientText as="h3" className="text-2xl mb-3">
        {title}
      </GradientText>

      {/* Description */}
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {description}
      </p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={onAction}
            className="gradient-primary hover-glow-intense"
            size="lg"
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};
