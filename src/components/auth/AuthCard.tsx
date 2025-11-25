import { memo } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-sm mx-auto px-6"
    >
      <div className="flex flex-col">
        
        {/* App Name */}
        <div className="text-center mb-12">
          <h2 className="text-sm font-medium text-muted-foreground">NEP System</h2>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSignUp 
              ? 'Sign up to get started.' 
              : 'Sign in to continue.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-3">
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="h-12 px-4 bg-transparent border border-border rounded-xl text-base placeholder:text-muted-foreground focus:border-accent transition-colors"
              required
              disabled={loading}
            />

            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              className="h-12 px-4 bg-transparent border border-border rounded-xl text-base placeholder:text-muted-foreground focus:border-accent transition-colors"
              required
              disabled={loading}
            />
          </div>

          {/* Continue Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-6 rounded-xl text-base font-medium bg-accent text-white hover:bg-accent/90 transition-colors"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Continue'
            )}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-4">
          {!isSignUp && (
            <button className="text-sm text-accent hover:text-accent/80 transition-colors">
              Forgot password?
            </button>
          )}
          
          <button
            type="button"
            onClick={onToggleMode}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors block w-full"
          >
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <span className="text-accent">
              {isSignUp ? 'Sign in' : 'Sign up'}
            </span>
          </button>
        </div>

      </div>
    </motion.div>
  );
});
