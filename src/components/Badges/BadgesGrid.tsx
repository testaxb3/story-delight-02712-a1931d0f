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
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-28 h-28 rounded-full bg-muted animate-pulse" />
            <div className="w-20 h-4 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  const categories = Object.keys(categoryLabels);
  const allBadges = badges;
  const unlockedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="all">
          All ({allBadges.length})
        </TabsTrigger>
        <TabsTrigger value="unlocked">
          Unlocked ({unlockedBadges.length})
        </TabsTrigger>
        <TabsTrigger value="locked">
          Locked ({lockedBadges.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-8">
        {categories.map((category) => {
          const categoryBadges = badges.filter(b => b.category === category);
          if (categoryBadges.length === 0) return null;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{categoryLabels[category].emoji}</span>
                <h3 className="text-lg font-bold text-foreground">
                  {categoryLabels[category].label}
                </h3>
                <span className="text-sm text-muted-foreground">
                  ({categoryBadges.filter(b => b.unlocked).length}/{categoryBadges.length})
                </span>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
                {categoryBadges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <BadgeCard badge={badge} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </TabsContent>

      <TabsContent value="unlocked">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
          {unlockedBadges.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No badges unlocked yet. Keep going! 💪</p>
            </div>
          ) : (
            unlockedBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <BadgeCard badge={badge} />
              </motion.div>
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="locked">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
          {lockedBadges.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">You've unlocked all badges! 🎉</p>
            </div>
          ) : (
            lockedBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <BadgeCard badge={badge} />
              </motion.div>
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
});

BadgesGrid.displayName = 'BadgesGrid';
