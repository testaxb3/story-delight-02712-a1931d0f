import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFamilyShare } from '@/hooks/useFamilyShare';
import { useAuth } from '@/contexts/AuthContext';

export default function JoinFamily() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { acceptInvite, isPartner, partnerOf } = useFamilyShare();
  
  const [code, setCode] = useState(searchParams.get('code') || '');
  const [isSuccess, setIsSuccess] = useState(false);

  // If user already has a share, redirect
  useEffect(() => {
    if (isPartner && partnerOf) {
      navigate('/dashboard');
    }
  }, [isPartner, partnerOf, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    try {
      await acceptInvite.mutateAsync(code);
      setIsSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch {
      // Error handled by mutation
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="w-12 h-12 mx-auto text-amber-500" />
              <h2 className="text-xl font-semibold">Sign In Required</h2>
              <p className="text-muted-foreground">
                You need to create an account or sign in before joining a family.
              </p>
              <Button onClick={() => navigate('/auth')} className="w-full">
                Go to Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center"
          >
            <Check className="w-10 h-10 text-emerald-500" />
          </motion.div>
          <h2 className="text-2xl font-bold">You're Connected!</h2>
          <p className="text-muted-foreground">
            You now have access to shared family data
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center gap-4 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Join Family</h1>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Join Family Access</CardTitle>
              <CardDescription>
                Enter the invite code shared by your partner to get access to their family data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Enter 8-character code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="text-center text-2xl font-mono tracking-[0.3em] uppercase h-14"
                    maxLength={8}
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    The code is 8 characters, letters and numbers
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={acceptInvite.isPending || code.length !== 8}
                  className="w-full"
                >
                  {acceptInvite.isPending ? 'Joining...' : 'Join Family'}
                </Button>
              </form>

              {acceptInvite.isError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                >
                  <p className="text-sm text-destructive text-center">
                    {acceptInvite.error?.message || 'Invalid or expired code'}
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground text-center mt-6">
            By joining, you'll be able to view and edit shared children profiles and tracker data.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
