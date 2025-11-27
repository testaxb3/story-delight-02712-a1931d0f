import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { CreateCommunityNameStep } from './create/CreateCommunityNameStep';
import { CreateCommunityLogoStep } from './create/CreateCommunityLogoStep';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CreateCommunityFlowProps {
  onComplete: (communityId: string) => void;
  onBack: () => void;
}

export function CreateCommunityFlow({ onComplete, onBack }: CreateCommunityFlowProps) {
  const { user } = useAuth();
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
    if (!user) {
      toast.error('You must be logged in to create a community');
      return;
    }

    try {
      const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const { data: newCommunity, error } = await supabase
        .from('communities')
        .insert({
          name: communityData.name,
          description: communityData.description,
          logo_emoji: logo,
          created_by: user.id,
          invite_code: inviteCode,
        })
        .select()
        .single();

      if (error) throw error;

      // Add creator as leader
      await supabase.from('community_members').insert({
        community_id: newCommunity.id,
        user_id: user.id,
        role: 'leader',
      });

      toast.success('Community created successfully!');
      onComplete(newCommunity.id);
    } catch (error) {
      console.error('Error creating community:', error);
      toast.error('Failed to create community');
    }
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
