import { memo } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles } from 'lucide-react';
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
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md"
    >
      {/* Glassmorphism Card with Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card to-card/95 backdrop-blur-xl border border-border/50 shadow-2xl">
        {/* Ambient Light Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />
        
        <div className="relative p-8 md:p-10">
          {/* Logo/Icon Header */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isSignUp
                ? 'Start your journey with NEP System'
                : 'Continue your transformation'}
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <label htmlFor="email" className="text-sm font-medium text-foreground/90 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Email
              </label>
              <div className="relative group">
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  className="h-12 bg-muted/50 border-border/50 rounded-xl text-base 
                    placeholder:text-muted-foreground/60 
                    focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                    transition-all duration-200
                    group-hover:border-border"
                  required
                  disabled={loading}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
              className="space-y-2"
            >
              <label htmlFor="password" className="text-sm font-medium text-foreground/90 flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Password
              </label>
              <div className="relative group">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  className="h-12 bg-muted/50 border-border/50 rounded-xl text-base 
                    placeholder:text-muted-foreground/60 
                    focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                    transition-all duration-200
                    group-hover:border-border"
                  required
                  disabled={loading}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground 
                  hover:shadow-xl hover:shadow-primary/25 hover:scale-[1.02]
                  active:scale-[0.98]
                  text-base font-semibold rounded-xl 
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    />
                    <span>Processing...</span>
                  </motion.div>
                ) : (
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Toggle Mode */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-6"
          >
            <button
              type="button"
              onClick={onToggleMode}
              disabled={loading}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 disabled:opacity-50"
            >
              {isSignUp
                ? 'Already have an account? '
                : "Don't have an account? "}
              <span className="text-primary font-medium">
                {isSignUp ? 'Sign in' : 'Sign up'}
              </span>
            </button>
          </motion.div>

          {/* Purchase Link */}
          {isSignUp && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="pt-6 mt-6 border-t border-border/50"
            >
              <p className="text-xs text-muted-foreground mb-3 text-center">
                Need access to NEP System?
              </p>
              <a
                href="https://gtmsinop.mycartpanda.com/checkout/200782040:1"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 px-4 text-center text-sm font-medium 
                  text-foreground bg-muted/50 hover:bg-muted 
                  rounded-xl transition-all duration-200
                  hover:scale-[1.02] active:scale-[0.98]
                  border border-border/50"
              >
                Purchase Access →
              </a>
            </motion.div>
          )}

          {/* Terms */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xs text-center text-muted-foreground/70 mt-6"
          >
            By continuing, you agree to our{" "}
            <Link to="/terms" className="text-muted-foreground hover:text-foreground underline transition-colors">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground underline transition-colors">
              Privacy Policy
            </Link>
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
});
