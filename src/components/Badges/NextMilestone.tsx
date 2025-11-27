/**
 * NEXT MILESTONE COMPONENT V2
 * Auto-unlock on 100% progress + Premium redesign
 * Gamified CTA using psychology triggers
 */

import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo, useState } from 'react';
import { ArrowRight, Flame, BookOpen, Video, BarChart3, Users, Trophy, Loader2 } from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';
import { useAuth } from '@/contexts/AuthContext';
import { useBadgeUnlockCelebration } from '@/hooks/useBadgeUnlockCelebration';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import type { Badge } from '@/types/achievements';
import { BadgeCardV3 } from './BadgeCardV3';

interface NextMilestoneProps {
  badge: Badge;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  streak: Flame,
  scripts: BookOpen,
  videos: Video,
  tracker: BarChart3,
  community: Users,
  special: Trophy
};

const categoryRoutes: Record<string, string> = {
  streak: '/tracker',
  scripts: '/scripts',
  videos: '/bonuses',
  tracker: '/tracker',
  community: '/community',
  special: '/scripts'
};

export const NextMilestone = ({ badge }: NextMilestoneProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { celebrate } = useBadgeUnlockCelebration();
  const { triggerHaptic } = useHaptic();
  const [isUnlocking, setIsUnlocking] = useState(false);

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
        buttonClass: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white',
        buttonText: 'Unlock NOW!',
        pulseIntensity: 'animate-pulse'
      },
      high: {
        bgGradient: 'from-yellow-500/10 to-orange-500/10',
        borderColor: 'border-yellow-500/30',
        textColor: 'text-yellow-600 dark:text-yellow-400',
        buttonClass: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white',
        buttonText: 'Almost there!',
        pulseIntensity: 'animate-pulse-slow'
      },
      medium: {
        bgGradient: 'from-blue-500/10 to-purple-500/10',
        borderColor: 'border-blue-500/20',
        textColor: 'text-blue-600 dark:text-blue-400',
        buttonClass: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white',
        buttonText: 'Continue',
        pulseIntensity: ''
      }
    };
    return config[urgencyLevel];
  }, [urgencyLevel]);

  const handleCTA = useCallback(async () => {
    triggerHaptic('medium');

    // Se progresso = 100%, tentar desbloquear badge
    if (progressPercent >= 100 && user?.id) {
      setIsUnlocking(true);
      
      try {
        const { data, error } = await supabase.rpc('check_and_unlock_badges', {
          p_user_id: user.id
        });

        if (error) throw error;

        // Se desbloqueou badge(s)
        if (data && data.length > 0) {
          celebrate({
            badge,
            timestamp: new Date().toISOString()
          });

          queryClient.invalidateQueries({ queryKey: ['achievements-enriched', user.id] });
          
          toast.success('🎉 Badge Unlocked!', {
            description: `You earned ${badge.name}!`,
            duration: 4000
          });

          setIsUnlocking(false);
          return;
        }
      } catch (error) {
        console.error('Failed to unlock badge:', error);
        toast.error('Failed to unlock badge', {
          description: 'Please try again or contact support.',
          duration: 3000
        });
      } finally {
        setIsUnlocking(false);
      }
    }

    // Fallback: navegar para página relevante
    navigate(categoryRoutes[badge.category] || '/scripts');
  }, [badge, progressPercent, user, navigate, triggerHaptic, celebrate, queryClient]);

  const Icon = categoryIcons[badge.category] || Trophy;

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
        <div className="flex-1 flex justify-center">
          <BadgeCardV3 badge={badge} size="featured" />
        </div>

        <div className="flex-1 min-w-0">
          <div className={`text-xs font-bold mb-1 tracking-wider uppercase ${urgencyConfig.textColor}`}>
            Next Milestone
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
            <button
              onClick={handleCTA}
              disabled={isUnlocking}
              className={`
                mt-4 w-full py-3 px-4 rounded-2xl font-bold
                flex items-center justify-center gap-2
                transition-all duration-300 disabled:opacity-50
                ${urgencyConfig.buttonClass}
                ${urgencyLevel === 'critical' ? 'animate-pulse-slow shadow-xl' : 'shadow-md'}
              `}
            >
              {isUnlocking ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Unlocking...</span>
                </>
              ) : (
                <>
                  <Icon className="w-5 h-5" />
                  <span>{progressPercent >= 100 ? 'Unlock NOW!' : urgencyConfig.buttonText}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
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
};
