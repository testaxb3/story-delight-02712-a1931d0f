import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CreateGroupName() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');

  const handleContinue = () => {
    if (groupName.trim()) {
      navigate('/community/add-logo', { state: { groupName: groupName.trim() } });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 pt-[env(safe-area-inset-top)] px-4 pb-4 bg-background">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover:bg-card/80 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold">Create group name</h1>
          </div>
          <div className="w-10" />
        </div>
        <p className="text-center text-sm text-gray-400 mt-2">
          Choose a name for your parenting community
        </p>
      </div>

      {/* Content */}
      <div className="pt-[calc(env(safe-area-inset-top)+120px)] pb-[calc(env(safe-area-inset-bottom)+100px)] px-6">
        <div className="relative">
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder=" "
            maxLength={50}
            className="peer w-full h-14 px-4 bg-transparent border border-[#333] rounded-xl text-white focus:outline-none focus:border-gray-500 transition-colors"
          />
          <label className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-all pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs">
            Group Name
          </label>
        </div>
        <p className="text-right text-sm text-gray-400 mt-2">{groupName.length}/50</p>

        {/* Suggestions */}
        <div className="mt-8">
          <p className="text-sm text-gray-400 mb-3">Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'INTENSE Parents Circle',
              'Calm Parenting Squad',
              'Mindful Moms & Dads',
              'Positive Discipline Team',
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setGroupName(suggestion)}
                className="px-4 py-2 bg-card border border-border rounded-full hover:bg-card/80 hover:border-primary/20 transition-colors text-sm">
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(env(safe-area-inset-bottom)+16px)] bg-[#0d0d0d]">
        <Button
          onClick={handleContinue}
          disabled={!groupName.trim()}
          className="w-full h-14 bg-white text-black rounded-[30px] font-medium hover:bg-gray-100 disabled:opacity-50"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
