import { memo } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// React Icons - Font Awesome 6 (SOLID)
import {
  FaFire, FaBolt, FaDumbbell, FaTrophy, FaLock, FaGem, FaCrown,
  FaBook, FaBookOpen, FaGraduationCap, FaBullseye, FaStar,
  FaVideo, FaEye, FaTv,
  FaCircleCheck, FaSeedling, FaLeaf, FaTree,
  FaHandshake, FaComments, FaUsers, FaRocket,
  FaMedal, FaHeart, FaSun, FaMoon, FaAward
} from 'react-icons/fa6';
import { IoSparkles } from 'react-icons/io5';
import { GiButterfly } from 'react-icons/gi';

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

// Map icon names to React Icons (Font Awesome 6)
const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, any> = {
    // Streak badges
    '🔥': FaFire,
    'flame': FaFire,
    'fire': FaFire,
    '⚡': FaBolt,
    'zap': FaBolt,
    'lightning': FaBolt,
    '💪': FaDumbbell,
    'muscle': FaDumbbell,
    '🏆': FaTrophy,
    'trophy': FaTrophy,
    '🔒': FaLock,
    'lock': FaLock,
    'locked': FaLock,
    '💎': FaGem,
    'diamond': FaGem,
    'gem': FaGem,
    '👑': FaCrown,
    'crown': FaCrown,

    // Script badges
    '📝': FaBook,
    '📖': FaBookOpen,
    '📚': FaBookOpen,
    'book': FaBookOpen,
    'script': FaBook,
    '🎯': FaBullseye,
    'target': FaBullseye,
    '🌟': FaStar,
    '⭐': FaStar,
    'star': FaStar,
    '👨‍🏫': FaAward,
    'teacher': FaAward,

    // Video badges
    '🎬': FaVideo,
    'video': FaVideo,
    'play': FaVideo,
    '👀': FaEye,
    'eyes': FaEye,
    '📺': FaTv,
    'tv': FaTv,
    '🎓': FaGraduationCap,
    'graduation': FaGraduationCap,
    'graduate': FaGraduationCap,

    // Tracker badges
    '✅': FaCircleCheck,
    'check': FaCircleCheck,
    'tracker': FaCircleCheck,
    '🌱': FaSeedling,
    'seedling': FaSeedling,
    '🌿': FaLeaf,
    'herb': FaLeaf,
    '🌳': FaTree,
    'tree': FaTree,
    '🦋': GiButterfly,
    'butterfly': GiButterfly,

    // Community badges
    '👋': FaHandshake,
    'wave': FaHandshake,
    '💬': FaComments,
    'speech': FaComments,
    '👥': FaUsers,
    'users': FaUsers,
    'community': FaUsers,
    '🚀': FaRocket,
    'rocket': FaRocket,

    // Special badges
    '🎖️': FaMedal,
    'medal': FaMedal,
    '💯': FaStar, // Changed from FaHundredPoints (doesn't exist)
    'hundred': FaStar,
    'perfect': FaStar,
    '🦉': FaMoon,
    'owl': FaMoon,
    '🌅': FaSun,
    'sunrise': FaSun,
    '❤️': FaHeart,
    'heart': FaHeart,

    // Generic
    '✨': IoSparkles,
    'sparkles': IoSparkles,
    'magic': IoSparkles,
  };

  // Try exact match first, then lowercase
  const exactMatch = iconMap[iconName];
  if (exactMatch) return exactMatch;

  const lowerMatch = iconMap[iconName.toLowerCase()];
  if (lowerMatch) return lowerMatch;

  // Fallback to Star
  return FaStar;
};

export const BadgeCard = memo(({ badge, size = 'md', showProgress = true }: BadgeCardProps) => {
  const isRecentlyUnlocked = (unlockedDate: string) => {
    return new Date().getTime() - new Date(unlockedDate).getTime() < 7 * 24 * 60 * 60 * 1000;
  };

  const IconComponent = getIconComponent(badge.icon);

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
            <div className="relative group">
              {/* Glow effect for unlocked badges */}
              {badge.unlocked && (
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                  style={{
                    clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                    background: `linear-gradient(135deg, ${getGradientColors(badge.category)})`,
                  }}
                />
              )}

              {/* Hexagon shape using clip-path */}
              <div
                className={`
                  relative w-[70px] h-[70px] flex items-center justify-center
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
                {/* Shine effect animation for unlocked badges */}
                {badge.unlocked && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    style={{
                      clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                    }}
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 5,
                      ease: 'easeInOut',
                    }}
                  />
                )}

                <div className="flex items-center justify-center relative z-10">
                  <IconComponent
                    className={`w-8 h-8 ${badge.unlocked ? 'text-white drop-shadow-lg' : 'text-gray-500'}`}
                    strokeWidth={2.5}
                  />
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
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  background: badge.unlocked
                    ? `linear-gradient(135deg, ${getGradientColors(badge.category)})`
                    : '#e5e7eb',
                }}
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
