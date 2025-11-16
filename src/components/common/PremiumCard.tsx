import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PremiumCardProps {
  children: ReactNode;
  variant?: 'elevated' | 'glass' | 'gradient' | 'default';
  hover?: boolean | 'default' | 'strong';
  glow?: boolean | 'default' | 'intense';
  className?: string;
}

export const PremiumCard = ({ 
  children, 
  variant = 'elevated',
  hover = false,
  glow = false,
  className 
}: PremiumCardProps) => {
  const baseClasses = 'rounded-2xl p-6 transition-all duration-300';
  
  const variantClasses = {
    elevated: 'card-elevated',
    glass: 'card-glass',
    gradient: 'card-gradient',
    default: 'bg-card border border-border',
  };

  const hoverClasses = 
    hover === 'strong' ? 'hover-lift-strong' : 
    hover === 'default' || hover === true ? 'hover-lift' : 
    '';
    
  const glowClasses = 
    glow === 'intense' ? 'hover-glow-intense' : 
    glow === 'default' || glow === true ? 'hover-glow' : 
    '';

  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        hoverClasses,
        glowClasses,
        className
      )}
    >
      {children}
    </div>
  );
};
