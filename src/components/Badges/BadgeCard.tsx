import { memo } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BadgeCardProps {
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    unlocked: boolean;
    unlockedAt?: string;
    progress?: {
      current: number;
      required: number;
      label: string;
    };
  };
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

const sizeClasses = {
  sm: 'w-20 h-20',
  md: 'w-28 h-28',
  lg: 'w-36 h-36'
};

const iconSizes = {
  sm: 'text-3xl',
  md: 'text-4xl',
  lg: 'text-5xl'
};

const categoryColors: Record<string, string> = {
  streak: 'from-orange-500 to-red-500',
  scripts: 'from-purple-500 to-blue-500',
  videos: 'from-pink-500 to-purple-500',
  tracker: 'from-green-500 to-emerald-500',
  community: 'from-blue-500 to-cyan-500',
  special: 'from-yellow-500 to-amber-500'
};

export const BadgeCard = memo(({ badge, size = 'md', showProgress = true }: BadgeCardProps) => {
  const isRecentlyUnlocked = (unlockedDate: string) => {
    return new Date().getTime() - new Date(unlockedDate).getTime() < 7 * 24 * 60 * 60 * 1000;
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: badge.unlocked ? 1.05 : 1 }}
            className="relative flex flex-col items-center gap-2"
          >
            {/* Hexagonal Badge Icon */}
            <div className="relative">
              <div
                className={`
                  w-20 h-20 rounded-2xl flex items-center justify-center 
                  transition-all rotate-45 overflow-hidden
                  ${badge.unlocked 
                    ? `bg-gradient-to-br ${categoryColors[badge.category]} shadow-lg` 
                    : 'bg-muted/80 border-2 border-border'
                  }
                `}
              >
                <div className="-rotate-45 flex items-center justify-center">
                  <div
                    className={`
                      text-3xl transition-all
                      ${badge.unlocked ? 'opacity-100 drop-shadow-lg' : 'opacity-30 grayscale'}
                    `}
                  >
                    {badge.icon}
                  </div>
                </div>
              </div>

              {/* Lock Icon for Locked Badges */}
              {!badge.unlocked && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-background border-2 border-border rounded-full flex items-center justify-center">
                  <Lock className="w-3 h-3 text-muted-foreground" />
                </div>
              )}

              {/* NEW Badge Indicator */}
              {badge.unlocked && badge.unlockedAt && isRecentlyUnlocked(badge.unlockedAt) && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-success border-2 border-background rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-success-foreground">!</span>
                </div>
              )}
            </div>

            {/* Badge Name and Description */}
            <div className="text-center max-w-[100px]">
              <div className={`font-semibold text-sm mb-1 ${badge.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                {badge.name}
              </div>
              
              {/* Requirement/Description */}
              <div className="text-xs text-muted-foreground/80 line-clamp-2">
                {!badge.unlocked 
                  ? badge.description
                  : badge.unlockedAt 
                    ? `Logged ${new Date(badge.unlockedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                    : badge.description
                }
              </div>
            </div>
          </motion.div>
        </TooltipTrigger>

        <TooltipContent 
          side="top" 
          className="max-w-xs"
          sideOffset={8}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{badge.icon}</span>
              <div>
                <p className="font-semibold">{badge.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{badge.category}</p>
              </div>
            </div>
            
            <p className="text-sm">{badge.description}</p>
            
            {!badge.unlocked && badge.progress && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Progress: {badge.progress.current}/{badge.progress.required} {badge.progress.label}
                </p>
              </div>
            )}

            {badge.unlocked && badge.unlockedAt && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

BadgeCard.displayName = 'BadgeCard';
