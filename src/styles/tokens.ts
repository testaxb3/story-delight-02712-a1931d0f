/**
 * Design Tokens for NEP System
 * Apple-inspired spacing, typography, and radius tokens
 */

export const spacing = {
  xs: 'var(--spacing-xs, 0.5rem)',
  sm: 'var(--spacing-sm, 1rem)',
  md: 'var(--spacing-md, 1.5rem)',
  lg: 'var(--spacing-lg, 2rem)',
  xl: 'var(--spacing-xl, 3rem)',
  '2xl': 'var(--spacing-2xl, 4rem)',
} as const;

export const typography = {
  display: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
  heading: 'text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight',
  title: 'text-xl md:text-2xl font-bold',
  body: 'text-base md:text-lg',
  caption: 'text-sm md:text-base',
  small: 'text-xs md:text-sm',
} as const;

export const radius = {
  sm: 'rounded-xl',    // 12px - small items
  md: 'rounded-2xl',   // 16px - standard cards
  lg: 'rounded-3xl',   // 24px - panels
  xl: 'rounded-hero',  // 28px - hero cards
  full: 'rounded-full',
} as const;

export const glow = {
  orange: 'shadow-glow-orange',
  indigo: 'shadow-glow-indigo',
} as const;

export const shadow = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg shadow-primary/20',
  xl: 'shadow-xl shadow-primary/30',
} as const;

export const animation = {
  fast: 'duration-150',
  base: 'duration-300',
  slow: 'duration-500',
  slowest: 'duration-700',
} as const;
