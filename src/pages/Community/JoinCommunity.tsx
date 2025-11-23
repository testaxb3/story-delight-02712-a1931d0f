import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users as UsersIcon, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';

interface UserCommunity {
  id: string;
  name: string;
  logo_emoji: string | null;
  logo_url: string | null;
  description: string | null;
  invite_code: string;
  memberCount: number;
  created_by: string;
  created_at: string;
}

// Memoized Community Card
const CommunityCard = memo(function CommunityCard({
  community,
  index,
  onJoin,
  isJoining,
}: {
  community: UserCommunity;
  index: number;
  onJoin: (community: UserCommunity) => void;
  isJoining: boolean;
}) {
  const handleClick = useCallback(() => {
    if (!isJoining) onJoin(community);
  }, [community, onJoin, isJoining]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-4 hover:border-primary/50 transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          {community.logo_url ? (
            <img
              src={community.logo_url}
              alt=""
              className="w-16 h-16 rounded-full object-cover ring-2 ring-border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-3xl shadow-lg">
              {community.logo_emoji || '👥'}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1 truncate">{community.name}</h3>
          {community.description && (
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {community.description}
            </p>
          )}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <UsersIcon className="w-3 h-3 mr-1" />
              {community.memberCount}
            </Badge>
          </div>
        </div>

        {/* Join Button */}
        <Button
          size="sm"
          onClick={handleClick}
          disabled={isJoining}
          className="flex-shrink-0"
        >
          {isJoining ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Join'
          )}
        </Button>
      </div>
    </motion.div>
  );
});

// Loading Skeleton
const CommunitySkeleton = memo(function CommunitySkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card/30 border border-border rounded-2xl p-4 animate-pulse"
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-muted" />
        <div className="flex-1">
          <div className="h-5 bg-muted rounded w-32 mb-2" />
          <div className="h-4 bg-muted rounded w-full mb-2" />
          <div className="h-6 bg-muted rounded w-16" />
        </div>
        <div className="w-16 h-9 bg-muted rounded" />
      </div>
    </motion.div>
  );
});

// Empty State
const EmptyState = memo(function EmptyState({ searchQuery }: { searchQuery: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
        <Search className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">
        {searchQuery ? 'No communities found' : 'No user communities yet'}
      </h3>
      <p className="text-muted-foreground text-sm">
        {searchQuery
          ? 'Try a different search term'
          : 'Be the first to create a community!'}
      </p>
    </motion.div>
  );
});

export default function JoinCommunity() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [communities, setCommunities] = useState<UserCommunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const loadCommunities = useCallback(async () => {
    try {
      setLoading(true);

      // Load user-created communities (non-official)
      let query = supabase
        .from('communities')
        .select('id, name, logo_emoji, logo_url, description, invite_code, created_by, created_at')
        .eq('is_official', false)
        .order('created_at', { ascending: false });

      // Apply search filter if present
      if (debouncedSearch) {
        query = query.ilike('name', `%${debouncedSearch}%`);
      }

      const { data: communitiesData, error } = await query;

      if (error) throw error;

      // Load member counts
      const communitiesWithCounts = await Promise.all(
        (communitiesData || []).map(async (community) => {
          const { count } = await supabase
            .from('community_members')
            .select('*', { count: 'exact', head: true })
            .eq('community_id', community.id);

          return {
            ...community,
            memberCount: count || 0,
          };
        })
      );

      setCommunities(communitiesWithCounts);
    } catch (error: any) {
      console.error('Error loading communities:', error);
      toast.error('Failed to load communities');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    loadCommunities();
  }, [loadCommunities]);

  const handleJoinCommunity = useCallback(
    async (community: UserCommunity) => {
      if (!user?.profileId) {
        toast.error('Please log in to join a community');
        return;
      }

      setJoiningId(community.id);

      try {
        // Check if already a member
        const { data: existing } = await supabase
          .from('community_members')
          .select('id')
          .eq('community_id', community.id)
          .eq('user_id', user.profileId)
          .maybeSingle();

        if (existing) {
          toast.success('You are already a member!');
          navigate('/community/feed', { state: { communityId: community.id, refresh: true } });
          return;
        }

        // Join the community
        const { error: insertError } = await supabase
          .from('community_members')
          .insert({
            community_id: community.id,
            user_id: user.profileId,
            role: 'member',
          });

        if (insertError) throw insertError;

        await new Promise((resolve) => setTimeout(resolve, 300));

        toast.success(`Welcome to ${community.name}! 🎉`);
        navigate('/community/feed', { state: { communityId: community.id, refresh: true } });
      } catch (error: any) {
        console.error('Error joining community:', error);
        toast.error('Failed to join community');
      } finally {
        setJoiningId(null);
      }
    },
    [user?.profileId, navigate]
  );

  const skeletonArray = useMemo(() => [0, 1, 2, 3], []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div
          className="px-4 py-4"
          style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/community')}
              className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">Join Community</h1>
              <p className="text-sm text-muted-foreground">
                Discover user-created communities
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-full bg-muted/50 border-0"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className="px-4 py-6 space-y-4 relative z-10"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {skeletonArray.map((i) => (
                <CommunitySkeleton key={i} index={i} />
              ))}
            </motion.div>
          ) : communities.length === 0 ? (
            <EmptyState key="empty" searchQuery={debouncedSearch} />
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {communities.map((community, index) => (
                <CommunityCard
                  key={community.id}
                  community={community}
                  index={index}
                  onJoin={handleJoinCommunity}
                  isJoining={joiningId === community.id}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
