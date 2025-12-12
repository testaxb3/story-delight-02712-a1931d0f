import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StickyHeaderProps {
  title?: string;
  subtitle?: string;
  leftAction?: ReactNode;
  rightActions?: ReactNode;
  showProgress?: boolean;
  progressValue?: number;
  transparent?: boolean;
  static?: boolean;
  children?: ReactNode;
}

export function StickyHeader({
  title,
  subtitle,
  leftAction,
  rightActions,
  showProgress,
  progressValue = 0,
  transparent = false,
  static: isStatic = false,
  children,
}: StickyHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={cn(
        isStatic ? 'relative' : 'sticky top-0',
        'z-50 w-full transition-all duration-300',
        !isStatic && isScrolled && !transparent
          ? 'bg-white/95 dark:bg-background/95 backdrop-blur-xl border-b border-[#F0E6DF] dark:border-border/40 shadow-sm'
          : 'bg-gradient-to-b from-white via-white/95 to-transparent dark:from-background dark:via-background/95 dark:to-transparent'
      )}
    >
      {/* Progress Bar */}
      {showProgress && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted/20">
          <motion.div
            className="h-full bg-gradient-to-r from-[#FF6631] to-[#FFA300]"
            initial={{ width: 0 }}
            animate={{ width: `${progressValue}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Header Content */}
      <div
        className="px-5 pb-4"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 16px)'
        }}
      >
        {children ? (
          children
        ) : (
          <>
            {/* Top Row: Left Action + Right Actions */}
            {(leftAction || rightActions) && (
              <div className="flex items-center justify-between mb-3">
                {leftAction}
                {rightActions}
              </div>
            )}

            {/* Title Section */}
            {title && (
              <div className="space-y-1">
                <h1 className="text-4xl font-bold tracking-tight text-[#393939] dark:text-foreground">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-base text-[#8D8D8D] dark:text-muted-foreground">{subtitle}</p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom fade when not scrolled to blend content */}
      {!isScrolled && !isStatic && (
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-b from-transparent to-white/50 dark:to-background/50 pointer-events-none" />
      )}
    </motion.header>
  );
}
