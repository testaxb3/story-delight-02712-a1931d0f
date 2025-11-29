import { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { loginSchema } from '@/lib/validations';
import { useRateLimit } from '@/hooks/useRateLimit';
import { AuthWelcome } from '@/components/auth/AuthWelcome';
import { AuthForm } from '@/components/auth/AuthForm';
import { PremiumBackground } from '@/components/auth/PremiumBackground';
import { supabase } from '@/integrations/supabase/client';
import { AnimatePresence } from 'framer-motion';

const Auth = memo(function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Rate limit login attempts (5 per minute)
  const loginRateLimit = useRateLimit(5, 60000);

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // Memoized callbacks for child components
  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
  }, []);

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
  }, []);

  const handleToggleMode = useCallback(() => {
    setIsSignUp(prev => !prev);
    setEmail('');
    setPassword('');
  }, []);

  const handleGetStarted = useCallback(() => {
    setIsSignUp(true);
    setShowForm(true);
  }, []);

  const handleSignInClick = useCallback(() => {
    setIsSignUp(false);
    setShowForm(true);
  }, []);

  const handleBack = useCallback(() => {
    setShowForm(false);
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
        toast.error(firstError.message, { duration: 4000 });
        setLoading(false);
        return;
      }

      const { error, user: signedInUser } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        const errorMessage = error.message || 'An error occurred';
        const errorCode = (error as any).code || '';
        
        // ✅ CARTPANDA: Handle email not approved error
        if (errorCode === 'EMAIL_NOT_APPROVED' || errorMessage.includes('Purchase required')) {
          toast.error('Purchase Required', {
            description: 'Please complete your purchase first. Use the same email you used for payment.',
            duration: 8000,
          });
        } else if (errorMessage.includes('500') || errorMessage.includes('EOF')) {
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
          toast.success("Welcome! Let's get you set up", { duration: 3000 });
          navigate('/pwa-install', { replace: true });
        } else {
          const { data: profile } = await supabase
            .from('profiles')
            .select('quiz_completed')
            .eq('id', signedInUser.id)
            .single();

          toast.success('Welcome back!', { duration: 3000 });
          
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
    <div className="min-h-screen relative flex flex-col overflow-hidden bg-[#030303]">
      {/* Premium background layer */}
      <PremiumBackground />

      {/* Content layer with AnimatePresence for smooth transitions */}
      <div className="relative z-10 flex-1">
        <AnimatePresence mode="wait">
          {!showForm ? (
            <AuthWelcome
              key="welcome"
              onGetStarted={handleGetStarted}
              onSignIn={handleSignInClick}
            />
          ) : (
            <AuthForm
              key="form"
              isSignUp={isSignUp}
              email={email}
              password={password}
              loading={loading}
              onEmailChange={handleEmailChange}
              onPasswordChange={handlePasswordChange}
              onSubmit={handleSubmit}
              onBack={handleBack}
              onToggleMode={handleToggleMode}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

export default Auth;
