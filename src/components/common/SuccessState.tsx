import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface SuccessStateProps {
  title?: string;
  message?: string;
  onContinue?: () => void;
  actionLabel?: string;
  showConfetti?: boolean;
  className?: string;
}

export function SuccessState({
  title = 'Success! 🎉',
  message = 'Your action was completed successfully.',
  onContinue,
  actionLabel = 'Continue',
  showConfetti = true,
  className,
}: SuccessStateProps) {
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    if (showConfetti) {
      setShowSparkles(true);
      const timer = setTimeout(() => setShowSparkles(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center space-y-6 relative',
        className
      )}
    >
      {/* Animated sparkles background */}
      {showSparkles && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.cos((i * Math.PI) / 4) * 100,
                y: Math.sin((i * Math.PI) / 4) * 100,
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="absolute"
            >
              <Sparkles className="w-6 h-6 text-warning" />
            </motion.div>
          ))}
        </>
      )}

      {/* Success icon with pulse */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="relative z-10"
      >
        <div className="absolute inset-0 bg-success/20 blur-2xl rounded-full animate-pulse" />
        <div className="relative w-24 h-24 rounded-full bg-success/10 flex items-center justify-center border-4 border-success/30">
          <CheckCircle2 className="w-12 h-12 text-success" />
        </div>
      </motion.div>

      {/* Success message */}
      <div className="space-y-2 max-w-md relative z-10">
        <h3 className="text-2xl font-bold text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{message}</p>
      </div>

      {/* Action */}
      {onContinue && (
        <Button onClick={onContinue} size="lg" className="touch-target relative z-10">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
