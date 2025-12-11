import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Copy, Check, Trash2, UserMinus, Mail, UserPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useFamilyShare } from '@/hooks/useFamilyShare';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function FamilyShareCard() {
  const {
    myShare,
    partnerOf,
    partnerProfile,
    ownerProfile,
    isLoading,
    hasActiveShare,
    hasPendingInvite,
    isPartner,
    createInvite,
    revokeAccess,
    deleteInvite,
  } = useFamilyShare();

  const { user } = useAuth();
  const { data: profile } = useUserProfile(user?.id, user?.email);
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleCreateInvite = async () => {
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      setIsSendingEmail(true);
      
      // 1. Create invite in database
      const result = await createInvite.mutateAsync(email);
      
      // 2. Send email with invite code
      const { error } = await supabase.functions.invoke('send-family-invite', {
        body: {
          partner_email: result.partner_email,
          invite_code: result.invite_code,
          owner_name: profile?.user_metadata?.full_name || user?.user_metadata?.full_name || 'Your partner',
        },
      });

      if (error) {
        console.error('Failed to send invite email:', error);
        toast.success('Invite created! Share the code manually.');
      } else {
        toast.success(`Invite sent to ${email}!`);
      }
      
      setEmail('');
    } catch (error) {
      // Error already handled by mutation
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleCopyCode = () => {
    if (myShare?.invite_code) {
      navigator.clipboard.writeText(myShare.invite_code);
      setCopied(true);
      toast.success('Code copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-6">
          <div className="animate-pulse flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // User is a partner (viewing shared access from owner)
  if (isPartner && ownerProfile) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Family Access</CardTitle>
          </div>
          <CardDescription>You have shared access to another account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
            <Avatar className="w-12 h-12">
              <AvatarImage src={ownerProfile.photo_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {ownerProfile.name?.[0] || ownerProfile.email?.[0] || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{ownerProfile.name || 'Family Owner'}</p>
              <p className="text-sm text-muted-foreground truncate">{ownerProfile.email}</p>
            </div>
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              Connected
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            You can view and edit shared children profiles and tracker data
          </p>
        </CardContent>
      </Card>
    );
  }

  // User has an accepted share with partner
  if (hasActiveShare && partnerProfile) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Family Access</CardTitle>
          </div>
          <CardDescription>Your partner has shared access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
            <Avatar className="w-12 h-12">
              <AvatarImage src={partnerProfile.photo_url || undefined} />
              <AvatarFallback className="bg-emerald-500/10 text-emerald-600">
                {partnerProfile.name?.[0] || partnerProfile.email?.[0] || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{partnerProfile.name || 'Partner'}</p>
              <p className="text-sm text-muted-foreground truncate">{partnerProfile.email}</p>
            </div>
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              Active
            </Badge>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full text-destructive hover:text-destructive">
                <UserMinus className="w-4 h-4 mr-2" />
                Revoke Access
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Revoke Partner Access?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove {partnerProfile.name || 'your partner'}'s access to your children profiles and tracker data. They will no longer be able to view or edit shared content.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => revokeAccess.mutate()}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Revoke Access
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    );
  }

  // User has a pending invite
  if (hasPendingInvite && myShare) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Family Access</CardTitle>
          </div>
          <CardDescription>Pending invite for {myShare.partner_email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Invite Code</span>
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                Pending
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-4 py-3 bg-background rounded-lg text-xl font-mono tracking-widest text-center">
                {myShare.invite_code}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyCode}
                className="shrink-0"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="w-4 h-4 text-emerald-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Copy className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Share this code with your partner to give them access
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Cancel Invite
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Invite?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete the invite code. You can create a new one anytime.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Invite</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteInvite.mutate()}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    );
  }

  // No share exists - show create invite form
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Family Access</CardTitle>
        </div>
        <CardDescription>
          Invite your partner to share access to children profiles and tracker
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Partner's email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={handleCreateInvite}
            disabled={createInvite.isPending || isSendingEmail || !email.trim()}
            className="w-full"
          >
            {(createInvite.isPending || isSendingEmail) ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending invite...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Send Invite
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Your partner will receive a code to join. Only 1 partner can be added.
        </p>
      </CardContent>
    </Card>
  );
}
