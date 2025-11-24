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
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="w-20 h-20 bg-muted/50 rounded-2xl animate-pulse rotate-45"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
      {badges.map((badge, index) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.03 }}
        >
          <BadgeCard badge={badge} showProgress />
        </motion.div>
      ))}
    </div>
  );
});

BadgesGrid.displayName = 'BadgesGrid';
