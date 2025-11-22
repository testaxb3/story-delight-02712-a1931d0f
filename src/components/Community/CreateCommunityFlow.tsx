import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { CreateCommunityNameStep } from './create/CreateCommunityNameStep';
import { CreateCommunityLogoStep } from './create/CreateCommunityLogoStep';

interface CreateCommunityFlowProps {
  onComplete: (communityId: string) => void;
  onBack: () => void;
}

export function CreateCommunityFlow({ onComplete, onBack }: CreateCommunityFlowProps) {
  const [currentStep, setCurrentStep] = useState<'name' | 'logo'>('name');
  const [communityData, setCommunityData] = useState({
    name: '',
    description: '',
    logo: '',
  });

  const handleNameComplete = (name: string, description: string) => {
    setCommunityData({ ...communityData, name, description });
    setCurrentStep('logo');
  };

  const handleLogoComplete = async (logo: string) => {
    setCommunityData({ ...communityData, logo });
    // TODO: Save community to database
    const communityId = 'mock-id';
    onComplete(communityId);
  };

  const handleBackClick = () => {
    if (currentStep === 'logo') {
      setCurrentStep('name');
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 pb-24">
      <button
        onClick={handleBackClick}
        className="mb-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>

      {currentStep === 'name' && (
        <CreateCommunityNameStep onContinue={handleNameComplete} />
      )}

      {currentStep === 'logo' && (
        <CreateCommunityLogoStep
          communityName={communityData.name}
          onContinue={handleLogoComplete}
        />
      )}
    </div>
  );
}
