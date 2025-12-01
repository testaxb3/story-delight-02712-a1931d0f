import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, Check, Lock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Password strength indicator
function PasswordStrength({ password }: { password: string }) {
  const strength = useMemo(() => {
    if (password.length === 0) return { score: 0, label: '', color: '' };
    if (password.length < 6) return { score: 1, label: 'Too short', color: 'bg-red-500' };
    if (password.length < 8) return { score: 2, label: 'Weak', color: 'bg-orange-500' };
    
    let score = 2;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 3) return { score: 2, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 4) return { score: 3, label: 'Good', color: 'bg-emerald-500' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-400' };
  }, [password]);

  if (password.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="mt-3"
    >
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1">
          {[1, 2, 3, 4].map((level) => (
            <motion.div
              key={level}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: level * 0.05 }}
              className={`h-1 flex-1 rounded-full origin-left ${
                level <= strength.score ? strength.color : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <span className={`text-xs font-medium ${strength.score <= 2 ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}>
          {strength.label}
        </span>
      </div>
    </motion.div>
  );
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validSession, setValidSession] = useState<boolean | null>(null);

  // Check for valid recovery session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Check if this is a recovery flow (user clicked email link)
      if (session?.user) {
        setValidSession(true);
      } else {
        // Listen for auth state changes (when user clicks link)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
            setValidSession(true);
          }
        });

        // Set timeout to show error if no session (8s for slow connections)
        setTimeout(() => {
          setValidSession(prev => prev === null ? false : prev);
        }, 8000);

        return () => subscription.unsubscribe();
      }
    };

    checkSession();
  }, []);

  const passwordValid = password.length >= 8;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const formValid = passwordValid && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid || loading) return;

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        console.error('[ResetPassword] Error:', error);
        toast.error(error.message || 'Failed to reset password');
        return;
      }

      toast.success('Password updated successfully!');
      
      // Sign out and redirect to auth
      await supabase.auth.signOut();
      navigate('/auth', { replace: true });
    } catch (err) {
      console.error('[ResetPassword] Exception:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state while checking session
  if (validSession === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
          <p className="text-muted-foreground/60 text-sm">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid or expired link
  if (validSession === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Invalid or expired link</h1>
          <p className="text-muted-foreground mb-8">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Back to Sign In
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Safe area padding */}
      <div className="pt-[max(env(safe-area-inset-top),44px)]" />

      {/* Content */}
      <div className="flex-1 px-6 flex flex-col justify-center max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-foreground" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-foreground text-center mb-2">
            Set new password
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Your new password must be at least 8 characters
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                disabled={loading}
                autoFocus
                className="w-full h-14 px-4 pr-12 rounded-2xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:bg-secondary/80 transition-all disabled:opacity-50"
              />
              {password && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              )}
              <PasswordStrength password={password} />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                disabled={loading}
                className="w-full h-14 px-4 pr-12 rounded-2xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:bg-secondary/80 transition-all disabled:opacity-50"
              />
              {confirmPassword && (
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              )}
              
              {/* Match indicator */}
              <AnimatePresence>
                {confirmPassword && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className={`flex items-center gap-1.5 mt-2 text-xs ${
                      passwordsMatch ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {passwordsMatch ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Passwords match
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        Passwords don't match
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!formValid || loading}
                className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Safe area bottom */}
      <div className="pb-[max(env(safe-area-inset-bottom),20px)]" />
    </div>
  );
}
