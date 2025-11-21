import { ReactNode, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  glow?: boolean;
  delay?: number;
}

export const AnimatedCard = ({ 
  children, 
  hover = true,
  glow = false,
  delay = 0,
  className,
  ...props 
}: AnimatedCardProps) => {
  return (
    <div
      className={cn(
        'bg-card border border-border rounded-2xl p-6',
        'transition-all duration-300',
        'animate-in fade-in slide-in-from-bottom-4',
        hover && 'hover:shadow-lg hover:-translate-y-1',
        glow && 'hover:shadow-primary/20',
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  );
};
