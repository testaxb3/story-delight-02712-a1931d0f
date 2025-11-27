import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TrackerFABProps {
  isEnabled: boolean;
  timeUntilNextLog: number | null; // milliseconds
  onClick: () => void;
}

export function TrackerFAB({ isEnabled, timeUntilNextLog, onClick }: TrackerFABProps) {
  const [countdown, setCountdown] = useState<string>('');

  useEffect(() => {
    if (!timeUntilNextLog || isEnabled) {
      setCountdown('');
      return;
    }

    const updateCountdown = () => {
      const hours = Math.floor(timeUntilNextLog / (1000 * 60 * 60));
      const minutes = Math.floor((timeUntilNextLog % (1000 * 60 * 60)) / (1000 * 60));
      setCountdown(`${hours}h ${minutes}m`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [timeUntilNextLog, isEnabled]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isEnabled ? 'enabled' : 'disabled'}
        initial={{ opacity: 0, scale: 0, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0, y: 100 }}
        className="fixed bottom-28 right-6 z-[150]"
      >
        <Button
          onClick={isEnabled ? onClick : undefined}
          disabled={!isEnabled}
          className={cn(
            "h-14 w-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300",
            isEnabled
              ? "bg-primary text-white hover:bg-primary/90 shadow-primary/30"
              : "bg-muted text-muted-foreground cursor-not-allowed shadow-muted/20"
          )}
        >
          {isEnabled ? (
            <Plus className="w-8 h-8" />
          ) : (
            <Clock className="w-6 h-6" />
          )}
        </Button>
        
        {/* Countdown tooltip */}
        {!isEnabled && countdown && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-16 top-1/2 -translate-y-1/2 bg-card border border-border px-3 py-2 rounded-lg shadow-lg whitespace-nowrap"
          >
            <div className="text-xs font-semibold text-muted-foreground">Next log in</div>
            <div className="text-sm font-bold text-foreground">{countdown}</div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
