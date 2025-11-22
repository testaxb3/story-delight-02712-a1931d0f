import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Image, Trash2 } from 'lucide-react';

interface CreateCommunityLogoStepProps {
  communityName: string;
  onContinue: (logo: string) => void;
}

const LOGO_OPTIONS = [
  { emoji: '🍒', gradient: 'from-pink-500 to-red-500' },
  { emoji: '🏋️', gradient: 'from-orange-500 to-orange-600' },
  { emoji: '🍳', gradient: 'from-pink-500 to-pink-600' },
  { emoji: '🌿', gradient: 'from-green-500 to-green-600' },
  { emoji: '🎨', gradient: 'from-purple-500 to-purple-600' },
  { emoji: '⭐', gradient: 'from-yellow-500 to-yellow-600' },
];

export function CreateCommunityLogoStep({ communityName, onContinue }: CreateCommunityLogoStepProps) {
  const [selectedLogo, setSelectedLogo] = useState(LOGO_OPTIONS[1]);

  const handleContinue = () => {
    onContinue(selectedLogo.emoji);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-3 text-white">Add group logo</h1>
      <p className="text-gray-400 mb-12">Choose an image that represents your group</p>

      {/* Logo Carousel */}
      <div className="flex justify-center gap-4 mb-8 overflow-x-auto pb-4">
        {LOGO_OPTIONS.map((logo, index) => (
          <button
            key={index}
            onClick={() => setSelectedLogo(logo)}
            className={`flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br ${logo.gradient} flex items-center justify-center text-4xl transition-all ${
              selectedLogo === logo ? 'ring-4 ring-white ring-offset-4 ring-offset-[#0a0a0a]' : ''
            }`}
          >
            {logo.emoji}
          </button>
        ))}
      </div>

      <p className="text-center text-gray-400 text-sm mb-4">
        &lt;&lt; Swipe to select a photo &gt;&gt;
      </p>

      <p className="text-center text-gray-400 mb-4">OR</p>

      <Button
        variant="outline"
        className="w-full h-14 mb-12 bg-transparent border-white/20 text-white hover:bg-white/10 rounded-full"
      >
        <Image className="w-5 h-5 mr-2" />
        Upload a photo
      </Button>

      {/* Selected Logo Preview */}
      {selectedLogo && (
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div
              className={`w-40 h-40 rounded-full bg-gradient-to-br ${selectedLogo.gradient} flex items-center justify-center text-7xl mb-4`}
            >
              {selectedLogo.emoji}
            </div>
            <button className="absolute top-0 right-0 w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center hover:bg-[#3a3a3a] transition-colors">
              <Trash2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      )}

      <Button
        onClick={handleContinue}
        className="w-full h-14 text-lg bg-white text-black hover:bg-white/90 rounded-full"
      >
        Continue
      </Button>
    </div>
  );
}
