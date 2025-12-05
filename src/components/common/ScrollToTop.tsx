import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';
import { cn } from '@/lib/utils';

interface ScrollToTopProps {
  threshold?: number;
  className?: string;
  offset?: number; // Bottom offset from safe area
}

export function ScrollToTop({ threshold = 400, className, offset = 140 }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { triggerHaptic } = useHaptic();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsVisible(scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = useCallback(() => {
    triggerHaptic('medium');
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [triggerHaptic]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={scrollToTop}
          className={cn(
            'fixed right-4 z-40 w-12 h-12 rounded-full',
            'bg-primary/90 backdrop-blur-sm text-primary-foreground',
            'flex items-center justify-center',
            'shadow-lg shadow-primary/25',
            'active:scale-95 transition-transform',
            'border border-primary/20',
            className
          )}
          style={{ bottom: `calc(env(safe-area-inset-bottom) + ${offset}px)` }}
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
