import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { useLeaderboard, type LeaderboardEntry, type LeaderboardType } from '@/hooks/useLeaderboard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Crown, Flame, BookOpen, Zap, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Leaderboard() {
  const { user } = useAuth();
  const { activeChild } = useChildProfiles();
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('streak');
  const [brainTypeFilter, setBrainTypeFilter] = useState<'INTENSE' | 'DISTRACTED' | 'DEFIANT' | null>(null);

  const { leaderboard, loading, userRank } = useLeaderboard(
    user?.profileId,
    leaderboardType,
    brainTypeFilter
  );

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return null;
  };

  const getScoreLabel = () => {
    switch (leaderboardType) {
      case 'streak':
        return 'Day Streak';
      case 'scripts':
        return 'Scripts Used';
      case 'xp':
        return 'Total XP';
    }
  };

  const getScoreIcon = () => {
    switch (leaderboardType) {
      case 'streak':
        return <Flame className="w-4 h-4" />;
      case 'scripts':
        return <BookOpen className="w-4 h-4" />;
      case 'xp':
        return <Zap className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <Card className="p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-glass border-none shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-40"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30 dark:from-slate-800/90 dark:via-slate-800/80 dark:to-slate-800/70 backdrop-blur-glass border-none shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Leaderboard</h3>
            <p className="text-sm text-muted-foreground">
              Top parents this month
            </p>
          </div>
        </div>
        {userRank && (
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              #{userRank}
            </div>
            <p className="text-xs text-muted-foreground">Your Rank</p>
          </div>
        )}
      </div>

      {/* Leaderboard Type Selector */}
      <div className="flex gap-2 mb-4">
        <Button
          size="sm"
          variant={leaderboardType === 'streak' ? 'default' : 'outline'}
          onClick={() => setLeaderboardType('streak')}
          className="flex-1 text-xs"
        >
          <Flame className="w-3 h-3 mr-1" />
          Streak
        </Button>
        <Button
          size="sm"
          variant={leaderboardType === 'scripts' ? 'default' : 'outline'}
          onClick={() => setLeaderboardType('scripts')}
          className="flex-1 text-xs"
        >
          <BookOpen className="w-3 h-3 mr-1" />
          Scripts
        </Button>
        <Button
          size="sm"
          variant={leaderboardType === 'xp' ? 'default' : 'outline'}
          onClick={() => setLeaderboardType('xp')}
          className="flex-1 text-xs"
        >
          <Zap className="w-3 h-3 mr-1" />
          XP
        </Button>
      </div>

      {/* Brain Type Filter */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant={brainTypeFilter === null ? 'default' : 'outline'}
            onClick={() => setBrainTypeFilter(null)}
            className="text-xs h-7 px-2"
          >
            All
          </Button>
          <Button
            size="sm"
            variant={brainTypeFilter === 'INTENSE' ? 'default' : 'outline'}
            onClick={() => setBrainTypeFilter('INTENSE')}
            className="text-xs h-7 px-2"
          >
            Intense
          </Button>
          <Button
            size="sm"
            variant={brainTypeFilter === 'DISTRACTED' ? 'default' : 'outline'}
            onClick={() => setBrainTypeFilter('DISTRACTED')}
            className="text-xs h-7 px-2"
          >
            Distracted
          </Button>
          <Button
            size="sm"
            variant={brainTypeFilter === 'DEFIANT' ? 'default' : 'outline'}
            onClick={() => setBrainTypeFilter('DEFIANT')}
            className="text-xs h-7 px-2"
          >
            Defiant
          </Button>
        </div>
      </div>

      {/* Leaderboard Entries */}
      <div className="space-y-2">
        {leaderboard.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No data available yet.</p>
            <p className="text-xs mt-1">Be the first to climb the ranks!</p>
          </div>
        ) : (
          leaderboard.map((entry: LeaderboardEntry) => (
            <LeaderboardEntryCard
              key={entry.userId}
              entry={entry}
              scoreLabel={getScoreLabel()}
              scoreIcon={getScoreIcon()}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
        <p className="text-xs text-center text-muted-foreground">
          Rankings update in real-time • Compete with parents worldwide 🌍
        </p>
      </div>
    </Card>
  );
}

interface LeaderboardEntryCardProps {
  entry: LeaderboardEntry;
  scoreLabel: string;
  scoreIcon: React.ReactNode;
}

function LeaderboardEntryCard({ entry, scoreLabel, scoreIcon }: LeaderboardEntryCardProps) {
  const isTopThree = entry.rank <= 3;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border-2 transition-all",
        entry.isCurrentUser
          ? "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-300 dark:border-purple-700 shadow-md"
          : isTopThree
          ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 border-yellow-200 dark:border-yellow-800"
          : "bg-white dark:bg-slate-900/90 border-gray-200 dark:border-slate-700"
      )}
    >
      {/* Rank */}
      <div className="flex-shrink-0 w-8 text-center">
        {entry.rank <= 3 ? (
          <div className="flex items-center justify-center">
            {entry.rank === 1 && <Crown className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />}
            {entry.rank === 2 && <Medal className="w-6 h-6 text-gray-400 dark:text-gray-500" />}
            {entry.rank === 3 && <Medal className="w-6 h-6 text-amber-600 dark:text-amber-500" />}
          </div>
        ) : (
          <span className="text-sm font-bold text-muted-foreground">
            #{entry.rank}
          </span>
        )}
      </div>

      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md",
          entry.avatarColor
        )}
      >
        {entry.initials}
      </div>

      {/* Name & Brain Type */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate flex items-center gap-2 text-foreground">
          <span>{entry.name}</span>
          {entry.isCurrentUser && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0 dark:bg-slate-700 dark:text-slate-200">
              You
            </Badge>
          )}
        </div>
        {entry.brainType && (
          <Badge variant="outline" className="text-xs mt-0.5 dark:border-slate-600">
            {entry.brainType}
          </Badge>
        )}
      </div>

      {/* Score */}
      <div className="flex-shrink-0 text-right">
        <div className="flex items-center gap-1 font-bold text-lg text-foreground">
          {scoreIcon}
          <span>{entry.score.toLocaleString()}</span>
        </div>
        <p className="text-xs text-muted-foreground">{scoreLabel}</p>
      </div>
    </div>
  );
}
