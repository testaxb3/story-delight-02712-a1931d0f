import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { CommunityLanding } from '@/components/Community/CommunityLanding';
import { CommunityOnboarding } from '@/components/Community/CommunityOnboarding';
import { CommunityView } from '@/components/Community/CommunityView';
import { CreateCommunityFlow } from '@/components/Community/CreateCommunityFlow';
import { JoinCommunityFlow } from '@/components/Community/JoinCommunityFlow';
import { supabase } from '@/integrations/supabase/client';

export default function CommunityCalAI() {
  const { user } = useAuth();
  const [currentFlow, setCurrentFlow] = useState<'landing' | 'onboarding' | 'create' | 'join' | 'view'>('landing');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [userCommunityId, setUserCommunityId] = useState<string | null>(null);

  useEffect(() => {
    checkUserStatus();
  }, [user]);

  const checkUserStatus = async () => {
    if (!user) return;

    // Check if user has completed community onboarding
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, photo_url')
      .eq('id', user.id)
      .single();

    if (profile?.name) {
      setHasCompletedOnboarding(true);
      
      // Check if user belongs to a community
      // TODO: Add community membership check when DB schema is ready
      // For now, show landing
      setCurrentFlow('landing');
    }
  };

  const handleStartCreate = () => {
    if (!hasCompletedOnboarding) {
      setCurrentFlow('onboarding');
      // After onboarding, will switch to create
    } else {
      setCurrentFlow('create');
    }
  };

  const handleStartJoin = () => {
    if (!hasCompletedOnboarding) {
      setCurrentFlow('onboarding');
      // After onboarding, will switch to join
    } else {
      setCurrentFlow('join');
    }
  };

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
    // TODO: Determine next flow based on intent
    setCurrentFlow('landing');
  };

  const handleCreateComplete = (communityId: string) => {
    setUserCommunityId(communityId);
    setCurrentFlow('view');
  };

  const handleJoinComplete = (communityId: string) => {
    setUserCommunityId(communityId);
    setCurrentFlow('view');
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

      {currentFlow === 'create' && (
        <CreateCommunityFlow
          onComplete={handleCreateComplete}
          onBack={() => setCurrentFlow('landing')}
        />
      )}

      {currentFlow === 'join' && (
        <JoinCommunityFlow
          onComplete={handleJoinComplete}
          onBack={() => setCurrentFlow('landing')}
        />
      )}

      {currentFlow === 'view' && userCommunityId && (
        <CommunityView
          communityId={userCommunityId}
          onLeave={() => setCurrentFlow('landing')}
        />
      )}
    </MainLayout>
  );
}
