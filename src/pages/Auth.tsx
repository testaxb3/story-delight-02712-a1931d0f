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
    <div className="min-h-screen bg-white dark:bg-background flex flex-col">
      {/* Header with back button */}
      <div className="flex-none pt-[calc(env(safe-area-inset-top)+16px)] px-6 pb-4">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-24">
        <div className="w-full max-w-md space-y-8">
          {/* Title */}
          <div className="text-left space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-base text-gray-500 dark:text-gray-400">
              {isSignUp
                ? 'Enter your details to get started'
                : 'Sign in to continue'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-base placeholder:text-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-base placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 text-base font-bold rounded-xl transition-all disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                isSignUp ? 'Continue' : 'Sign In'
              )}
            </Button>
          </form>

          {/* Toggle */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>

          {/* Purchase Link */}
          {isSignUp && (
            <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 text-center">
                Need access to Cal AI?
              </p>
              <a
                href="https://gtmsinop.mycartpanda.com/checkout/200782040:1"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 px-4 text-center text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all"
              >
                Purchase Access →
              </a>
            </div>
          )}

          {/* Terms */}
          <p className="text-xs text-center text-gray-400">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="underline hover:text-gray-600">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline hover:text-gray-600">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
