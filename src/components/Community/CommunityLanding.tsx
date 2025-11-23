import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users as UsersIcon, Sparkles } from 'lucide-react';
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

const PROFILE_GRADIENTS: Record<string, string> = {
  'INTENSE': 'from-orange-500/90 to-orange-600/90',
  'DEFIANT': 'from-purple-500/90 to-purple-600/90',
  'DISTRACTED': 'from-blue-500/90 to-blue-600/90',
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

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay: index * 0.1,
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow"
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${community.gradient}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>
      
      {/* Emoji decoration */}
      <div className="absolute top-4 right-4 text-5xl opacity-30 group-hover:opacity-40 transition-opacity">
        {community.logo_emoji}
      </div>

      {/* Content */}
      <div className="relative h-full min-h-[200px] p-5 flex flex-col justify-end">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.2 }}
        >
          <h3 className="text-white font-bold text-xl mb-2 drop-shadow-lg text-left leading-tight">
            {community.name}
          </h3>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="text-xs bg-white/20 text-white border-white/30 backdrop-blur-md font-medium px-2.5 py-1"
            >
              {community.profile}
            </Badge>
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md rounded-full px-2.5 py-1 border border-white/30">
              <UsersIcon className="w-3.5 h-3.5 text-white" />
              <span className="text-white text-xs font-semibold">{community.memberCount}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
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
      transition={{ delay: index * 0.05 }}
      className="relative rounded-3xl overflow-hidden bg-muted/50 h-[200px] animate-pulse"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50" />
      <div className="relative h-full p-5 flex flex-col justify-end">
        <div className="bg-muted-foreground/20 h-6 w-32 rounded-lg mb-2" />
        <div className="flex items-center gap-2">
          <div className="bg-muted-foreground/20 h-6 w-20 rounded-full" />
          <div className="bg-muted-foreground/20 h-6 w-12 rounded-full" />
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
            gradient: PROFILE_GRADIENTS[profile] || 'from-gray-500/90 to-gray-600/90',
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95 flex flex-col relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Section - Community Cards Grid */}
      <div className="flex-1 relative z-10" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)' }}>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-4 px-4 pt-4"
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
              className="grid grid-cols-2 gap-4 px-4 pt-4"
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

      {/* Bottom Section - Content and CTAs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="relative z-10 bg-gradient-to-t from-background via-background to-transparent flex flex-col items-center justify-center px-6 py-12 pb-safe"
      >
        <div className="max-w-md w-full text-center">
          {/* Title with icon */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
              Parenting is easier together
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed"
          >
            Join a community and see how other parents are using NEP scripts
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="flex flex-col gap-3"
          >
            <Button
              size="lg"
              onClick={onCreateCommunity}
              className="w-full h-14 text-base bg-primary hover:bg-primary/90 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Create New Community
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onJoinCommunity}
              className="w-full h-14 text-base border-2 hover:bg-accent rounded-full font-semibold transition-all"
            >
              Join Existing Community
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
});
