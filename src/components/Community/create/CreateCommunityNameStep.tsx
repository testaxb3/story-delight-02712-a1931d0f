import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CreateCommunityNameStepProps {
  onContinue: (name: string, description: string) => void;
}

const SUGGESTED_NAMES = [
  'Calm Parents',
  'ADHD Warriors',
  'Bedtime Heroes',
  'Defiant Kids Support',
];

export function CreateCommunityNameStep({ onContinue }: CreateCommunityNameStepProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleContinue = () => {
    if (name.trim() && description.trim()) {
      onContinue(name.trim(), description.trim());
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-3 text-white">Create group name</h1>
      <p className="text-gray-400 mb-12">
        Pick something fun or goal-focused. Your group name helps set the vibe.
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-sm text-gray-500 mb-2 block">Group Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Group Name"
            className="h-14 bg-[#1a1a1a] border-[#2a2a2a] text-white text-lg"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-2 block">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="min-h-[100px] bg-[#1a1a1a] border-[#2a2a2a] text-white"
          />
        </div>
      </div>

      {/* Suggested Names */}
      <div className="flex flex-wrap gap-2 mb-8">
        {SUGGESTED_NAMES.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setName(suggestion)}
            className="px-4 py-2 rounded-full bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <Button
        onClick={handleContinue}
        disabled={!name.trim() || !description.trim()}
        className="w-full h-14 text-lg bg-white text-black hover:bg-white/90 rounded-full"
      >
        Continue
      </Button>
    </div>
  );
}
