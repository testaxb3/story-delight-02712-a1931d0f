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

const getGradientColors = (category: string): string => {
  const gradients: Record<string, string> = {
    streak: '#f97316, #dc2626',
    scripts: '#a855f7, #3b82f6',
    videos: '#ec4899, #a855f7',
    tracker: '#10b981, #059669',
    community: '#3b82f6, #06b6d4',
    special: '#eab308, #f59e0b'
  };
  return gradients[category] || '#6b7280, #4b5563';
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
            className="relative flex flex-col items-center gap-2.5"
          >
            {/* Hexagonal Badge Container */}
            <div className="relative">
              {/* Hexagon shape using clip-path */}
              <div
                className={`
                  w-[70px] h-[70px] flex items-center justify-center
                  transition-all duration-300
                  ${badge.unlocked
                    ? 'opacity-100'
                    : 'opacity-40 grayscale'
                  }
                `}
                style={{
                  clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                  background: badge.unlocked
                    ? `linear-gradient(135deg, ${getGradientColors(badge.category)})`
                    : '#e5e7eb',
                }}
              >
                <div className="flex items-center justify-center">
                  <div className={`text-3xl ${badge.unlocked ? 'drop-shadow-md' : ''}`}>
                    {badge.icon}
                  </div>
                </div>
              </div>

              {/* Lock Icon for Locked Badges */}
              {!badge.unlocked && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-background border border-border rounded-full flex items-center justify-center shadow-sm">
                  <Lock className="w-3 h-3 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Badge Name and Description */}
            <div className="text-center max-w-[90px]">
              <div className={`font-medium text-xs mb-0.5 ${badge.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                {badge.name}
              </div>

              {/* Requirement/Description */}
              <div className="text-[10px] text-muted-foreground/70 line-clamp-2 leading-tight">
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
