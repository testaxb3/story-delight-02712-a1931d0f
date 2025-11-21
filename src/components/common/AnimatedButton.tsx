import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'ghost' | 'outline' | 'premium';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  icon?: ReactNode;
}

export const AnimatedButton = ({ 
  children, 
  variant = 'default',
  size = 'default',
  loading = false,
  icon,
  className,
  disabled,
  ...props 
}: AnimatedButtonProps) => {
  const isDisabled = disabled || loading;

  if (variant === 'premium') {
    return (
      <button
        className={cn(
          'group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold',
          'bg-gradient-to-r from-primary via-primary to-accent',
          'text-white shadow-lg transition-all duration-300',
          'hover:shadow-xl hover:scale-105 active:scale-95',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
          'overflow-hidden',
          size === 'sm' && 'px-4 py-2 text-sm',
          size === 'lg' && 'px-8 py-4 text-lg',
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {/* Animated shine effect */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        
        {/* Content */}
        <span className="relative flex items-center gap-2">
          {loading && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {!loading && icon && <span className="group-hover:scale-110 transition-transform">{icon}</span>}
          {children}
        </span>
      </button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isDisabled}
      className={cn(
        'transition-all duration-300 hover:scale-105 active:scale-95',
        'disabled:hover:scale-100',
        className
      )}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      )}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </Button>
  );
};
