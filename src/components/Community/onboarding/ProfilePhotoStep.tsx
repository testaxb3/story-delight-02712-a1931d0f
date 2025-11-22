import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Image } from 'lucide-react';

interface ProfilePhotoStepProps {
  firstName: string;
  lastName: string;
  onContinue: (photoUrl: string) => void;
}

const AVATAR_COLORS = [
  'from-blue-500 to-blue-600',
  'from-green-500 to-green-600',
  'from-orange-500 to-orange-600',
  'from-pink-500 to-pink-600',
  'from-purple-500 to-purple-600',
  'from-red-500 to-red-600',
];

export function ProfilePhotoStep({ firstName, lastName, onContinue }: ProfilePhotoStepProps) {
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[2]);
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const handleContinue = () => {
    // TODO: Save avatar color preference
    onContinue(selectedColor);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-3 text-white">Add a profile photo</h1>
      <p className="text-gray-400 mb-12">
        Your profile photo helps others recognize you in groups
      </p>

      {/* Avatar Carousel */}
      <div className="flex justify-center gap-4 mb-8 overflow-x-auto pb-4">
        {AVATAR_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`flex-shrink-0 ${
              selectedColor === color ? 'ring-4 ring-white ring-offset-4 ring-offset-transparent' : ''
            } rounded-full transition-all`}
          >
            <Avatar className="w-20 h-20">
              <AvatarFallback className={`bg-gradient-to-br ${color} text-white text-2xl font-bold`}>
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        ))}
      </div>

      <p className="text-center text-gray-400 text-sm mb-4">
        &lt;&lt; Swipe to select a photo &gt;&gt;
      </p>

      <p className="text-center text-gray-400 mb-4">OR</p>

      <Button
        variant="outline"
        className="w-full h-14 mb-8 bg-transparent border-white/20 text-white hover:bg-white/10 rounded-full"
      >
        <Image className="w-5 h-5 mr-2" />
        Upload a photo
      </Button>

      <Button
        onClick={handleContinue}
        className="w-full h-14 text-lg bg-white text-black hover:bg-white/90 rounded-full"
      >
        Continue
      </Button>
    </div>
  );
}
