import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ConfirmNameStep } from './onboarding/ConfirmNameStep';
import { ProfilePhotoStep } from './onboarding/ProfilePhotoStep';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CommunityOnboardingProps {
  onComplete: () => void;
}

export function CommunityOnboarding({ onComplete }: CommunityOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<'name' | 'photo'>('name');
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    photoUrl: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('name, photo_url')
      .eq('id', user.id)
      .single();

    if (profile?.name) {
      const [firstName, ...lastNameParts] = profile.name.split(' ');
      setUserData({
        firstName: firstName || '',
        lastName: lastNameParts.join(' ') || '',
        photoUrl: profile.photo_url || '',
      });
    }
  };

  const handleNameComplete = (firstName: string, lastName: string) => {
    setUserData({ ...userData, firstName, lastName });
    setCurrentStep('photo');
  };

  const handlePhotoComplete = async (photoUrl: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fullName = `${userData.firstName} ${userData.lastName}`.trim();

      const { error } = await supabase
        .from('profiles')
        .update({
          name: fullName,
          photo_url: photoUrl,
          community_onboarding_completed: true,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your community profile has been set up successfully.",
      });

      onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    if (currentStep === 'photo') setCurrentStep('name');
  };

  const canGoBack = currentStep === 'photo';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Back Button */}
      {canGoBack && (
        <div className="px-4 pt-8 pb-4">
          <button
            onClick={handleBack}
            className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      <div className="flex-1 px-6 pb-safe">
        {currentStep === 'name' && (
          <ConfirmNameStep 
            initialFirstName={userData.firstName}
            initialLastName={userData.lastName}
            onContinue={handleNameComplete} 
          />
        )}

        {currentStep === 'photo' && (
          <ProfilePhotoStep
            firstName={userData.firstName}
            lastName={userData.lastName}
            onContinue={handlePhotoComplete}
          />
        )}
      </div>
    </div>
  );
}
