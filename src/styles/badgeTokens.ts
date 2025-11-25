// Badge Design Tokens - Apple Standard

export const badgeSize = {
  sm: { width: 60, height: 60 },
  md: { width: 70, height: 70 },
  lg: { width: 80, height: 80 },
  xl: { width: 95, height: 95 },
  featured: { width: 120, height: 120 }
} as const;

export const badgeSizeClasses = {
  sm: 'w-[60px] h-[60px]',
  md: 'w-[70px] h-[70px]',
  lg: 'w-[80px] h-[80px]',
  xl: 'w-[95px] h-[95px]',
  featured: 'w-[120px] h-[120px]'
} as const;

export const badgeRarity = {
  common: {
    size: badgeSize.md,
    sizeClass: badgeSizeClasses.md,
    glow: 'shadow-md',
    ringWidth: 2,
    glowColor: 'rgba(255,255,255,0.2)'
  },
  rare: {
    size: badgeSize.lg,
    sizeClass: badgeSizeClasses.lg,
    glow: 'shadow-lg shadow-primary/20',
    ringWidth: 3,
    glowColor: 'rgba(255,255,255,0.3)'
  },
  epic: {
    size: badgeSize.xl,
    sizeClass: badgeSizeClasses.xl,
    glow: 'shadow-xl shadow-primary/40',
    ringWidth: 4,
    glowColor: 'rgba(255,255,255,0.5)'
  },
  legendary: {
    size: badgeSize.featured,
    sizeClass: badgeSizeClasses.featured,
    glow: 'shadow-2xl shadow-primary/60',
    ringWidth: 5,
    glowColor: 'rgba(255,255,255,0.7)'
  }
} as const;

export const categoryGradients: Record<string, string> = {
  streak: 'from-orange-500 to-red-500',
  scripts: 'from-purple-500 to-blue-500',
  videos: 'from-pink-500 to-purple-500',
  tracker: 'from-green-500 to-emerald-500',
  community: 'from-blue-500 to-cyan-500',
  special: 'from-yellow-500 to-amber-500'
};

export const categoryColors: Record<string, { from: string; to: string }> = {
  streak: { from: '#f97316', to: '#dc2626' },
  scripts: { from: '#a855f7', to: '#3b82f6' },
  videos: { from: '#ec4899', to: '#a855f7' },
  tracker: { from: '#10b981', to: '#059669' },
  community: { from: '#3b82f6', to: '#06b6d4' },
  special: { from: '#eab308', to: '#f59e0b' }
};

// Easing function for smooth animations (Apple-style)
export const easeOutQuart = (t: number): number => {
  return 1 - Math.pow(1 - t, 4);
};

export const easeOutCubic = (t: number): number => {
  return 1 - Math.pow(1 - t, 3);
};
