import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TUTORIAL_STEPS = [
  {
    title: 'To join a group, ask the leader to invite you',
    subtitle: 'Have the group leader follow these steps',
    image: '/placeholder.svg',
  },
  {
    title: 'The leader shares the invite link',
    subtitle: 'They will send you a special link',
    image: '/placeholder.svg',
  },
  {
    title: 'Click the link to join!',
    subtitle: 'Open the link they sent you',
    image: '/placeholder.svg',
  },
];

export default function JoinTutorial() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/community');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = TUTORIAL_STEPS[currentStep];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 pt-[env(safe-area-inset-top)] px-4 pb-4 bg-[#0d0d0d]">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center hover:bg-[#333] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="pt-[calc(env(safe-area-inset-top)+80px)] pb-[calc(env(safe-area-inset-bottom)+120px)] px-6 flex flex-col items-center">
        {/* Illustration */}
        <div className="w-full max-w-md aspect-square bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] flex items-center justify-center mb-8">
          <div className="text-8xl">📱</div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-3">{step.title}</h2>
        <p className="text-gray-400 text-center mb-8">{step.subtitle}</p>

        {/* Pagination Dots */}
        <div className="flex gap-2 mb-12">
          {TUTORIAL_STEPS.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStep ? 'bg-white w-6' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(env(safe-area-inset-bottom)+16px)] bg-[#0d0d0d] border-t border-[#2a2a2a]">
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              className="w-12 h-14 rounded-[30px] border-2 border-white flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1 h-14 bg-white text-black rounded-[30px] font-medium hover:bg-gray-100"
          >
            {currentStep === TUTORIAL_STEPS.length - 1 ? 'Done' : 'Continue'}
            {currentStep < TUTORIAL_STEPS.length - 1 && <ChevronRight className="w-5 h-5 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
