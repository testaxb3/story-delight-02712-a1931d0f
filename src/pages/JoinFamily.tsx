import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Check, AlertCircle, Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFamilyShare } from '@/hooks/useFamilyShare';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { loginSchema } from '@/lib/validations';

interface InviteInfo {
  valid: boolean;
  owner_name?: string;
  owner_photo_url?: string | null;
  partner_email?: string;
}

export default function JoinFamily() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signIn, signUp } = useAuth();
  const { acceptInvite, isPartner, partnerOf } = useFamilyShare();
  
  const code = searchParams.get('code') || '';
  
  // State
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
  const [isLoadingInvite, setIsLoadingInvite] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  
  // Auth form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('signup');

  // Fetch invite info on mount
  useEffect(() => {
    const fetchInviteInfo = async () => {
      if (!code) {
        setInviteInfo({ valid: false });
        setIsLoadingInvite(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('get_invite_info', { p_code: code });
        
        if (error) throw error;
        
        setInviteInfo(data as InviteInfo);
        
        // Pre-fill email if available
        if (data?.partner_email) {
          setEmail(data.partner_email);
        }
      } catch (err) {
        console.error('Error fetching invite info:', err);
        setInviteInfo({ valid: false });
      } finally {
        setIsLoadingInvite(false);
      }
    };

    fetchInviteInfo();
  }, [code]);

  // Auto-accept invite when user is logged in
  useEffect(() => {
    const autoAccept = async () => {
      if (!user || !inviteInfo?.valid || isSuccess || isAccepting) return;
      
      // Check if email matches
      if (inviteInfo.partner_email && user.email?.toLowerCase() !== inviteInfo.partner_email.toLowerCase()) {
        toast.error('Email mismatch', {
          description: `This invite was sent to ${inviteInfo.partner_email}. Please sign in with that email.`
        });
        return;
      }
      
      setIsAccepting(true);
      try {
        await acceptInvite.mutateAsync(code);
        setIsSuccess(true);
        setTimeout(() => navigate('/dashboard', { replace: true }), 2000);
      } catch {
        // Error handled by mutation
        setIsAccepting(false);
      }
    };

    autoAccept();
  }, [user, inviteInfo, code, isSuccess, isAccepting, acceptInvite, navigate]);

  // Redirect if already a partner
  useEffect(() => {
    if (isPartner && partnerOf) {
      navigate('/dashboard', { replace: true });
    }
  }, [isPartner, partnerOf, navigate]);

  const handleAuth = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationResult = loginSchema.safeParse({ email, password });
    if (!validationResult.success) {
      toast.error(validationResult.error.errors[0].message);
      return;
    }

    setAuthLoading(true);

    try {
      if (activeTab === 'signup') {
        // Use skipApprovalCheck=true since they're invited via family share
        const { error } = await signUp(email, password, true);
        
        if (error) {
          if (error.message?.includes('already registered')) {
            toast.error('Account exists', {
              description: 'This email already has an account. Please sign in instead.'
            });
            setActiveTab('login');
          } else {
            toast.error(error.message);
          }
          return;
        }
        
        toast.success('Account created!');
        // Auto-accept will happen via useEffect when user state updates
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          toast.error(error.message || 'Invalid email or password');
          return;
        }
        
        toast.success('Signed in!');
        // Auto-accept will happen via useEffect when user state updates
      }
    } finally {
      setAuthLoading(false);
    }
  }, [email, password, activeTab, signIn, signUp]);

  // Loading state
  if (isLoadingInvite) {
    return (
      <div 
        className="min-h-screen bg-background flex items-center justify-center p-4"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading invite...</p>
        </motion.div>
      </div>
    );
  }

  // Invalid/expired invite
  if (!inviteInfo?.valid) {
    return (
      <div 
        className="min-h-screen bg-background flex items-center justify-center p-4"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-xl font-semibold">Invalid or Expired Invite</h2>
              <p className="text-muted-foreground">
                This invite link is no longer valid. Please ask your partner to send a new invitation.
              </p>
              <Button onClick={() => navigate('/auth')} variant="outline" className="w-full">
                Go to Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div 
        className="min-h-screen bg-background flex items-center justify-center p-4"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
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
            You now have access to {inviteInfo.owner_name}'s family data
          </p>
        </motion.div>
      </div>
    );
  }

  // Accepting state (user logged in, accepting invite)
  if (user && isAccepting) {
    return (
      <div 
        className="min-h-screen bg-background flex items-center justify-center p-4"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Connecting to family...</p>
        </motion.div>
      </div>
    );
  }

  // Main UI: Show auth forms with invite context
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div 
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center gap-4 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full w-11 h-11"
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
          className="space-y-6"
        >
          {/* Invite Header */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <Avatar className="w-20 h-20 border-4 border-primary/20">
                  <AvatarImage src={inviteInfo.owner_photo_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {inviteInfo.owner_name?.charAt(0)?.toUpperCase() || 'P'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">
                    {inviteInfo.owner_name} invited you!
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Join their family to share children profiles and tracker data
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Auth Card */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-center">
                {user ? 'Accepting Invite...' : 'Sign in to accept'}
              </CardTitle>
              {!user && (
                <CardDescription className="text-center">
                  Create an account or sign in to join {inviteInfo.owner_name}'s family
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {user ? (
                // User is logged in but hasn't auto-accepted yet
                <div className="text-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Processing...
                  </p>
                </div>
              ) : (
                // Auth forms
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="signup">Create Account</TabsTrigger>
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                  </TabsList>

                  <form onSubmit={handleAuth}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: activeTab === 'signup' ? -10 : 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: activeTab === 'signup' ? 10 : -10 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="email"
                              placeholder="Email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="pl-10 h-12"
                              autoComplete="email"
                              disabled={authLoading}
                            />
                          </div>
                          {inviteInfo.partner_email && email.toLowerCase() !== inviteInfo.partner_email.toLowerCase() && (
                            <p className="text-xs text-amber-500">
                              ⚠️ This invite was sent to {inviteInfo.partner_email}
                            </p>
                          )}
                        </div>

                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 h-12"
                            autoComplete={activeTab === 'signup' ? 'new-password' : 'current-password'}
                            disabled={authLoading}
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={authLoading || !email || !password}
                          className="w-full h-12"
                        >
                          {authLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : activeTab === 'signup' ? (
                            'Create Account & Join'
                          ) : (
                            'Sign In & Join'
                          )}
                        </Button>
                      </motion.div>
                    </AnimatePresence>
                  </form>
                </Tabs>
              )}

              {acceptInvite.isError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                >
                  <p className="text-sm text-destructive text-center">
                    {acceptInvite.error?.message || 'Failed to accept invite'}
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground text-center">
            By joining, you'll be able to view and edit shared children profiles and tracker data.
          </p>
        </motion.div>
      </div>
    </div>
  );
}