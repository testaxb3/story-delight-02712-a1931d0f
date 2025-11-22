import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ConfirmNameStep } from './onboarding/ConfirmNameStep';
import { ProfilePhotoStep } from './onboarding/ProfilePhotoStep';
import { UsernameStep } from './onboarding/UsernameStep';

interface CommunityOnboardingProps {
  onComplete: () => void;
}

export function CommunityOnboarding({ onComplete }: CommunityOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<'name' | 'photo' | 'username'>('name');
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    photoUrl: '',
    username: '',
  });

  const handleNameComplete = (firstName: string, lastName: string) => {
    setUserData({ ...userData, firstName, lastName });
    setCurrentStep('photo');
  };

  const handlePhotoComplete = (photoUrl: string) => {
    setUserData({ ...userData, photoUrl });
    setCurrentStep('username');
  };

  const handleUsernameComplete = (username: string) => {
    setUserData({ ...userData, username });
    // Save to database
    onComplete();
  };

  const handleBack = () => {
    if (currentStep === 'photo') setCurrentStep('name');
    else if (currentStep === 'username') setCurrentStep('photo');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2a2a3e] to-[#1a1a2a] px-4 py-8 pb-24">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="mb-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>

      {currentStep === 'name' && (
        <ConfirmNameStep onContinue={handleNameComplete} />
      )}

      {currentStep === 'photo' && (
        <ProfilePhotoStep
          firstName={userData.firstName}
          lastName={userData.lastName}
          onContinue={handlePhotoComplete}
        />
      )}

      {currentStep === 'username' && (
        <UsernameStep onContinue={handleUsernameComplete} />
      )}
    </div>
  );
}
