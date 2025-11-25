import { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { loginSchema } from '@/lib/validations';
import { useRateLimit } from '@/hooks/useRateLimit';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { supabase } from '@/integrations/supabase/client';

const Auth = memo(function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Rate limit login attempts (5 per minute)
  const loginRateLimit = useRateLimit(5, 60000);

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // PERFORMANCE: Memoized callbacks
  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
  }, []);

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
  }, []);

  const handleToggleMode = useCallback(() => {
    setIsSignUp(prev => !prev);
    // Clear form on toggle
    setEmail('');
    setPassword('');
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginRateLimit.canMakeCall()) {
      const remainingMs = loginRateLimit.getRemainingTime();
      const secondsLeft = Math.ceil(remainingMs / 1000);
      toast.error(`Too many attempts. Please wait ${secondsLeft} seconds.`, {
        duration: 4000,
      });
      return;
    }

    setLoading(true);

    try {
      const validationResult = loginSchema.safeParse({ email, password });

      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        toast.error(firstError.message, {
          duration: 4000,
        });
        setLoading(false);
        return;
      }

      const { error, user: signedInUser } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        const errorMessage = error.message || 'An error occurred';
        
        // Enhanced error messages for common issues
        if (errorMessage.includes('500') || errorMessage.includes('EOF')) {
          toast.error('Connection issue. Please try again.', { duration: 4000 });
        } else if (errorMessage.includes('Connection failed') || errorMessage.includes('internet')) {
          toast.error('Please check your internet connection and try again.', { duration: 5000 });
        } else if (errorMessage.includes('restricted') || errorMessage.includes('Access')) {
          toast.error(errorMessage, { duration: 6000 });
        } else if (errorMessage.includes('Invalid')) {
          toast.error('Invalid email or password', { duration: 4000 });
        } else {
          toast.error(errorMessage, { duration: 4000 });
        }
      } else {
        if (isSignUp) {
          toast.success('Welcome! Let\'s get you set up', {
            duration: 3000,
          });
          // Navigate immediately - profile is created by Supabase trigger
          navigate('/pwa-install', { replace: true });
        } else {
          // ✅ FIX: Use signedInUser from return instead of context user to avoid race condition
          const { data: profile } = await supabase
            .from('profiles')
            .select('quiz_completed')
            .eq('id', signedInUser.id)
            .single();

          toast.success('Welcome back!', {
            duration: 3000,
          });
          
          // Redirect based on quiz completion status
          if (profile?.quiz_completed) {
            navigate('/', { replace: true });
          } else {
            navigate('/quiz', { replace: true });
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred', { duration: 4000 });
    } finally {
      setLoading(false);
    }
  }, [email, password, isSignUp, signIn, signUp, navigate, loginRateLimit]);

  return (
    <div className="min-h-screen relative flex flex-col font-relative overflow-hidden">
      {/* Animated Background */}
      <AuthBackground />

      {/* Content */}
      <div className="relative flex-1 flex items-center justify-center px-4 md:px-6 py-8 pb-[calc(env(safe-area-inset-bottom)+2rem)]">
        <AuthCard
          isSignUp={isSignUp}
          email={email}
          password={password}
          loading={loading}
          onEmailChange={handleEmailChange}
          onPasswordChange={handlePasswordChange}
          onSubmit={handleSubmit}
          onToggleMode={handleToggleMode}
        />
      </div>
    </div>
  );
});

export default Auth;
