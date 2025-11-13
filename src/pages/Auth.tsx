import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, Lock, CheckCircle2, Shield, Zap, DollarSign, Info } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5" />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-card/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-border/50">
          {/* Logo & Title */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-40 animate-pulse" />
              <div className="relative text-7xl animate-bounce-slow">🧠</div>
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
              NEP SYSTEM
            </h1>
            <p className="text-muted-foreground text-center text-sm font-medium">
              Brain-Based Parenting That Works
            </p>
          </div>

          {/* Tab Toggle */}
          <div className="flex bg-muted/50 rounded-2xl p-1.5 mb-8 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setPassword('');
              }}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                !isSignUp
                  ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg scale-105'
                  : 'text-muted-foreground hover:text-foreground'
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
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                isSignUp
                  ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg scale-105'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Benefits (Sign Up Only) */}
          {isSignUp && (
            <div className="mb-6 space-y-3 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-2xl p-5 border border-primary/20 backdrop-blur-sm">
              <div className="flex items-start gap-3 group">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-success to-success/70 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
                <p className="text-sm text-foreground font-medium">Instant access to brain-based scripts</p>
              </div>
              <div className="flex items-start gap-3 group">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-success to-success/70 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
                <p className="text-sm text-foreground font-medium">Track your progress with 30-Day Plan</p>
              </div>
              <div className="flex items-start gap-3 group">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-success to-success/70 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
                <p className="text-sm text-foreground font-medium">Join a supportive parent community</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground font-medium">
                  Use the same email you used to purchase the product
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold text-foreground">
                Email
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors">
                  <Mail className="w-5 h-5 text-muted-foreground group-focus-within:text-primary" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-12 h-13 rounded-xl bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-base font-medium"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-bold text-foreground">
                Password
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors">
                  <Lock className="w-5 h-5 text-muted-foreground group-focus-within:text-primary" />
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pl-12 h-13 rounded-xl bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-base font-medium"
                  placeholder="••••••••"
                />
              </div>
              {isSignUp && (
                <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                  Minimum 6 characters
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 text-base font-bold bg-gradient-to-r from-primary via-accent to-secondary hover:opacity-90 text-white rounded-xl shadow-xl transition-all hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Processing...'
                : isSignUp
                  ? '✨ Create Account'
                  : '🚀 Sign In'}
            </Button>
          </form>

          {/* Features Footer */}
          <div className="mt-8 pt-6 border-t border-border/50">
            <p className="text-xs text-center text-muted-foreground mb-5 font-bold uppercase tracking-wider">
              Trusted by parents worldwide
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 hover:scale-105 transition-transform group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-2 group-hover:rotate-12 transition-transform">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs font-bold text-foreground text-center">Secure</p>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 hover:scale-105 transition-transform group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mb-2 group-hover:rotate-12 transition-transform">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs font-bold text-foreground text-center">Instant</p>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-success/5 to-success/10 border border-success/20 hover:scale-105 transition-transform group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-success to-success/80 flex items-center justify-center mb-2 group-hover:rotate-12 transition-transform">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs font-bold text-foreground text-center">Free Trial</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
