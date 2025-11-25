import { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { badgeRarity, categoryColors, easeOutQuart } from '@/styles/badgeTokens';
import { useHaptic } from '@/hooks/useHaptic';
// React Icons
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
    rarity?: string;
    progress?: {
      current: number;
      required: number;
      label: string;
    };
  };
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'featured';
  featured?: boolean;
}

const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, any> = {
    '🔥': FaFire, 'flame': FaFire, 'fire': FaFire,
    '⚡': FaBolt, 'zap': FaBolt, 'lightning': FaBolt,
    '💪': FaDumbbell, 'muscle': FaDumbbell,
    '🏆': FaTrophy, 'trophy': FaTrophy,
    '🔒': FaLock, 'lock': FaLock, 'locked': FaLock,
    '💎': FaGem, 'diamond': FaGem, 'gem': FaGem,
    '👑': FaCrown, 'crown': FaCrown,
    '📝': FaBook, '📖': FaBookOpen, '📚': FaBookOpen, 'book': FaBookOpen, 'script': FaBook,
    '🎯': FaBullseye, 'target': FaBullseye,
    '🌟': FaStar, '⭐': FaStar, 'star': FaStar,
    '👨‍🏫': FaAward, 'teacher': FaAward,
    '🎬': FaVideo, 'video': FaVideo, 'play': FaVideo,
    '👀': FaEye, 'eyes': FaEye,
    '📺': FaTv, 'tv': FaTv,
    '🎓': FaGraduationCap, 'graduation': FaGraduationCap,
    '✅': FaCircleCheck, 'check': FaCircleCheck, 'tracker': FaCircleCheck,
    '🌱': FaSeedling, 'seedling': FaSeedling,
    '🌿': FaLeaf, 'herb': FaLeaf,
    '🌳': FaTree, 'tree': FaTree,
    '🦋': GiButterfly, 'butterfly': GiButterfly,
    '👋': FaHandshake, 'wave': FaHandshake,
    '💬': FaComments, 'speech': FaComments,
    '👥': FaUsers, 'users': FaUsers, 'community': FaUsers,
    '🚀': FaRocket, 'rocket': FaRocket,
    '🎖️': FaMedal, 'medal': FaMedal,
    '💯': FaStar, 'hundred': FaStar, 'perfect': FaStar,
    '🦉': FaMoon, 'owl': FaMoon,
    '🌅': FaSun, 'sunrise': FaSun,
    '❤️': FaHeart, 'heart': FaHeart,
    '✨': IoSparkles, 'sparkles': IoSparkles, 'magic': IoSparkles,
  };
  return iconMap[iconName] || iconMap[iconName.toLowerCase()] || FaStar;
};

export const BadgeCard = memo(({ badge, size = 'md', featured = false }: BadgeCardProps) => {
  const { triggerHaptic } = useHaptic();
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const IconComponent = getIconComponent(badge.icon);
  
  const rarity = (badge.rarity || 'common') as keyof typeof badgeRarity;
  const rarityConfig = badgeRarity[rarity];
  const actualSize = size === 'md' ? rarityConfig.sizeClass : size;
  
  const progressPercent = badge.progress 
    ? (badge.progress.current / badge.progress.required) * 100 
    : 0;

  const colors = categoryColors[badge.category] || categoryColors.special;
  const circumference = 2 * Math.PI * 48;

  // Animate progress ring
  useEffect(() => {
    if (!badge.unlocked && badge.progress) {
      let frame: number;
      let start = 0;
      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / 1000, 1);
        const eased = easeOutQuart(progress);
        setAnimatedProgress(eased * progressPercent);
        
        if (progress < 1) {
          frame = requestAnimationFrame(animate);
        }
      };
      frame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frame);
    }
  }, [badge.progress, progressPercent, badge.unlocked]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (badge.unlocked) {
      triggerHaptic('light');
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <motion.button
            onClick={handleClick}
            role="button"
            aria-label={`${badge.name}. ${badge.unlocked ? 'Unlocked' : `Locked. Progress: ${Math.round(progressPercent)}%`}`}
            aria-pressed={badge.unlocked}
            tabIndex={0}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: badge.unlocked ? 1.05 : 1 }}
            whileTap={{ scale: badge.unlocked ? 0.95 : 1 }}
            className="relative flex flex-col items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl p-1"
          >
            {/* Badge Circle with Ring */}
            <div className={`relative ${actualSize}`}>
              {/* Progress Ring for Locked Badges */}
              {!badge.unlocked && (
                <svg 
                  className="absolute inset-0 -rotate-90 w-full h-full"
                  viewBox="0 0 100 100"
                >
                  {/* Background ring */}
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={rarityConfig.ringWidth}
                    fill="none"
                  />
                  {/* Progress ring */}
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    stroke={`url(#gradient-${badge.id})`}
                    strokeWidth={rarityConfig.ringWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - animatedProgress / 100)}
                    className="transition-all duration-500"
                  />
                  <defs>
                    <linearGradient id={`gradient-${badge.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={colors.from} />
                      <stop offset="100%" stopColor={colors.to} />
                    </linearGradient>
                  </defs>
                </svg>
              )}

              {/* Rotating Ring for Unlocked Badges */}
              {badge.unlocked && (
                <motion.svg
                  className="absolute inset-0 -rotate-90 w-full h-full"
                  viewBox="0 0 100 100"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    stroke={`url(#gradient-${badge.id})`}
                    strokeWidth={rarityConfig.ringWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={0}
                  />
                  <defs>
                    <linearGradient id={`gradient-${badge.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={colors.from} />
                      <stop offset="100%" stopColor={colors.to} />
                    </linearGradient>
                  </defs>
                </motion.svg>
              )}

              {/* Glow effect for unlocked */}
              {badge.unlocked && (
                <motion.div
                  className={`absolute inset-0 rounded-full ${rarityConfig.glow}`}
                  style={{
                    background: `radial-gradient(circle, ${colors.from}40, transparent)`,
                  }}
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              {/* Badge Circle */}
              <div
                className={`relative w-full h-full rounded-full flex items-center justify-center ${
                  badge.unlocked ? 'opacity-100' : 'opacity-40 grayscale'
                }`}
                style={{
                  background: badge.unlocked
                    ? `linear-gradient(135deg, ${colors.from}, ${colors.to})`
                    : '#e5e7eb',
                }}
              >
                {/* Shine animation for unlocked */}
                {badge.unlocked && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                  />
                )}

                <IconComponent
                  className={`relative z-10 ${
                    size === 'featured' ? 'w-14 h-14' : size === 'xl' ? 'w-10 h-10' : 'w-8 h-8'
                  } ${badge.unlocked ? 'text-white drop-shadow-lg' : 'text-gray-500'}`}
                />
              </div>

              {/* Lock icon for locked badges */}
              {!badge.unlocked && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-background border border-border rounded-full flex items-center justify-center shadow-sm">
                  <Lock className="w-3 h-3 text-muted-foreground" />
                </div>
              )}

              {/* Progress label for locked badges */}
              {!badge.unlocked && badge.progress && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-card border-2 border-primary rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap">
                  {badge.progress.current}/{badge.progress.required}
                </div>
              )}

              {/* "ALMOST!" tag for >70% progress */}
              {!badge.unlocked && progressPercent > 70 && (
                <motion.div
                  className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[8px] font-bold px-2 py-0.5 rounded-full"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ALMOST!
                </motion.div>
              )}
            </div>

            {/* Badge Name and Description */}
            {!featured && (
              <div className="text-center max-w-[90px]">
                <div className={`font-medium text-xs mb-0.5 ${badge.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {badge.name}
                </div>
                <div className="text-[10px] text-muted-foreground/70 line-clamp-2 leading-tight">
                  {!badge.unlocked
                    ? badge.description
                    : badge.unlockedAt
                      ? `${new Date(badge.unlockedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                      : badge.description
                  }
                </div>
              </div>
            )}
          </motion.button>
        </TooltipTrigger>

        <TooltipContent side="top" className="max-w-xs" sideOffset={8}>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: badge.unlocked
                    ? `linear-gradient(135deg, ${colors.from}, ${colors.to})`
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
                  Progress: {badge.progress.current}/{badge.progress.required} {badge.progress.label} ({Math.round(progressPercent)}%)
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
