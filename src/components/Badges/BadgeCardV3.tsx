/**
 * BADGE CARD V3 - Premium Redesign
 * Apple Watch inspired with rarity system, 3D gradients, shine effects
 * GPU-accelerated animations, holographic rings for legendary badges
 */

import { memo, useMemo, useCallback, useId } from 'react';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getBadgeIcon } from './BadgeIconMap';
import { BADGE_RARITY_CONFIG } from '@/types/achievements';
import type { Badge, BadgeRarity } from '@/types/achievements';

interface BadgeCardV3Props {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg' | 'featured';
  onClick?: (badge: Badge) => void;
  onUnlock?: () => void;
}

const SIZE_CLASSES = {
  sm: 'w-16 h-16',
  md: 'w-22 h-22',
  lg: 'w-28 h-28',
  featured: 'w-36 h-36'
} as const;

const ICON_SIZE_CLASSES = {
  sm: 'w-7 h-7',
  md: 'w-9 h-9',
  lg: 'w-12 h-12',
  featured: 'w-16 h-16'
} as const;

// Rarity Visual Config - Premium Edition
const RARITY_VISUALS = {
  common: {
    ringGradient: 'from-gray-400 to-gray-500',
    bgGradient: 'from-gray-300 to-gray-400',
    glowColor: 'rgba(156, 163, 175, 0.3)',
    ringWidth: 2,
    hasShine: false,
    hasPulse: false
  },
  rare: {
    ringGradient: 'from-blue-400 via-blue-500 to-blue-600',
    bgGradient: 'from-blue-400 to-blue-600',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    ringWidth: 3,
    hasShine: true,
    hasPulse: true
  },
  epic: {
    ringGradient: 'from-purple-400 via-fuchsia-500 to-pink-500',
    bgGradient: 'from-purple-500 to-pink-600',
    glowColor: 'rgba(192, 38, 211, 0.7)',
    ringWidth: 4,
    hasShine: true,
    hasPulse: true
  },
  legendary: {
    ringGradient: 'from-yellow-300 via-amber-400 to-orange-500',
    bgGradient: 'from-yellow-400 via-orange-500 to-red-500',
    glowColor: 'rgba(251, 146, 60, 0.8)',
    ringWidth: 5,
    hasShine: true,
    hasPulse: true
  }
} as const;

// Static gradient color mappings (avoid dynamic Tailwind classes for SVG)
const GRADIENT_COLORS: Record<string, [string, string, string?]> = {
  'from-gray-400 to-gray-500': ['#9ca3af', '#6b7280'],
  'from-blue-400 to-blue-500': ['#60a5fa', '#3b82f6'],
  'from-purple-400 to-purple-500': ['#c084fc', '#a855f7'],
  'from-orange-400 to-orange-500': ['#fb923c', '#f97316'],
  'from-blue-400 via-blue-500 to-blue-600': ['#60a5fa', '#3b82f6', '#2563eb'],
  'from-purple-400 via-purple-500 to-pink-500': ['#c084fc', '#a855f7', '#ec4899'],
  'from-yellow-300 via-orange-400 to-amber-500': ['#fde047', '#fb923c', '#f59e0b'],
};

export const BadgeCardV3 = memo(({ badge, size = 'md', onClick, onUnlock }: BadgeCardV3Props) => {
  const uniqueId = useId();
  const IconComponent = getBadgeIcon(badge.icon);
  const rarityConfig = BADGE_RARITY_CONFIG[badge.rarity as BadgeRarity];
  const rarityVisual = RARITY_VISUALS[badge.rarity as BadgeRarity] || RARITY_VISUALS.common;

  const progressPercent = useMemo(() => {
    return badge.progress ? badge.progress.percentage : 0;
  }, [badge.progress]);

  const circumference = useMemo(() => 2 * Math.PI * 48, []);

  const strokeDashoffset = useMemo(() => {
    return circumference * (1 - progressPercent / 100);
  }, [circumference, progressPercent]);

  const handleClick = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(badge.unlocked ? [20] : [50, 30, 50]);
    }

    if (onClick) {
      onClick(badge);
    } else if (!badge.unlocked) {
      toast.info(`${badge.name} is locked`, {
        description: badge.progress
          ? `Progress: ${badge.progress.current}/${badge.progress.required} ${badge.progress.label}`
          : badge.description,
        duration: 2000
      });
    }
  }, [badge, onClick]);

  const bgGradient = useMemo(() => {
    if (!badge.unlocked) {
      return 'linear-gradient(135deg, hsl(var(--muted)), hsl(var(--muted-foreground) / 0.3))';
    }

    // Premium multi-color gradients for each category
    const categoryGradients: Record<string, string> = {
      streak: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff4444 100%)',
      scripts: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #6b8dd6 100%)',
      videos: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #8b5cf6 100%)',
      tracker: 'linear-gradient(135deg, #11998e 0%, #38ef7d 50%, #0cebeb 100%)',
      community: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 50%, #fc466b 100%)',
      special: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ffd93d 100%)'
    };

    return categoryGradients[badge.category] || categoryGradients.special;
  }, [badge.category, badge.unlocked]);

  // Progress ring color transition (gray → color)
  const progressRingColor = useMemo(() => {
    if (progressPercent < 30) return 'from-gray-400 to-gray-500';
    if (progressPercent < 60) return 'from-blue-400 to-blue-500';
    if (progressPercent < 90) return 'from-purple-400 to-purple-500';
    return 'from-orange-400 to-orange-500';
  }, [progressPercent]);

  const progressColors = GRADIENT_COLORS[progressRingColor] || ['#9ca3af', '#6b7280'];
  const ringColors = GRADIENT_COLORS[rarityVisual.ringGradient] || ['#9ca3af', '#6b7280'];

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            className={`
              relative flex flex-col items-center gap-3
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
              rounded-3xl p-2 transition-all duration-300
              ${badge.unlocked ? 'hover:scale-110 active:scale-95' : 'active:scale-95'}
            `}
            aria-label={`${badge.name}. ${badge.unlocked ? 'Unlocked' : `Locked. Progress: ${Math.round(progressPercent)}%`}`}
            style={{
              willChange: badge.unlocked ? 'transform' : 'auto'
            }}
          >
            <div className={`relative ${SIZE_CLASSES[size]}`}>
              {/* LOCKED: Progress Ring with gradient transition */}
              {!badge.unlocked && (
                <svg
                  className="absolute inset-0 -rotate-90 w-full h-full"
                  viewBox="0 0 100 100"
                  style={{ willChange: 'transform' }}
                >
                  {/* Background ring */}
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    stroke="hsl(var(--border))"
                    strokeWidth={rarityConfig.ringWidth}
                    fill="none"
                    opacity="0.2"
                  />
                  {/* Progress ring */}
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    stroke={`url(#gradient-progress-${uniqueId})`}
                    strokeWidth={rarityConfig.ringWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{
                      transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)',
                      willChange: 'stroke-dashoffset',
                      filter: progressPercent > 70 ? 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.6))' : 'none'
                    }}
                  />
                  <defs>
                    <linearGradient id={`gradient-progress-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={progressColors[0]} />
                      <stop offset="100%" stopColor={progressColors[1]} />
                    </linearGradient>
                  </defs>
                </svg>
              )}

              {/* UNLOCKED: Rotating 3D Ring */}
              {badge.unlocked && (
                <>
                  <svg
                    className="absolute inset-0 w-full h-full"
                    style={{
                      animation: rarityVisual.hasPulse ? 'spin-ring 12s linear infinite' : 'none'
                    }}
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="48"
                      stroke={`url(#gradient-unlocked-${uniqueId})`}
                      strokeWidth={rarityVisual.ringWidth}
                      fill="none"
                      strokeLinecap="round"
                      style={{
                        filter: `drop-shadow(0 0 12px ${rarityVisual.glowColor})`
                      }}
                    />
                    <defs>
                      <linearGradient id={`gradient-unlocked-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={ringColors[0]} />
                        <stop offset="50%" stopColor={ringColors[1]} />
                        <stop offset="100%" stopColor={ringColors[2] || ringColors[1]} />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Glow Pulse Effect */}
                  {rarityVisual.hasPulse && (
                    <div
                      className="absolute inset-0 rounded-full animate-pulse-glow"
                      style={{
                        background: `radial-gradient(circle, ${rarityVisual.glowColor}, transparent 70%)`,
                        animationDuration: '3s'
                      }}
                    />
                  )}
                </>
              )}

              {/* Badge Circle */}
              <div
                className={`
                  relative w-full h-full rounded-full flex items-center justify-center
                  ${badge.unlocked ? 'opacity-100 shadow-2xl' : 'opacity-50'}
                  transition-all duration-300
                `}
                style={{
                  background: bgGradient,
                  boxShadow: badge.unlocked
                    ? `0 8px 32px ${rarityVisual.glowColor}, inset 0 -2px 8px rgba(0,0,0,0.2)`
                    : 'none'
                }}
              >
                {/* Shine Effect (diagonal sweep) */}
                {badge.unlocked && rarityVisual.hasShine && (
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine-diagonal" />
                  </div>
                )}

                {/* Icon */}
                <IconComponent
                  className={`
                    relative z-10
                    ${ICON_SIZE_CLASSES[size]}
                    ${badge.unlocked ? 'text-white drop-shadow-2xl' : 'text-muted-foreground'}
                    transition-all duration-300
                  `}
                  style={{
                    filter: badge.unlocked ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'none'
                  }}
                />
              </div>

              {/* Lock Icon (centered) */}
              {!badge.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-card border-2 border-border rounded-full flex items-center justify-center shadow-lg">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              )}

              {/* Progress Label */}
              {!badge.unlocked && badge.progress && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-card border-2 border-primary rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap shadow-md">
                  {badge.progress.current}/{badge.progress.required}
                </div>
              )}

              {/* "ALMOST!" Tag */}
              {!badge.unlocked && progressPercent >= 80 && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[9px] font-black px-2.5 py-1 rounded-full animate-bounce shadow-lg">
                  ALMOST!
                </div>
              )}

              {/* Rarity Badge (Unlocked only) */}
              {badge.unlocked && badge.rarity !== 'common' && (
                <div className={`
                  absolute -bottom-2 left-1/2 -translate-x-1/2
                  text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider
                  bg-gradient-to-r ${rarityVisual.ringGradient} text-white shadow-md
                `}>
                  {badge.rarity}
                </div>
              )}
            </div>

            {/* Badge Name */}
            {size !== 'featured' && (
              <div className="text-center max-w-[100px]">
                <div className={`font-semibold text-xs mb-0.5 leading-tight ${badge.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {badge.name}
                </div>
                <div className="text-[10px] text-muted-foreground/60 line-clamp-2 leading-tight">
                  {badge.unlocked && badge.unlocked_at
                    ? new Date(badge.unlocked_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : badge.description.substring(0, 30) + '...'}
                </div>
              </div>
            )}
          </button>
        </TooltipTrigger>

        <TooltipContent side="top" className="max-w-xs" sideOffset={10}>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                style={{ background: bgGradient }}
              >
                <IconComponent className={`w-6 h-6 ${badge.unlocked ? 'text-white' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <p className="font-bold text-sm">{badge.name}</p>
                <p className="text-xs text-muted-foreground capitalize flex items-center gap-1.5">
                  {badge.category}
                  {badge.rarity !== 'common' && (
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-gradient-to-r ${rarityVisual.ringGradient} text-white`}>
                      {badge.rarity}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed">{badge.description}</p>

            {!badge.unlocked && badge.progress && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground font-medium">
                  Progress: {badge.progress.current}/{badge.progress.required} {badge.progress.label} ({Math.round(progressPercent)}%)
                </p>
              </div>
            )}

            {badge.unlocked && badge.unlocked_at && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Unlocked on {new Date(badge.unlocked_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

BadgeCardV3.displayName = 'BadgeCardV3';
