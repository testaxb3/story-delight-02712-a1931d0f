import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UsernameStepProps {
  onContinue: (username: string) => void;
}

export function UsernameStep({ onContinue }: UsernameStepProps) {
  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    if (username.length >= 3) {
      checkAvailability();
    } else {
      setIsAvailable(null);
    }
  }, [username]);

  const checkAvailability = async () => {
    setIsChecking(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase())
        .maybeSingle();

      if (error) throw error;
      setIsAvailable(!data);
    } catch (error) {
      console.error('Error checking username:', error);
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleContinue = () => {
    if (username.trim() && isAvailable) {
      onContinue(username.trim());
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-3 text-white">Create a username</h1>
      <p className="text-gray-400 mb-12">This helps others find you in groups</p>

      <div className="mb-8">
        <label className="text-sm text-gray-500 mb-2 block">Username</label>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
          placeholder="username"
          className="h-14 bg-[#1a1a2a] border-white/20 text-white text-lg"
        />
        {username.length >= 3 && (
          <div className="flex items-center gap-2 mt-2">
            {isChecking ? (
              <span className="text-sm text-gray-400">Checking availability...</span>
            ) : isAvailable ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500">This username is available</span>
              </>
            ) : (
              <>
                <X className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-500">This username is taken</span>
              </>
            )}
          </div>
        )}
      </div>

      <Button
        onClick={handleContinue}
        disabled={!username.trim() || !isAvailable || isChecking}
        className="w-full h-14 text-lg bg-white text-black hover:bg-white/90 rounded-full"
      >
        Continue
      </Button>
    </div>
  );
}
