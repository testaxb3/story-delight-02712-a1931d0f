import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ConfirmNameStepProps {
  onContinue: (firstName: string, lastName: string) => void;
}

export function ConfirmNameStep({ onContinue }: ConfirmNameStepProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleContinue = () => {
    if (firstName.trim() && lastName.trim()) {
      onContinue(firstName.trim(), lastName.trim());
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-3 text-white">Confirm your name</h1>
      <p className="text-gray-400 mb-12">This is the name others will see in groups.</p>

      <div className="space-y-4 mb-8">
        <div>
          <label className="text-sm text-gray-500 mb-2 block">First Name</label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="h-14 bg-[#1a1a2a] border-white/20 text-white text-lg"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-2 block">Last Name</label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className="h-14 bg-[#1a1a2a] border-white/20 text-white text-lg"
          />
        </div>
      </div>

      <Button
        onClick={handleContinue}
        disabled={!firstName.trim() || !lastName.trim()}
        className="w-full h-14 text-lg bg-white text-black hover:bg-white/90 rounded-full"
      >
        Continue
      </Button>
    </div>
  );
}
