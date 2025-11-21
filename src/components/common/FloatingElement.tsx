import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FloatingElementProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

export const FloatingElement = ({ 
  children, 
  duration = 3,
  delay = 0,
  className 
}: FloatingElementProps) => {
  return (
    <div
      className={cn('animate-float', className)}
      style={{
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`
      }}
    >
      {children}
    </div>
  );
};
