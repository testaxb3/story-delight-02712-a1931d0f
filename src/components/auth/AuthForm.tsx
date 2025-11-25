import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AuthFormProps {
  isSignUp: boolean;
  email: string;
  password: string;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  onToggleMode: () => void;
}

export function AuthForm({
  isSignUp,
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onBack,
  onToggleMode
}: AuthFormProps) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="min-h-screen w-full flex flex-col"
      style={{ background: '#0D0D0D' }}
    >
      {/* Header with back button */}
      <div className="px-6 pt-6 pb-8">
        <button
          onClick={onBack}
          className="
            w-10 h-10 rounded-full
            bg-white/10 backdrop-blur-sm
            flex items-center justify-center
            active:scale-95 transition-transform
          "
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {/* Title */}
          <div>
            <h1 className="text-white text-3xl font-bold mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-white/60">
              {isSignUp 
                ? 'Enter your email to get started'
                : 'Sign in to continue your journey'
              }
            </p>
          </div>

          {/* Purchase email notice */}
          {isSignUp && (
            <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20">
              <p className="text-white/90 text-sm leading-relaxed">
                ⚠️ Use the same email address you used for your purchase
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-white/80 text-sm font-medium pl-1">
                Email
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                disabled={loading}
                className="
                  h-14 px-4 rounded-2xl
                  bg-white/5 border-white/10
                  text-white placeholder:text-white/40
                  focus:border-white/30 focus:bg-white/10
                  transition-colors
                "
              />
            </div>

            <div className="space-y-1">
              <label className="text-white/80 text-sm font-medium pl-1">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                disabled={loading}
                className="
                  h-14 px-4 rounded-2xl
                  bg-white/5 border-white/10
                  text-white placeholder:text-white/40
                  focus:border-white/30 focus:bg-white/10
                  transition-colors
                "
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="
                w-full h-14 rounded-[30px]
                bg-white text-black
                text-lg font-semibold
                hover:bg-white/90
                disabled:opacity-50 disabled:cursor-not-allowed
                active:scale-95 transition-all
              "
            >
              {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          {/* Toggle mode */}
          <div className="text-center pt-4">
            <button
              onClick={onToggleMode}
              className="text-white/70 text-base hover:text-white transition-colors"
            >
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <span className="text-white font-semibold">
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom padding for safe area */}
      <div className="pb-[calc(env(safe-area-inset-bottom,0px)+2rem)]" />
    </motion.div>
  );
}
