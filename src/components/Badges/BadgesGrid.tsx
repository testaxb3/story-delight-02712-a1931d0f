import { memo } from 'react';
import { motion } from 'framer-motion';
import { BadgeCard } from './BadgeCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Badge {
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
}

interface BadgesGridProps {
  badges: Badge[];
  loading?: boolean;
}

const categoryLabels: Record<string, { label: string; emoji: string }> = {
  streak: { label: 'Streak', emoji: '🔥' },
  scripts: { label: 'Scripts', emoji: '📖' },
  videos: { label: 'Videos', emoji: '🎬' },
  tracker: { label: 'Tracker', emoji: '📝' },
  community: { label: 'Community', emoji: '💬' },
  special: { label: 'Special', emoji: '🏆' }
};

export const BadgesGrid = memo(({ badges, loading = false }: BadgesGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-x-4 gap-y-6 justify-items-center">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="w-[70px] h-[70px] bg-muted/50 animate-pulse"
            style={{
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
            }}
          />
        ))}
      </div>
    );
  }

  // Separar badges desbloqueados e bloqueados
  const unlockedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);

  return (
    <div className="space-y-8 pb-6">
      {/* Unlocked Badges */}
      {unlockedBadges.length > 0 && (
        <div className="grid grid-cols-3 gap-x-4 gap-y-6 justify-items-center">
          {unlockedBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02, type: 'spring', stiffness: 200 }}
            >
              <BadgeCard badge={badge} showProgress />
            </motion.div>
          ))}
        </div>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-muted-foreground mb-4 px-1">
            Locked badges
          </h2>
          <div className="grid grid-cols-3 gap-x-4 gap-y-6 justify-items-center">
            {lockedBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (unlockedBadges.length + index) * 0.02, type: 'spring', stiffness: 200 }}
              >
                <BadgeCard badge={badge} showProgress />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

BadgesGrid.displayName = 'BadgesGrid';
