import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, Lock, CheckCircle2, Shield, Zap, DollarSign, Info, Loader2, AlertCircle, ShoppingCart } from 'lucide-react';
import { loginSchema } from '@/lib/validations';
import { z } from 'zod';
import { useRateLimit } from '@/hooks/useRateLimit';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // ✅ SECURITY: Rate limit login attempts (5 per minute)
  const loginRateLimit = useRateLimit(5, 60000);

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ SECURITY: Check rate limit before processing
    if (!loginRateLimit.canMakeCall()) {
      const remainingMs = loginRateLimit.getRemainingTime();
      const secondsLeft = Math.ceil(remainingMs / 1000);
      toast.error(`Too many attempts. Please wait ${secondsLeft} seconds before trying again.`);
      return;
    }

    setLoading(true);

    try {
      // ✅ SECURITY: Validate input with Zod before sending to backend
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
        // Improved error messages
        const errorMessage = error.message;
        if (errorMessage.includes('restricted') || errorMessage.includes('Access')) {
          toast.error(errorMessage, { duration: 6000 });
        } else if (errorMessage.includes('Invalid')) {
          toast.error('Invalid email or password');
        } else {
          toast.error(errorMessage);
        }
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 relative overflow-hidden">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/15 to-secondary/10 animate-gradient" />
      
      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s', animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-accent/30 to-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s', animationDuration: '10s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s', animationDuration: '12s' }} />
      </div>

      {/* Premium Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ 
        backgroundImage: 'linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Premium Social Proof Badge */}
        <div className="flex justify-center mb-8">
          <div className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-card/80 via-card/90 to-card/80 backdrop-blur-2xl px-6 py-3 rounded-full border border-primary/20 shadow-xl hover:shadow-primary/20 transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex -space-x-3 relative">
              <div className="w-8 h-8 rounded-full border-2 border-background overflow-hidden ring-2 ring-primary/20">
                <img src="/avatar-1.webp" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-background overflow-hidden ring-2 ring-accent/20">
                <img src="/avatar-2.webp" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-background overflow-hidden ring-2 ring-primary/20">
                <img src="/avatar-3.webp" alt="" className="w-full h-full object-cover" />
              </div>
            </div>
            
            <div className="flex items-center gap-2 relative">
              <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                1.2k+ parents transformed their families
              </span>
              <CheckCircle2 className="w-5 h-5 text-primary animate-pulse" />
            </div>
          </div>
        </div>

        {/* Premium Glass Card */}
        <div className="auth-glass group relative overflow-hidden">
          {/* Animated Glow Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />
          
          <div className="relative bg-gradient-to-br from-card/95 via-card/98 to-card/95 backdrop-blur-2xl rounded-3xl border border-primary/20 p-8 md:p-10 space-y-8 shadow-2xl">
            {/* Premium Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-xl mb-4 shadow-lg shadow-primary/20 animate-float">
                <div className="text-5xl animate-brain-pulse">🧠</div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                {isSignUp ? 'Create Your Account' : 'Welcome Back'}
              </h1>
              
              <p className="text-muted-foreground text-lg max-w-sm mx-auto">
                {isSignUp 
                  ? 'Use the same email from your purchase' 
                  : 'Sign in to continue'}
              </p>
            </div>

            {/* Important Notice for Sign Up */}
            {isSignUp && (
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-foreground mb-1">
                      ⚠️ Important: Use Your Purchase Email
                    </p>
                    <p className="text-muted-foreground">
                      You must use <strong>the same email</strong> you used to purchase NEP System access. 
                      Only approved buyer emails can create accounts.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Premium Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground/90 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email
                </Label>
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-14 bg-background/50 backdrop-blur-xl border-border/50 hover:border-primary/50 focus:border-primary rounded-xl transition-all duration-300 text-base"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground/90 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Password
                </Label>
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 h-14 bg-background/50 backdrop-blur-xl border-border/50 hover:border-primary/50 focus:border-primary rounded-xl transition-all duration-300 text-base"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="group relative w-full h-14 text-base font-bold bg-gradient-to-r from-primary via-accent to-primary hover:shadow-2xl hover:shadow-primary/50 transition-all duration-500 overflow-hidden animate-gradient bg-[length:200%_auto]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {isSignUp ? '✨ Create Account' : '🚀 Sign In'}
                    </>
                  )}
                </span>
              </Button>
            </form>

            {/* Premium Toggle */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-4 text-muted-foreground font-medium">or</span>
              </div>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300"
              >
                <span className="relative">
                  {isSignUp 
                    ? 'Already have an account? Sign in' 
                    : "Don't have an account? Sign up"}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300"></span>
                </span>
              </button>
              
              {/* Purchase Link for New Users */}
              {isSignUp && (
                <div className="mt-6 pt-6 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-3 text-center">
                    Haven't purchased access yet?
                  </p>
                  <a
                    href="https://gtmsinop.mycartpanda.com/checkout/200782040:1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border border-primary/20 hover:border-primary/40 transition-all duration-300 w-full justify-center"
                  >
                    <ShoppingCart className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      Purchase NEP System Access
                    </span>
                  </a>
                </div>
              )}
            </div>

            {/* Premium Benefits - only shown on sign up */}
            {isSignUp && (
              <div className="pt-6 border-t border-primary/10">
                <p className="text-sm font-semibold text-center mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  What you'll get:
                </p>
                <div className="grid gap-4">
                  <div className="group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
                    <div className="relative flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border border-primary/20 hover:border-primary/40 transition-all duration-300">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg shadow-primary/20">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground mb-1">Safe & Secure</p>
                        <p className="text-xs text-muted-foreground">Your data is encrypted and protected</p>
                      </div>
                    </div>
                  </div>

                  <div className="group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-primary/10 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
                    <div className="relative flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-accent/5 via-accent/3 to-transparent border border-accent/20 hover:border-accent/40 transition-all duration-300">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 shadow-lg shadow-accent/20">
                        <Zap className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground mb-1">Instant Access</p>
                        <p className="text-xs text-muted-foreground">Start using all features immediately</p>
                      </div>
                    </div>
                  </div>

                  <div className="group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
                    <div className="relative flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border border-primary/20 hover:border-primary/40 transition-all duration-300">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg shadow-primary/20">
                        <DollarSign className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground mb-1">Full Access</p>
                        <p className="text-xs text-muted-foreground">Access all premium scripts and videos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Premium Trust Indicators */}
        <div className="mt-10 flex items-center justify-center gap-8 md:gap-12">
          <div className="group flex flex-col items-center gap-2 transition-transform duration-300 hover:scale-110">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow duration-300">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">Secure</span>
          </div>
          
          <div className="group flex flex-col items-center gap-2 transition-transform duration-300 hover:scale-110">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 shadow-lg shadow-accent/20 group-hover:shadow-accent/40 transition-shadow duration-300">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-accent transition-colors duration-300">Instant</span>
          </div>
          
          <div className="group flex flex-col items-center gap-2 transition-transform duration-300 hover:scale-110">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow duration-300">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">Full Access</span>
          </div>
        </div>

        {/* Premium Info Banner */}
        <div className="mt-8 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-primary/10 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
          <div className="relative flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-blue-500/5 via-primary/5 to-transparent border border-blue-500/20 backdrop-blur-xl">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10">
              <Info className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              By signing up, you agree to our Terms of Service and Privacy Policy. We'll never share your data with third parties.
            </p>
          </div>
        </div>

        {/* Need Access Section - Only show on login */}
        {!isSignUp && (
          <div className="mt-8 glass-card p-6 border border-white/10 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  🔒 NEP System Premium Access
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  This application is exclusive to members who purchased the NEP System program.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://nepsystem.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                  >
                    Get NEP System Access →
                  </a>
                  <a
                    href="mailto:support@nepsystem.com"
                    className="inline-flex items-center justify-center px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors text-sm font-medium"
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
