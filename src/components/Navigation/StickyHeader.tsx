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
        'sticky top-0 z-50 w-full transition-all duration-200',
        'pt-[env(safe-area-inset-top)]',
        isScrolled && !transparent
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm'
          : 'bg-transparent'
      )}
      initial={false}
      animate={{
        backgroundColor: isScrolled && !transparent ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0)',
      }}
    >
      {/* Progress Bar */}
      {showProgress && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted/20">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progressValue}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Header Content */}
      <div className="px-5 py-4">
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
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-base text-muted-foreground">{subtitle}</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </motion.header>
  );
}
