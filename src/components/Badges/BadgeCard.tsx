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
  const isNew = badge.unlockedAt && 
    new Date().getTime() - new Date(badge.unlockedAt).getTime() < 24 * 60 * 60 * 1000;

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
            {/* Badge Circle */}
            <div
              className={`
                ${sizeClasses[size]} 
                rounded-full 
                flex items-center justify-center 
                relative
                transition-all duration-300
                ${badge.unlocked 
                  ? `bg-gradient-to-br ${categoryColors[badge.category]} shadow-lg` 
                  : 'bg-muted border-2 border-border grayscale opacity-50'
                }
                ${isNew ? 'ring-4 ring-yellow-400 animate-pulse' : ''}
              `}
            >
              {/* Icon */}
              <span className={`${iconSizes[size]} ${badge.unlocked ? '' : 'opacity-40'}`}>
                {badge.icon}
              </span>

              {/* Lock Overlay for Locked Badges */}
              {!badge.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[1px] rounded-full">
                  <Lock className="w-6 h-6 text-muted-foreground" />
                </div>
              )}

              {/* New Badge Indicator */}
              {isNew && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                  NEW
                </div>
              )}
            </div>

            {/* Badge Name */}
            <div className="text-center">
              <p className={`text-sm font-semibold ${badge.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                {badge.name}
              </p>
              
              {/* Progress Bar for Locked Badges */}
              {!badge.unlocked && showProgress && badge.progress && (
                <div className="mt-1 w-20">
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${Math.min((badge.progress.current / badge.progress.required) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {badge.progress.current}/{badge.progress.required}
                  </p>
                </div>
              )}
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
