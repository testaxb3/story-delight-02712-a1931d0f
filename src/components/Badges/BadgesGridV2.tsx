/**
 * BADGES GRID V2 - Performance Optimized
 * Memoized filtering, zero wasteful re-renders
 * Responsive grid with proper spacing
 */

import { memo, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BadgeCardV2 } from './BadgeCardV2';
import { ShareBadgeModal } from './ShareBadgeModal';
import type { Badge, BadgeCategory, BadgeRarity } from '@/types/achievements';
import { BADGE_CATEGORY_LABELS } from '@/types/achievements';

interface BadgesGridV2Props {
  badges: Badge[];
  loading?: boolean;
}

type RarityFilter = 'all' | BadgeRarity;

const LoadingSkeleton = memo(() => (
  <div className="grid grid-cols-3 gap-x-4 gap-y-6 justify-items-center">
    {Array.from({ length: 12 }).map((_, i) => (
      <div
        key={i}
        className="w-20 h-20 bg-muted/50 animate-pulse rounded-full"
      />
    ))}
  </div>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

const ZeroState = memo(() => {
  const navigate = useNavigate();

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
});

ZeroState.displayName = 'ZeroState';

const BadgeList = memo(({ badges, onBadgeClick }: { badges: Badge[]; onBadgeClick: (badge: Badge) => void }) => {
  const { unlockedBadges, lockedBadges } = useMemo(() => {
    return {
      unlockedBadges: badges.filter(b => b.unlocked),
      lockedBadges: badges.filter(b => !b.unlocked)
    };
  }, [badges]);

  return (
    <div className="space-y-8 pb-6">
      {unlockedBadges.length > 0 && (
        <div className="grid grid-cols-3 gap-x-4 gap-y-6 justify-items-center">
          {unlockedBadges.map((badge) => (
            <BadgeCardV2 key={badge.id} badge={badge} onClick={onBadgeClick} />
          ))}
        </div>
      )}

      {lockedBadges.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-muted-foreground mb-4 px-1">
            Locked Badges
          </h2>
          <div className="grid grid-cols-3 gap-x-4 gap-y-6 justify-items-center">
            {lockedBadges.map((badge) => (
              <BadgeCardV2 key={badge.id} badge={badge} onClick={onBadgeClick} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

BadgeList.displayName = 'BadgeList';

export const BadgesGridV2 = memo(({ badges, loading = false }: BadgesGridV2Props) => {
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | 'all'>('all');
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('all');
  const [shareBadge, setShareBadge] = useState<Badge | null>(null);

  const filteredBadges = useMemo(() => {
    let filtered = badges;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(b => b.category === selectedCategory);
    }

    if (rarityFilter !== 'all') {
      filtered = filtered.filter(b => b.rarity === rarityFilter);
    }

    return filtered;
  }, [badges, selectedCategory, rarityFilter]);

  const handleBadgeClick = useCallback((badge: Badge) => {
    if (badge.unlocked) {
      setShareBadge(badge);
    }
  }, []);

  const unlockedCount = useMemo(() => badges.filter(b => b.unlocked).length, [badges]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (unlockedCount === 0) {
    return <ZeroState />;
  }

  return (
    <>
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex items-center justify-between gap-2">
          <Tabs
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value as BadgeCategory | 'all')}
            className="flex-1"
          >
            <TabsList className="w-full grid grid-cols-4 h-9">
              <TabsTrigger value="all" className="text-xs">
                All
              </TabsTrigger>
              <TabsTrigger value="streak" className="text-xs">
                {BADGE_CATEGORY_LABELS.streak.emoji}
              </TabsTrigger>
              <TabsTrigger value="scripts" className="text-xs">
                {BADGE_CATEGORY_LABELS.scripts.emoji}
              </TabsTrigger>
              <TabsTrigger value="videos" className="text-xs">
                {BADGE_CATEGORY_LABELS.videos.emoji}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setRarityFilter('all')}>
                All Rarities
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRarityFilter('common')}>
                Common
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRarityFilter('rare')}>
                Rare
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRarityFilter('epic')}>
                Epic
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRarityFilter('legendary')}>
                Legendary
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Badge Grid */}
        <BadgeList badges={filteredBadges} onBadgeClick={handleBadgeClick} />
      </div>

      {/* Share Modal */}
      <ShareBadgeModal
        badge={shareBadge}
        isOpen={!!shareBadge}
        onClose={() => setShareBadge(null)}
      />
    </>
  );
});

BadgesGridV2.displayName = 'BadgesGridV2';
