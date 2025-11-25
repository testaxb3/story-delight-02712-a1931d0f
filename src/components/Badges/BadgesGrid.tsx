import { memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BadgeCard } from './BadgeCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

interface Badge {
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
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-x-4 gap-y-6 justify-items-center">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="w-[70px] h-[70px] bg-muted/50 animate-pulse rounded-full"
          />
        ))}
      </div>
    );
  }

  const unlockedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);

  // Find next badge to unlock (highest progress)
  const nextBadge = lockedBadges
    .filter(b => b.progress)
    .sort((a, b) => {
      const aProgress = a.progress!.current / a.progress!.required;
      const bProgress = b.progress!.current / b.progress!.required;
      return bProgress - aProgress;
    })[0];

  const progressPercent = nextBadge?.progress
    ? (nextBadge.progress.current / nextBadge.progress.required) * 100
    : 0;

  // Filter by category
  const getBadgesByCategory = (category: string) => {
    if (category === 'all') return badges;
    return badges.filter(b => b.category === category);
  };

  // Zero state
  if (unlockedBadges.length === 0) {
    return (
      <div className="text-center py-12 px-6">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-xl font-bold mb-2">Start Your Journey</h3>
        <p className="text-muted-foreground mb-6">
          Complete your first script to unlock your first badge
        </p>
        <Button onClick={() => navigate('/scripts')} size="lg">
          Explore Scripts
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Featured Next Milestone */}
      {nextBadge && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 p-6 border border-primary/20"
        >
          <div className="flex items-center gap-6">
            {/* Large Badge */}
            <div className="relative flex-shrink-0">
              <BadgeCard badge={nextBadge} size="featured" featured />
              <motion.div
                className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent rounded-full pointer-events-none"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="text-xs text-primary font-bold mb-1 tracking-wider">
                NEXT MILESTONE
              </div>
              <h3 className="text-xl font-bold mb-2">{nextBadge.name}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {nextBadge.description}
              </p>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">
                    {nextBadge.progress!.current}/{nextBadge.progress!.required} {nextBadge.progress!.label}
                  </span>
                  <span className="text-muted-foreground">{Math.round(progressPercent)}%</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs by Category */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-4">
          <TabsTrigger value="all" className="text-xs">
            All ({badges.length})
          </TabsTrigger>
          <TabsTrigger value="streak" className="text-xs">
            {categoryLabels.streak.emoji}
          </TabsTrigger>
          <TabsTrigger value="scripts" className="text-xs">
            {categoryLabels.scripts.emoji}
          </TabsTrigger>
          <TabsTrigger value="videos" className="text-xs">
            {categoryLabels.videos.emoji}
          </TabsTrigger>
        </TabsList>

        {Object.keys({ all: true, ...categoryLabels }).map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <BadgeList badges={getBadgesByCategory(category)} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
});

// Badge List Component
const BadgeList = memo(({ badges }: { badges: Badge[] }) => {
  const unlockedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);

  return (
    <div className="space-y-8 pb-6">
      {/* Unlocked */}
      {unlockedBadges.length > 0 && (
        <div className="grid grid-cols-3 gap-x-4 gap-y-6 justify-items-center">
          {unlockedBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02, type: 'spring', stiffness: 200 }}
            >
              <BadgeCard badge={badge} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Locked */}
      {lockedBadges.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-muted-foreground mb-4 px-1">
            Locked Badges
          </h2>
          <div className="grid grid-cols-3 gap-x-4 gap-y-6 justify-items-center">
            {lockedBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (unlockedBadges.length + index) * 0.02, type: 'spring', stiffness: 200 }}
              >
                <BadgeCard badge={badge} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

BadgeList.displayName = 'BadgeList';
BadgesGrid.displayName = 'BadgesGrid';
