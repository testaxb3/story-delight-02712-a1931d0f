import { memo } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface AuthCardProps {
  isSignUp: boolean;
  email: string;
  password: string;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleMode: () => void;
}

export const AuthCard = memo(function AuthCard({
  isSignUp,
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onToggleMode
}: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // Apple-style easing
      className="w-full max-w-[400px] mx-auto"
    >
      <div className="flex flex-col items-center text-center">
        
        {/* Animated Icon */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 w-20 h-20 rounded-[24px] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shadow-inner border border-white/10"
        >
          <Sparkles className="w-10 h-10 text-primary" />
        </motion.div>

        {/* Typography - Editorial Style */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10 space-y-2"
        >
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {isSignUp ? 'Create account' : 'Welcome back'}
          </h1>
          <p className="text-muted-foreground text-[15px]">
            {isSignUp 
              ? 'Enter your details to get started.' 
              : 'Enter your credentials to continue.'}
          </p>
          
          {/* Purchase Email Warning */}
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-3 inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-600/90 dark:text-amber-400/90 text-xs font-medium border border-amber-500/20"
          >
            Please use the email from your purchase
          </motion.div>
        </motion.div>

        {/* Form - Floating Inputs */}
        <motion.form 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          onSubmit={onSubmit} 
          className="w-full space-y-4"
        >
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                className="h-14 pl-12 bg-secondary/30 border-transparent focus:bg-background focus:border-border/50 rounded-2xl text-[16px] shadow-sm transition-all duration-300 placeholder:text-muted-foreground/50"
                required
                disabled={loading}
              />
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                className="h-14 pl-12 bg-secondary/30 border-transparent focus:bg-background focus:border-border/50 rounded-2xl text-[16px] shadow-sm transition-all duration-300 placeholder:text-muted-foreground/50"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Primary Action */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 mt-6 rounded-2xl text-[16px] font-semibold bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="flex items-center justify-center gap-2">
                Continue <ArrowRight className="w-4 h-4 opacity-70" />
              </span>
            )}
          </Button>
        </motion.form>

        {/* Footer / Toggle */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <button
            type="button"
            onClick={onToggleMode}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <span className="text-primary underline decoration-border/50 underline-offset-4">
              {isSignUp ? 'Sign in' : 'Sign up'}
            </span>
          </button>

          {isSignUp && (
            <div className="mt-8 pt-6 border-t border-border/40 w-full">
              <p className="text-xs text-muted-foreground mb-3">Don't have access yet?</p>
              <a
                href="https://gtmsinop.mycartpanda.com/checkout/200782040:1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/50 text-sm font-medium transition-all hover:scale-105 active:scale-95"
              >
                Purchase NEP System
              </a>
            </div>
          )}
          
          <div className="mt-8 flex justify-center gap-6 text-xs text-muted-foreground/60">
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
});
