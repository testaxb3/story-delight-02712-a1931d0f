import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ConfirmNameStepProps {
  initialFirstName?: string;
  initialLastName?: string;
  onContinue: (firstName: string, lastName: string) => void;
}

export function ConfirmNameStep({ initialFirstName = '', initialLastName = '', onContinue }: ConfirmNameStepProps) {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);

  useEffect(() => {
    setFirstName(initialFirstName);
    setLastName(initialLastName);
  }, [initialFirstName, initialLastName]);

  const handleContinue = () => {
    if (firstName.trim() && lastName.trim()) {
      onContinue(firstName.trim(), lastName.trim());
    }
  };

  return (
    <div className="flex flex-col h-full justify-between pt-8">
      <div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-white">Confirm your name</h1>
        <p className="text-base text-gray-400 mb-12">
          This is the name other parents will see in communities
        </p>

        <div className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder=" "
              className="peer w-full h-16 px-4 pt-5 pb-2 bg-transparent border border-[#333] rounded-xl text-white text-base focus:outline-none focus:border-gray-500 transition-colors"
            />
            <label className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-all peer-focus:top-3 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs">
              First Name
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder=" "
              className="peer w-full h-16 px-4 pt-5 pb-2 bg-transparent border border-[#333] rounded-xl text-white text-base focus:outline-none focus:border-gray-500 transition-colors"
            />
            <label className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-all peer-focus:top-3 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs">
              Last Name
            </label>
          </div>
        </div>
      </div>

      <div className="pb-8">
        <Button
          onClick={handleContinue}
          disabled={!firstName.trim() || !lastName.trim()}
          className="w-full h-14 text-base bg-white text-black hover:bg-white/90 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
