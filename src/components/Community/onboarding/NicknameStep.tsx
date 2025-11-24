import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { AtSign } from 'lucide-react';

interface NicknameStepProps {
  initialNickname?: string;
  onContinue: (nickname: string) => void;
}

export function NicknameStep({ initialNickname = '', onContinue }: NicknameStepProps) {
  const [nickname, setNickname] = useState(initialNickname);
  const [error, setError] = useState('');

  const validateNickname = (value: string): boolean => {
    if (!value || value.trim().length === 0) {
      setError('Nickname is required');
      return false;
    }

    if (value.length < 3) {
      setError('Nickname must be at least 3 characters');
      return false;
    }

    if (value.length > 20) {
      setError('Nickname must be less than 20 characters');
      return false;
    }

    // Only allow letters, numbers, underscores and hyphens
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      setError('Only letters, numbers, underscores and hyphens allowed');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNickname = nickname.trim();

    if (validateNickname(trimmedNickname)) {
      onContinue(trimmedNickname);
    }
  };

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    if (error) {
      validateNickname(value);
    }
  };

  const isValid = nickname.trim().length >= 3 && !error;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col h-full pt-12"
    >
      <div className="flex-1">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <AtSign className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Choose your nickname
          </h1>
          <p className="text-muted-foreground">
            This is how others will see you in the community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="nickname" className="text-base font-semibold mb-3 block">
              Nickname
            </Label>
            <div className="relative">
              <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => handleNicknameChange(e.target.value)}
                onBlur={() => validateNickname(nickname)}
                placeholder="your_nickname"
                className={`h-14 pl-12 text-base rounded-2xl ${
                  error ? 'border-destructive focus-visible:ring-destructive' : ''
                }`}
                maxLength={20}
                autoFocus
              />
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive mt-2 ml-1"
              >
                {error}
              </motion.p>
            )}
            <p className="text-xs text-muted-foreground mt-2 ml-1">
              3-20 characters • Letters, numbers, _ and - only
            </p>
          </div>
        </form>
      </div>

      <div className="pb-8">
        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full h-14 text-base rounded-2xl font-semibold"
          size="lg"
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
}
