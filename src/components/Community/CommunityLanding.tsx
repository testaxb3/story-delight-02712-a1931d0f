import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users as UsersIcon, Sparkles, ArrowRight, Plus, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  image?: string;
}

const PROFILE_CONFIG: Record<string, { gradient: string; icon: string; image: string }> = {
  'INTENSE': { 
    gradient: 'from-orange-500 via-red-500 to-rose-600', 
    icon: '🔥',
    image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=2070&auto=format&fit=crop' // Intense/Fire
  },
  'DEFIANT': { 
    gradient: 'from-purple-600 via-indigo-600 to-blue-600', 
    icon: '👊',
    image: 'https://images.unsplash.com/photo-1508898578281-774ac4893c0c?q=80&w=1974&auto=format&fit=crop' // Bold/Dark
  },
  'DISTRACTED': { 
    gradient: 'from-cyan-400 via-sky-500 to-blue-500', 
    icon: '✨',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop' // Space/Light
  },
};

// Poster Style Card - Immersive
const CommunityPoster = memo(function CommunityPoster({
  community,
  index,
  onJoin,
}: {
  community: DefaultCommunity;
  index: number;
  onJoin: (community: DefaultCommunity) => void;
}) {
  const config = PROFILE_CONFIG[community.profile] || PROFILE_CONFIG['DISTRACTED'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      onClick={() => onJoin(community)}
      className="relative aspect-[4/5] rounded-[32px] overflow-hidden cursor-pointer group shadow-xl"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={config.image} 
          alt={community.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80",
          "mix-blend-multiply"
        )} />
        {/* Tint Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-40 mix-blend-overlay`} />
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        {/* Top Badge */}
        <div className="flex justify-end">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-2xl">
            {config.icon}
          </div>
        </div>

        {/* Bottom Info */}
        <div className="space-y-3">
          <Badge 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white backdrop-blur-md font-bold tracking-widest text-[10px] uppercase"
          >
            {community.profile} TRIBE
          </Badge>
          
          <h3 className="text-3xl font-black text-white leading-none tracking-tight drop-shadow-lg">
            {community.name}
          </h3>
          
          <div className="flex items-center gap-3 text-white/80">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm border border-white/10" />
              ))}
            </div>
            <span className="text-xs font-medium">{community.memberCount} members</span>
          </div>
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

  return (
    <div className="min-h-[100dvh] bg-background pb-32 overflow-x-hidden">
      {/* Header Spacer */}
      <div className="w-full h-[calc(env(safe-area-inset-top)+20px)]" />

      {/* Header */}
      <div className="px-5 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-1">Tribes</h1>
            <p className="text-muted-foreground">Find your people. Join the movement.</p>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full w-10 h-10 border-2"
            onClick={onJoinCommunity}
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Horizontal Scroll Snap Container */}
      <div className="px-5 mb-10">
        <div className="flex gap-4 overflow-x-auto pb-8 -mx-5 px-5 scrollbar-hide snap-x snap-mandatory">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="min-w-[85vw] sm:min-w-[320px] aspect-[4/5] rounded-[32px] bg-muted animate-pulse snap-center" />
            ))
          ) : (
            communities.map((community, index) => (
              <div key={community.id} className="min-w-[85vw] sm:min-w-[320px] snap-center">
                <CommunityPoster
                  community={community}
                  index={index}
                  onJoin={handleJoinCommunity}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create CTA */}
      <div className="px-5">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={onCreateCommunity}
          className="w-full bg-secondary/50 border-2 border-dashed border-border hover:border-primary/50 hover:bg-secondary transition-all rounded-[24px] p-6 flex flex-col items-center text-center gap-3 group"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Create Your Own Tribe</h3>
            <p className="text-sm text-muted-foreground">Start a private community for your circle</p>
          </div>
        </motion.button>
      </div>
    </div>
  );
});