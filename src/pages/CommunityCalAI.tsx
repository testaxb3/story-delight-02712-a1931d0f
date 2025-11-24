import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { CommunityLanding } from '@/components/Community/CommunityLanding';
import { CommunityOnboarding } from '@/components/Community/CommunityOnboarding';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function CommunityCalAI() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { inviteCode } = useParams();
  const [currentFlow, setCurrentFlow] = useState<'landing' | 'onboarding' | 'join-preview'>('landing');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [communityPreview, setCommunityPreview] = useState<any>(null);

  useEffect(() => {
    checkUserStatus();
  }, [user]);

  useEffect(() => {
    if (inviteCode && hasCompletedOnboarding) {
      handleDeepLink(inviteCode);
    }
  }, [inviteCode, hasCompletedOnboarding]);

  const checkUserStatus = async () => {
    if (!user?.profileId) return;

    // Check if user has completed community onboarding
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, nickname, photo_url, community_onboarding_completed')
      .eq('id', user.profileId)
      .single();

    // User has completed onboarding if they have name, nickname and photo, OR if the flag is set
    const onboardingComplete = (profile?.name && profile?.nickname && profile?.photo_url) || profile?.community_onboarding_completed || false;
    setHasCompletedOnboarding(onboardingComplete);

    // Only handle deep link if invite code is present
    if (inviteCode && onboardingComplete) {
      handleDeepLink(inviteCode);
    }
  };

  const handleDeepLink = async (code: string) => {
    if (!user?.profileId) return;

    // Load community preview
    const { data: community, error } = await supabase
      .from('communities')
      .select('id, name, logo_emoji, logo_url')
      .eq('invite_code', code)
      .single();

    if (error || !community) {
      toast.error('Invalid invite link');
      setCurrentFlow('landing');
      return;
    }

    // Check if already member
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

    // Get member count
    const { count } = await supabase
      .from('community_members')
      .select('*', { count: 'exact', head: true })
      .eq('community_id', community.id);

    setCommunityPreview({ ...community, memberCount: count || 0 });
    setCurrentFlow('join-preview');
  };

  const handleJoinCommunity = async () => {
    if (!communityPreview || !user?.profileId) return;

    const { error } = await supabase
      .from('community_members')
      .insert({
        community_id: communityPreview.id,
        user_id: user.profileId,
        role: 'member',
      });

    if (error) {
      console.error('Error joining community:', error);
      toast.error('Failed to join community');
      return;
    }

    toast.success('Joined community successfully!');
    navigate('/community/feed', { state: { communityId: communityPreview.id } });
  };

  const handleStartCreate = () => {
    if (!hasCompletedOnboarding) {
      setCurrentFlow('onboarding');
    } else {
      navigate('/community/create');
    }
  };

  const handleStartJoin = () => {
    if (!hasCompletedOnboarding) {
      setCurrentFlow('onboarding');
    } else {
      navigate('/community/join');
    }
  };

  const handleOnboardingComplete = async () => {
    if (!user?.profileId) return;

    // Mark onboarding as completed
    await supabase
      .from('profiles')
      .update({ community_onboarding_completed: true })
      .eq('id', user.profileId);

    setHasCompletedOnboarding(true);
    setCurrentFlow('landing');
    toast.success('Profile complete!');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <MainLayout>
      {currentFlow === 'landing' && (
        <CommunityLanding
          onCreateCommunity={handleStartCreate}
          onJoinCommunity={handleStartJoin}
        />
      )}

      {currentFlow === 'onboarding' && (
        <CommunityOnboarding onComplete={handleOnboardingComplete} />
      )}

      {currentFlow === 'join-preview' && communityPreview && (
        <div className="px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-6">
              {communityPreview.logo_url ? (
                <img src={communityPreview.logo_url} alt="" className="w-32 h-32 rounded-full mx-auto" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-6xl mx-auto">
                  {communityPreview.logo_emoji || '💪'}
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2">{communityPreview.name}</h2>
            <p className="text-muted-foreground mb-2">{communityPreview.memberCount} members</p>
            <p className="text-sm text-muted-foreground mb-8">Join this parenting community</p>
            <button
              onClick={handleJoinCommunity}
              className="w-full h-14 bg-white dark:bg-white text-black rounded-[30px] font-medium hover:bg-gray-100"
            >
              Join Group
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
