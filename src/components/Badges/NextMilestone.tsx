/**
 * NEXT MILESTONE COMPONENT
 * Gamified CTA using psychology triggers: Near-miss effect + Progress illusion
 * Drives user engagement through visual urgency
 */

import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BadgeCardV2 } from './BadgeCardV2';
import type { Badge } from '@/types/achievements';

interface NextMilestoneProps {
  badge: Badge;
}

export const NextMilestone = memo(({ badge }: NextMilestoneProps) => {
  const navigate = useNavigate();

  const progressPercent = useMemo(() => {
    return badge.progress?.percentage || 0;
  }, [badge.progress]);

  const remaining = useMemo(() => {
    if (!badge.progress) return 0;
    return badge.progress.required - badge.progress.current;
  }, [badge.progress]);

  const urgencyLevel = useMemo(() => {
    if (progressPercent >= 80) return 'critical';
    if (progressPercent >= 50) return 'high';
    return 'medium';
  }, [progressPercent]);

  const urgencyConfig = useMemo(() => {
    const config = {
      critical: {
        bgGradient: 'from-orange-500/10 to-red-500/10',
        borderColor: 'border-orange-500/30',
        textColor: 'text-orange-600 dark:text-orange-400',
        ctaText: 'Unlock NOW',
        pulseIntensity: 'animate-pulse'
      },
      high: {
        bgGradient: 'from-yellow-500/10 to-orange-500/10',
        borderColor: 'border-yellow-500/30',
        textColor: 'text-yellow-600 dark:text-yellow-400',
        ctaText: 'Almost there!',
        pulseIntensity: 'animate-pulse-slow'
      },
      medium: {
        bgGradient: 'from-blue-500/10 to-purple-500/10',
        borderColor: 'border-blue-500/20',
        textColor: 'text-blue-600 dark:text-blue-400',
        ctaText: 'Continue',
        pulseIntensity: ''
      }
    };
    return config[urgencyLevel];
  }, [urgencyLevel]);

  const handleCTA = () => {
    const categoryRoutes: Record<string, string> = {
      streak: '/tracker',
      scripts: '/scripts',
      videos: '/videos',
      tracker: '/tracker',
      community: '/community',
      special: '/scripts'
    };

    navigate(categoryRoutes[badge.category] || '/scripts');
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-3xl
        bg-gradient-to-br ${urgencyConfig.bgGradient}
        border ${urgencyConfig.borderColor}
        p-6 shadow-lg
      `}
    >
      <div className="flex items-center gap-6">
        <div className="relative flex-shrink-0">
          <BadgeCardV2 badge={badge} size="featured" />
          {urgencyLevel === 'critical' && (
            <div className="absolute inset-0 bg-gradient-radial from-orange-500/20 to-transparent rounded-full pointer-events-none animate-pulse" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className={`text-xs font-bold mb-1 tracking-wider ${urgencyConfig.textColor}`}>
            NEXT MILESTONE
          </div>
          <h3 className="text-xl font-bold mb-2 line-clamp-1">{badge.name}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {badge.description}
          </p>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span>
                {badge.progress?.current || 0}/{badge.progress?.required || 0} {badge.progress?.label || 'items'}
              </span>
              <span className={urgencyConfig.textColor}>
                {urgencyLevel === 'critical' && `Only ${remaining} left!`}
                {urgencyLevel === 'high' && `${Math.round(progressPercent)}% complete`}
                {urgencyLevel === 'medium' && `${Math.round(progressPercent)}%`}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {urgencyLevel === 'critical' && (
            <Button
              onClick={handleCTA}
              size="sm"
              className="mt-4 w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg"
            >
              {urgencyConfig.ctaText}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>

      {urgencyLevel === 'critical' && (
        <div className="absolute top-2 right-2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
          </div>
        </div>
      )}
    </div>
  );
});

NextMilestone.displayName = 'NextMilestone';
