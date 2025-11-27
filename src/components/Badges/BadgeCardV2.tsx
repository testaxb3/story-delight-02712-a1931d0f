/**
 * BADGE CARD V2 - Performance Optimized
 * CSS animations > Framer Motion (60fps guaranteed on GPU thread)
 * Zero requestAnimationFrame, zero JS thread blocking
 */

import { memo, useMemo, useCallback, useId } from 'react';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getBadgeIcon } from './BadgeIconMap';
import { BADGE_RARITY_CONFIG } from '@/types/achievements';
import type { Badge, BadgeRarity } from '@/types/achievements';

interface BadgeCardProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg' | 'featured';
  onClick?: (badge: Badge) => void;
}

const SIZE_CLASSES = {
  sm: 'w-14 h-14',
  md: 'w-20 h-20',
  lg: 'w-24 h-24',
  featured: 'w-32 h-32'
} as const;

const ICON_SIZE_CLASSES = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  featured: 'w-14 h-14'
} as const;

export const BadgeCardV2 = memo(({ badge, size = 'md', onClick }: BadgeCardProps) => {
  const uniqueId = useId();
  const IconComponent = getBadgeIcon(badge.icon);
  const rarityConfig = BADGE_RARITY_CONFIG[badge.rarity as BadgeRarity];

  const progressPercent = useMemo(() => {
    return badge.progress ? badge.progress.percentage : 0;
  }, [badge.progress]);

  const circumference = useMemo(() => 2 * Math.PI * 48, []);

  const strokeDashoffset = useMemo(() => {
    return circumference * (1 - progressPercent / 100);
  }, [circumference, progressPercent]);

  const handleClick = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(badge.unlocked ? 20 : 50);
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
    if (!badge.unlocked) return '#e5e7eb';

    const gradientMap: Record<string, string> = {
      streak: 'linear-gradient(135deg, #f97316, #ea580c)',
      scripts: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      videos: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
      tracker: 'linear-gradient(135deg, #10b981, #059669)',
      community: 'linear-gradient(135deg, #ec4899, #be185d)',
      special: 'linear-gradient(135deg, #eab308, #ca8a04)'
    };

    return gradientMap[badge.category] || gradientMap.special;
  }, [badge.category, badge.unlocked]);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            className={`
              relative flex flex-col items-center gap-2
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
              rounded-2xl p-1 transition-transform active:scale-95
              ${badge.unlocked ? 'hover:scale-105' : ''}
            `}
            aria-label={`${badge.name}. ${badge.unlocked ? 'Unlocked' : `Locked. Progress: ${Math.round(progressPercent)}%`}`}
          >
            <div className={`relative ${SIZE_CLASSES[size]}`}>
              {/* Progress Ring (Locked Badges) */}
              {!badge.unlocked && (
                <svg
                  className="absolute inset-0 -rotate-90 w-full h-full"
                  viewBox="0 0 100 100"
                  style={{ willChange: 'transform' }}
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={rarityConfig.ringWidth}
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    stroke={`url(#gradient-progress-${uniqueId})`}
                    strokeWidth={rarityConfig.ringWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                      transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      willChange: 'stroke-dashoffset'
                    }}
                  />
                  <defs>
                    <linearGradient id={`gradient-progress-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              )}

              {/* Rotating Ring (Unlocked Badges) */}
              {badge.unlocked && (
                <svg
                  className="absolute inset-0 w-full h-full animate-spin-slow"
                  style={{ animationDuration: '8s' }}
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    stroke={`url(#gradient-unlocked-${uniqueId})`}
                    strokeWidth={rarityConfig.ringWidth}
                    fill="none"
                    strokeDasharray={circumference}
                  />
                  <defs>
                    <linearGradient id={`gradient-unlocked-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                </svg>
              )}

              {/* Glow Effect (Unlocked) */}
              {badge.unlocked && (
                <div
                  className={`absolute inset-0 rounded-full ${rarityConfig.glow} animate-pulse-slow`}
                  style={{
                    background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3), transparent)',
                    animationDuration: '2s'
                  }}
                />
              )}

              {/* Badge Circle */}
              <div
                className={`
                  relative w-full h-full rounded-full flex items-center justify-center
                  ${badge.unlocked ? 'opacity-100' : 'opacity-40 grayscale'}
                `}
                style={{ background: bgGradient }}
              >
                {/* Shine Effect */}
                {badge.unlocked && (
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
                  </div>
                )}

                <IconComponent
                  className={`
                    relative z-10
                    ${ICON_SIZE_CLASSES[size]}
                    ${badge.unlocked ? 'text-white drop-shadow-lg' : 'text-gray-500'}
                  `}
                />
              </div>

              {/* Lock Icon */}
              {!badge.unlocked && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-background border border-border rounded-full flex items-center justify-center shadow-sm">
                  <Lock className="w-3 h-3 text-muted-foreground" />
                </div>
              )}

              {/* Progress Label */}
              {!badge.unlocked && badge.progress && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-card border-2 border-primary rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap">
                  {badge.progress.current}/{badge.progress.required}
                </div>
              )}

              {/* "ALMOST!" Tag */}
              {!badge.unlocked && progressPercent > 70 && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[8px] font-bold px-2 py-0.5 rounded-full animate-bounce-slow">
                  ALMOST!
                </div>
              )}
            </div>

            {/* Badge Name */}
            {size !== 'featured' && (
              <div className="text-center max-w-[90px]">
                <div className={`font-medium text-xs mb-0.5 ${badge.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {badge.name}
                </div>
                <div className="text-[10px] text-muted-foreground/70 line-clamp-2 leading-tight">
                  {badge.unlocked && badge.unlocked_at
                    ? new Date(badge.unlocked_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : badge.description.substring(0, 30) + '...'}
                </div>
              </div>
            )}
          </button>
        </TooltipTrigger>

        <TooltipContent side="top" className="max-w-xs" sideOffset={8}>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: bgGradient }}
              >
                <IconComponent className={`w-5 h-5 ${badge.unlocked ? 'text-white' : 'text-gray-500'}`} />
              </div>
              <div>
                <p className="font-semibold">{badge.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{badge.category}</p>
              </div>
            </div>

            <p className="text-sm">{badge.description}</p>

            {!badge.unlocked && badge.progress && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Progress: {badge.progress.current}/{badge.progress.required} {badge.progress.label} ({Math.round(progressPercent)}%)
                </p>
              </div>
            )}

            {badge.unlocked && badge.unlocked_at && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Unlocked on {new Date(badge.unlocked_at).toLocaleDateString('en-US')}
                </p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

BadgeCardV2.displayName = 'BadgeCardV2';
