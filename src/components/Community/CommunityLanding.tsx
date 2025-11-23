import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users as UsersIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
  'INTENSE': 'from-orange-500 to-orange-600',
  'DEFIANT': 'from-purple-500 to-purple-600',
  'DISTRACTED': 'from-blue-500 to-blue-600',
};

export function CommunityLanding({ onCreateCommunity, onJoinCommunity }: CommunityLandingProps) {
  const [communities, setCommunities] = useState<DefaultCommunity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDefaultCommunities();
  }, []);

  const loadDefaultCommunities = async () => {
    try {
      // Load the 3 default communities
      const { data: communitiesData, error } = await supabase
        .from('communities')
        .select('id, name, logo_emoji, description, invite_code')
        .in('invite_code', ['INTENSE2024', 'DEFIANT2024', 'DISTRACTED2024'])
        .order('invite_code');

      if (error) throw error;

      // Load member counts for each community
      const communitiesWithCounts = await Promise.all(
        (communitiesData || []).map(async (community) => {
          const { count } = await supabase
            .from('community_members')
            .select('*', { count: 'exact', head: true })
            .eq('community_id', community.id);

          // Determine profile type from invite code
          const profile = community.invite_code.replace('2024', '');
          
          return {
            ...community,
            memberCount: count || 0,
            gradient: PROFILE_GRADIENTS[profile] || 'from-gray-500 to-gray-600',
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
  };

  const handleJoinCommunity = async (community: DefaultCommunity) => {
    if (!user?.profileId) {
      toast.error('Please log in to join a community');
      return;
    }

    try {
      // Check if already a member
      const { data: existing } = await supabase
        .from('community_members')
        .select('id')
        .eq('community_id', community.id)
        .eq('user_id', user.profileId)
        .single();

      if (existing) {
        toast.success('You are already a member!');
        navigate('/community/feed', { state: { communityId: community.id } });
        return;
      }

      // Join the community
      const { error } = await supabase
        .from('community_members')
        .insert({
          community_id: community.id,
          user_id: user.profileId,
          role: 'member',
        });

      if (error) throw error;

      toast.success(`Joined ${community.name}!`);
      navigate('/community/feed', { state: { communityId: community.id } });
    } catch (error: any) {
      console.error('Error joining community:', error);
      toast.error('Failed to join community');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Section - Community Cards Grid (55% of viewport) */}
      <div className="h-[55vh] relative overflow-hidden" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 8px)' }}>
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 px-4 h-full content-start pt-4">
            {communities.map((community) => (
              <button
                key={community.id}
                onClick={() => handleJoinCommunity(community)}
                className="relative rounded-2xl overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {/* Gradient background with emoji */}
                <div className={`absolute inset-0 bg-gradient-to-br ${community.gradient} flex items-center justify-center`}>
                  <span className="text-6xl opacity-20">{community.logo_emoji}</span>
                </div>
                
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

                {/* Content */}
                <div className="relative h-full min-h-[180px] p-4 flex flex-col justify-end">
                  <h3 className="text-white font-semibold text-lg mb-1 drop-shadow-lg text-left">
                    {community.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="text-xs bg-black/40 text-white border-white/20 backdrop-blur-sm"
                    >
                      {community.profile}
                    </Badge>
                    <div className="flex items-center gap-1 text-white/80 text-xs">
                      <UsersIcon className="w-3 h-3" />
                      <span>{community.memberCount}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Section - Content and CTAs (45% of viewport) */}
      <div className="flex-1 bg-background flex flex-col items-center justify-center px-6 py-8 pb-safe">
        <div className="max-w-md w-full text-center">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-white leading-tight">
            Parenting is easier together 💪
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-400 mb-8">
            Join a community and see how other parents are using NEP scripts
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              onClick={onCreateCommunity}
              className="w-full h-14 text-base bg-white text-black hover:bg-white/90 rounded-full font-medium"
            >
              Create New Community
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onJoinCommunity}
              className="w-full h-14 text-base bg-transparent border-2 border-gray-600 text-white hover:bg-white/5 hover:border-gray-500 rounded-full font-medium"
            >
              Join Existing Community
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
