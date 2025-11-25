import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users as UsersIcon, Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface CommunityLandingProps {
  onCreateCommunity: () => void;
  onJoinCommunity: () => void;
}

interface DefaultCommunity {
  id: string;
  name: string;
  logo_emoji: string;
  description: string | null;
  invite_code: string;
  memberCount: number;
  gradient: string;
  profile: string;
}

const PROFILE_CONFIG: Record<string, { gradient: string; icon: string }> = {
  'INTENSE': { gradient: 'from-orange-500 via-orange-600 to-red-600', icon: '🔥' },
  'DEFIANT': { gradient: 'from-purple-500 via-purple-600 to-indigo-600', icon: '👊' },
  'DISTRACTED': { gradient: 'from-blue-500 via-blue-600 to-cyan-600', icon: '✨' },
};

// Memoized Community Card Component
const CommunityCard = memo(function CommunityCard({
  community,
  index,
  onJoin,
}: {
  community: DefaultCommunity;
  index: number;
  onJoin: (community: DefaultCommunity) => void;
}) {
  const handleClick = useCallback(() => {
    onJoin(community);
  }, [community, onJoin]);

  const config = PROFILE_CONFIG[community.profile] || PROFILE_CONFIG['DISTRACTED'];

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.15,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      {/* Glassmorphic gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-95`}>
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/20" />

        {/* Noise texture for depth */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
        />
      </div>

      {/* Large decorative icon */}
      <div className="absolute top-4 right-4 text-[5rem] opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 select-none">
        {config.icon}
      </div>

      {/* Animated shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-56 p-6 flex flex-col justify-between">
        {/* Top: Badge */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.15 + 0.2 }}
        >
          <Badge
            variant="secondary"
            className="text-[0.7rem] bg-white/25 text-white border border-white/40 backdrop-blur-xl font-semibold px-3 py-1.5 shadow-lg"
          >
            {community.profile}
          </Badge>
        </motion.div>

        {/* Bottom: Name and Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15 + 0.3 }}
          className="space-y-3"
        >
          <h3 className="text-white font-black text-2xl drop-shadow-2xl text-left leading-tight tracking-tight">
            {community.name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-black/25 backdrop-blur-xl rounded-full px-3.5 py-2 border border-white/30 shadow-lg">
              <UsersIcon className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-bold">{community.memberCount}</span>
              <span className="text-white/80 text-xs font-medium">members</span>
            </div>

            <div className="bg-white/25 backdrop-blur-xl rounded-full p-2 border border-white/40 group-hover:bg-white/40 transition-colors">
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.button>
  );
});

// Loading Skeleton Component
const CommunitySkeleton = memo(function CommunitySkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-muted to-muted/50 h-56 animate-pulse shadow-xl"
    >
      <div className="relative h-full p-6 flex flex-col justify-between">
        <div className="bg-white/20 h-7 w-24 rounded-full" />
        <div className="space-y-3">
          <div className="bg-white/20 h-8 w-40 rounded-lg" />
          <div className="bg-white/20 h-10 w-32 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
});

export const CommunityLanding = memo(function CommunityLanding({
  onCreateCommunity,
  onJoinCommunity
}: CommunityLandingProps) {
  const [communities, setCommunities] = useState<DefaultCommunity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadDefaultCommunities = useCallback(async () => {
    try {
      const { data: communitiesData, error } = await supabase
        .from('communities')
        .select('id, name, logo_emoji, description, invite_code')
        .eq('is_official', true)
        .order('invite_code');

      if (error) throw error;

      const communitiesWithCounts = await Promise.all(
        (communitiesData || []).map(async (community) => {
          const { count } = await supabase
            .from('community_members')
            .select('*', { count: 'exact', head: true })
            .eq('community_id', community.id);

          const profile = community.invite_code.replace('2024', '');

          return {
            ...community,
            memberCount: count || 0,
            gradient: PROFILE_CONFIG[profile]?.gradient || 'from-gray-500 to-gray-600',
            profile: profile,
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
  }, []);

  useEffect(() => {
    loadDefaultCommunities();
  }, [loadDefaultCommunities]);

  const handleJoinCommunity = useCallback(async (community: DefaultCommunity) => {
    if (!user?.profileId) {
      toast.error('Please log in to join a community');
      return;
    }

    try {
      const { data: existing, error: checkError } = await supabase
        .from('community_members')
        .select('id')
        .eq('community_id', community.id)
        .eq('user_id', user.profileId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking membership:', checkError);
      }

      if (existing) {
        navigate('/community/feed', { state: { communityId: community.id, refresh: true } });
        return;
      }

      const { error: insertError } = await supabase
        .from('community_members')
        .insert({
          community_id: community.id,
          user_id: user.profileId,
          role: 'member',
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      await new Promise(resolve => setTimeout(resolve, 300));

      toast.success(`Welcome to ${community.name}! 🎉`);
      navigate('/community/feed', { state: { communityId: community.id, refresh: true } });
    } catch (error: any) {
      console.error('Error joining community:', error);
      toast.error('Failed to join community');
    }
  }, [user?.profileId, navigate]);

  const skeletonArray = useMemo(() => [0, 1, 2], []);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-background via-background to-muted/30 flex flex-col relative pb-32">
      {/* Ambient background elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 px-6 pt-8 mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            Communities
          </h1>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Join parents using NEP AI scripts
        </p>
      </motion.div>

      {/* Communities Grid */}
      <div className="flex-1 relative z-10 px-6 w-full max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-5"
            >
              {skeletonArray.map((i) => (
                <CommunitySkeleton key={i} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-5"
            >
              {communities.map((community, index) => (
                <CommunityCard
                  key={community.id}
                  community={community}
                  index={index}
                  onJoin={handleJoinCommunity}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="relative z-10 px-6 flex flex-col gap-3 mt-8 w-full max-w-2xl mx-auto"
      >
        <Button
          size="lg"
          onClick={onCreateCommunity}
          className="w-full h-14 text-base bg-primary hover:bg-primary/90 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
        >
          Create New Community
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onJoinCommunity}
          className="w-full h-14 text-base border-2 hover:bg-accent rounded-2xl font-bold transition-all"
        >
          Join Existing Community
        </Button>
      </motion.div>
    </div>
  );
});
