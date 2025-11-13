import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, Lock, CheckCircle2, Shield, Zap, DollarSign } from 'lucide-react';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success(isSignUp ? 'Account created successfully! Welcome to NEP System!' : 'Welcome back!');

        if (isSignUp) {
          // Check if user has completed onboarding
          const hasCompletedOnboarding = localStorage.getItem('pwa_onboarding_completed');
          if (!hasCompletedOnboarding) {
            navigate('/onboarding', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        } else {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary p-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-glass rounded-3xl p-8 shadow-2xl border border-white/20">
        {/* Logo & Title */}
        <div className="flex flex-col items-center mb-6">
          <div className="text-6xl mb-3 animate-brain-pulse">🧠</div>
          <h1 className="text-3xl font-bold text-primary mb-1">NEP SYSTEM</h1>
          <p className="text-muted-foreground text-center text-sm">
            Brain-Based Parenting That Works
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setPassword('');
            }}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              !isSignUp
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setPassword('');
            }}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              isSignUp
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Benefits (Sign Up Only) */}
        {isSignUp && (
          <div className="mb-6 space-y-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-700">Instant access to brain-based scripts</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-700">Personalized guidance for your child's brain type</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-700">Join a community of 10,000+ parents</p>
            </div>
          </div>
        )}

        {/* Important Notice */}
        <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs font-medium text-amber-900">
              {isSignUp
                ? 'Use the same email you used to purchase NEP System'
                : 'Sign in with your purchase email'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1.5 block">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base pl-11"
                autoFocus
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1.5 block">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-12 text-base pl-11"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold mt-6"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="text-2xl animate-brain-pulse">🧠</span>
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {isSignUp ? (
                  <>
                    <Zap className="w-5 h-5" />
                    Create Account
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </span>
            )}
          </Button>
        </form>

        {/* Trust Badges */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="flex flex-col items-center gap-1">
              <Shield className="w-5 h-5 text-success" />
              <p className="text-xs font-medium text-gray-600">Secure</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Zap className="w-5 h-5 text-primary" />
              <p className="text-xs font-medium text-gray-600">Instant Access</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <DollarSign className="w-5 h-5 text-success" />
              <p className="text-xs font-medium text-gray-600">Money-Back</p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
