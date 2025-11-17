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
import { WelcomeGiftModal } from '@/components/WelcomeGiftModal';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // ✅ SECURITY: Rate limit login attempts (5 per minute)
  const loginRateLimit = useRateLimit(5, 60000);

  useEffect(() => {
    // Only redirect if user exists AND welcome modal is not showing
    if (user && !showWelcomeModal) {
      navigate('/', { replace: true });
    }
  }, [user, navigate, showWelcomeModal]);

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
        if (isSignUp) {
          // Show welcome modal on successful signup
          setShowWelcomeModal(true);
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

  const handleWelcomeModalClose = () => {
    setShowWelcomeModal(false);
    // Don't show toast or switch mode here - let the modal navigate to quiz
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-3 sm:p-4 relative overflow-hidden">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/8 to-secondary/5 animate-gradient" />
      
      {/* Floating Orbs - Responsive sizes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s', animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-[500px] md:h-[500px] bg-gradient-to-br from-accent/30 to-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s', animationDuration: '10s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 md:w-[600px] md:h-[600px] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s', animationDuration: '12s' }} />
      </div>

      {/* Premium Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" style={{ 
        backgroundImage: 'linear-gradient(hsl(var(--foreground) / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.05) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Premium Social Proof Badge */}
        <div className="flex justify-center mb-8">
          <div className="group relative inline-flex items-center gap-3 bg-card/95 backdrop-blur-2xl px-6 py-3 rounded-full border border-border shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex -space-x-3 relative">
              <div className="w-8 h-8 rounded-full border-2 border-card overflow-hidden ring-2 ring-primary/30">
                <img src="/avatar-1.webp" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-card overflow-hidden ring-2 ring-accent/30">
                <img src="/avatar-2.webp" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-card overflow-hidden ring-2 ring-primary/30">
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
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />
          
          <div className="relative bg-card/95 backdrop-blur-2xl rounded-3xl border border-border p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 shadow-xl">
            {/* Premium Header */}
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-xl mb-3 sm:mb-4 shadow-lg animate-float">
                <div className="text-4xl sm:text-5xl animate-brain-pulse">🧠</div>
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
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 backdrop-blur-sm">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-semibold text-foreground mb-0.5">
                      ⚠️ Use Your Purchase Email
                    </p>
                    <p className="text-muted-foreground">
                      Use <strong>the same email</strong> from your NEP System purchase.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Premium Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email
                </Label>
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-10 sm:h-11 bg-input border-border hover:border-primary/50 focus:border-primary rounded-xl transition-all duration-300 text-base"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Password
                </Label>
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 h-10 sm:h-11 bg-input border-border hover:border-primary/50 focus:border-primary rounded-xl transition-all duration-300 text-base"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="group relative w-full h-11 text-base font-bold bg-gradient-to-r from-primary via-accent to-primary hover:shadow-2xl hover:shadow-primary/50 transition-all duration-500 overflow-hidden animate-gradient bg-[length:200%_auto]"
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
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-2 text-center">
                    Haven't purchased access yet?
                  </p>
                  <a
                    href="https://gtmsinop.mycartpanda.com/checkout/200782040:1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border border-primary/20 hover:border-primary/40 transition-all duration-300 w-full justify-center"
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
              <div className="pt-4 border-t border-border">
                <p className="text-xs font-semibold text-center mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  What you'll get:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="group relative overflow-hidden">
                    <div className="relative flex flex-col items-center gap-1.5 p-2 rounded-lg bg-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300">
                      <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/15 to-primary/10">
                        <Shield className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <p className="text-[10px] font-semibold text-foreground text-center">Safe & Secure</p>
                    </div>
                  </div>

                  <div className="group relative overflow-hidden">
                    <div className="relative flex flex-col items-center gap-1.5 p-2 rounded-lg bg-accent/5 border border-accent/20 hover:border-accent/40 transition-all duration-300">
                      <div className="p-1.5 rounded-lg bg-gradient-to-br from-accent/15 to-accent/10">
                        <Zap className="w-3.5 h-3.5 text-accent" />
                      </div>
                      <p className="text-[10px] font-semibold text-foreground text-center">Instant Access</p>
                    </div>
                  </div>

                  <div className="group relative overflow-hidden">
                    <div className="relative flex flex-col items-center gap-1.5 p-2 rounded-lg bg-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300">
                      <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/15 to-primary/10">
                        <DollarSign className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <p className="text-[10px] font-semibold text-foreground text-center">Full Access</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Premium Info Banner */}
        <div className="mt-4 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-muted/50 to-primary/5 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
          <div className="relative flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border backdrop-blur-xl">
            <div className="p-1.5 rounded-lg bg-muted/50">
              <Info className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>

        {/* Need Access Section - Only show on login */}
        {!isSignUp && (
          <div className="mt-8 p-6 border border-border rounded-xl bg-card/50 backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  🔒 NEP System Premium Access
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  This application is exclusive to members who purchased the NEP System program.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://nepsystem.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                  >
                    Get NEP System Access →
                  </a>
                  <a
                    href="mailto:support@nepsystem.com"
                    className="inline-flex items-center justify-center px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted/50 transition-colors text-sm font-medium"
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Welcome Gift Modal */}
      <WelcomeGiftModal 
        open={showWelcomeModal} 
        onClose={handleWelcomeModalClose} 
      />
    </div>
  );
}
