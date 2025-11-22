import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface JoinCommunityFlowProps {
  onComplete: (communityId: string) => void;
  onBack: () => void;
}

const STEPS = [
  {
    number: 1,
    title: 'Step 1',
    description: 'To add members, tell your group admin to go to their group settings.',
    image: '/placeholder-step1.png',
  },
  {
    number: 2,
    title: 'Step 2',
    description: 'Tap "Copy Link"',
    image: '/placeholder-step2.png',
  },
  {
    number: 3,
    title: 'Step 3',
    description: 'Then they can share the group invite link with you.',
    image: '/placeholder-step3.png',
  },
];

export function JoinCommunityFlow({ onComplete, onBack }: JoinCommunityFlowProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const currentStep = STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2a2a3e] to-[#1a1a2a] px-4 py-8 pb-24">
      <button
        onClick={onBack}
        className="mb-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-3 text-white">
          To join a group, ask the leader to invite you
        </h1>
        <p className="text-gray-400 mb-12">Have the group leader follow these steps</p>

        {/* Step Card */}
        <Card className="bg-[#1a1a2a] border-[#2a2a2a] p-8 mb-8">
          <h2 className="text-2xl font-bold text-white text-center mb-4">
            {currentStep.title}
          </h2>
          <p className="text-gray-400 text-center mb-8">{currentStep.description}</p>

          {/* Placeholder for screenshot/illustration */}
          <div className="bg-black/50 rounded-2xl aspect-[9/16] max-w-xs mx-auto flex items-center justify-center">
            <p className="text-gray-600 text-sm">Screenshot placeholder</p>
          </div>
        </Card>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStepIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStepIndex ? 'bg-white w-6' : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          {currentStepIndex > 0 && (
            <Button
              onClick={handlePrev}
              variant="outline"
              className="flex-1 h-14 bg-transparent border-white/20 text-white hover:bg-white/10 rounded-full"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>
          )}

          <Button
            onClick={isLastStep ? onBack : handleNext}
            className="flex-1 h-14 text-lg bg-white text-black hover:bg-white/90 rounded-full"
          >
            {isLastStep ? 'Done' : 'Continue'}
            {!isLastStep && <ChevronRight className="w-5 h-5 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
