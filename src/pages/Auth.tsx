import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import { loginSchema } from '@/lib/validations';
import { useRateLimit } from '@/hooks/useRateLimit';

export default function Auth() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginRateLimit.canMakeCall()) {
      const remainingMs = loginRateLimit.getRemainingTime();
      const secondsLeft = Math.ceil(remainingMs / 1000);
      toast.error(`Too many attempts. Please wait ${secondsLeft} seconds.`);
      return;
    }

    setLoading(true);

    try {
      const validationResult = loginSchema.safeParse({ email, password });

      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        toast.error(firstError.message);
        setLoading(false);
        return;
      }

      const { error } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        const errorMessage = error.message;
        if (errorMessage.includes('restricted') || errorMessage.includes('Access')) {
          toast.error(errorMessage, { duration: 6000 });
        } else if (errorMessage.includes('Invalid')) {
          toast.error('Invalid email or password');
        } else {
          toast.error(errorMessage);
        }
      } else {
        if (isSignUp) {
          toast.success('Welcome! Let\'s get you set up');
          navigate('/onboarding', { replace: true });
        } else {
          toast.success('Welcome back!');
          navigate('/', { replace: true });
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col font-relative overflow-hidden">
      {/* Header with back button */}
      <div className="flex-none pt-[calc(env(safe-area-inset-top)+16px)] px-4 md:px-6 pb-4">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted rounded-full transition-colors tap-feedback"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-6 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+16px)]">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-card rounded-3xl p-6 md:p-8 shadow-lg border border-border">
            {/* Title */}
            <div className="text-center space-y-3 mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                {isSignUp
                  ? 'Enter your details to get started'
                  : 'Sign in to continue your journey'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground block">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-muted border-border rounded-xl text-base placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-foreground block">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-muted border-border rounded-xl text-base placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed tap-feedback shadow-md"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  isSignUp ? 'Continue' : 'Sign In'
                )}
              </Button>
            </form>

            {/* Toggle */}
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors tap-feedback"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </button>
            </div>

            {/* Purchase Link */}
            {isSignUp && (
              <div className="pt-6 mt-6 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3 text-center">
                  Need access to NEP System?
                </p>
                <a
                  href="https://gtmsinop.mycartpanda.com/checkout/200782040:1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 px-4 text-center text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-xl transition-all tap-feedback"
                >
                  Purchase Access →
                </a>
              </div>
            )}

            {/* Terms */}
            <p className="text-xs text-center text-muted-foreground mt-6">
              By continuing, you agree to our{" "}
              <Link to="/terms" className="underline hover:text-foreground transition-colors">
                Terms
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="underline hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
