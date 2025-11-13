import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Oops! Something went wrong',
  message = "We're having trouble loading this content. Please try again.",
  onRetry,
  onGoHome,
  className,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center space-y-6',
        className
      )}
    >
      {/* Animated error icon */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="relative"
      >
        <div className="absolute inset-0 bg-destructive/20 blur-2xl rounded-full" />
        <div className="relative w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center border-4 border-destructive/30">
          <AlertTriangle className="w-12 h-12 text-destructive" />
        </div>
      </motion.div>

      {/* Error message */}
      <div className="space-y-2 max-w-md">
        <h3 className="text-2xl font-bold text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{message}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap justify-center">
        {onRetry && (
          <Button onClick={onRetry} className="touch-target">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
        {onGoHome && (
          <Button variant="outline" onClick={onGoHome} className="touch-target">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        )}
      </div>
    </motion.div>
  );
}
