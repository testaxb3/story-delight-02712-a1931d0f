import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, AlertCircle, Eye, EyeOff, Loader2, MessageCircle, Mail } from 'lucide-react';
import { memo, useState, useMemo } from 'react';

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

// Premium input with sophisticated states
const PremiumInput = memo(function PremiumInput({
  type,
  value,
  onChange,
  placeholder,
  label,
  disabled,
  error,
  success,
  autoFocus = false,
}: {
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  disabled?: boolean;
  error?: string;
  success?: boolean;
  autoFocus?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  
  const hasValue = value.length > 0;
  const showLabel = isFocused || hasValue;

  return (
    <div className="relative">
      {/* Floating label */}
      <AnimatePresence>
        {showLabel && (
          <motion.label
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={`
              absolute -top-2.5 left-4 px-2 text-xs font-medium z-10
              bg-[#0A0A0A]
              ${error ? 'text-red-400' : isFocused ? 'text-white/80' : 'text-white/40'}
              transition-colors duration-200
            `}
          >
            {label}
          </motion.label>
        )}
      </AnimatePresence>

      {/* Input container */}
      <div className="relative">
        {/* Glow effect on focus - INCREASED VISIBILITY */}
        <motion.div
          animate={{
            opacity: isFocused ? 1 : 0,
            scale: isFocused ? 1 : 0.98,
          }}
          transition={{ duration: 0.3 }}
          className={`
            absolute -inset-[2px] rounded-2xl blur-md
            ${error ? 'bg-red-500/40' : 'bg-white/30'}
          `}
        />

        {/* Input field */}
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          autoFocus={autoFocus}
          placeholder={!showLabel ? placeholder : ''}
          className={`
            relative w-full h-14 px-4 pr-12 rounded-2xl
            bg-white/[0.03] 
            text-white text-base
            placeholder:text-white/25
            outline-none
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error 
              ? 'border border-red-500/50 focus:border-red-500/70' 
              : 'border border-white/[0.08] focus:border-white/20 focus:bg-white/[0.05]'
            }
          `}
        />

        {/* Right side icons */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {/* Password toggle */}
          {isPassword && hasValue && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </motion.button>
          )}

          {/* Status indicator */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-red-400"
              >
                <AlertCircle className="w-4 h-4" />
              </motion.div>
            )}
            {success && !error && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-emerald-400"
              >
                <Check className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            transition={{ duration: 0.2 }}
            className="text-red-400 text-xs mt-2 ml-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

// Password strength indicator
const PasswordStrength = memo(function PasswordStrength({ 
  password 
}: { 
  password: string;
}) {
  const strength = useMemo(() => {
    if (password.length === 0) return { score: 0, label: '', color: '' };
    if (password.length < 6) return { score: 1, label: 'Too short', color: 'bg-red-500' };
    if (password.length < 8) return { score: 2, label: 'Weak', color: 'bg-orange-500' };
    
    let score = 2;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 3) return { score: 2, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 4) return { score: 3, label: 'Good', color: 'bg-emerald-500' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-400' };
  }, [password]);

  if (password.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-3"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className="flex-1 flex gap-1">
          {[1, 2, 3, 4].map((level) => (
            <motion.div
              key={level}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: level * 0.05, duration: 0.2 }}
              className={`
                h-1 flex-1 rounded-full origin-left
                ${level <= strength.score ? strength.color : 'bg-white/10'}
              `}
            />
          ))}
        </div>
        <span className={`text-xs font-medium ${
          strength.score <= 2 ? 'text-white/40' : 'text-white/60'
        }`}>
          {strength.label}
        </span>
      </div>
    </motion.div>
  );
});

// Animated submit button
const SubmitButton = memo(function SubmitButton({
  loading,
  disabled,
  children,
}: {
  loading: boolean;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="submit"
      disabled={disabled || loading}
      whileTap={{ scale: 0.98 }}
      className={`
        relative w-full h-14 rounded-2xl font-semibold text-lg
        overflow-hidden
        transition-all duration-300
        ${disabled
          ? 'bg-white/20 text-white/50 cursor-not-allowed'
          : 'bg-white text-black hover:bg-white/95'
        }
      `}
    >
      {/* Loading shimmer */}
      {loading && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent"
        />
      )}

      <span className="relative z-10 flex items-center justify-center gap-2">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Please wait...</span>
            </motion.span>
          ) : (
            <motion.span
              key="text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {children}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
});

// Back button with subtle animation
const BackButton = memo(function BackButton({ 
  onClick 
}: { 
  onClick: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="
        w-11 h-11 rounded-full
        bg-white/[0.03] border border-white/[0.08]
        flex items-center justify-center
        hover:bg-white/[0.06] hover:border-white/[0.12]
        transition-all duration-300
      "
    >
      <ArrowLeft className="w-5 h-5 text-white/60" />
    </motion.button>
  );
});

export const AuthForm = memo(function AuthForm({
  isSignUp,
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onBack,
  onToggleMode,
}: AuthFormProps) {
  // Simple email validation
  const emailError = useMemo(() => {
    if (!email) return undefined;
    if (!email.includes('@')) return 'Enter a valid email';
    if (!email.includes('.')) return 'Enter a valid email';
    return undefined;
  }, [email]);

  const emailValid = email.length > 0 && !emailError;
  const passwordValid = password.length >= 8;
  const formValid = emailValid && passwordValid;

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0.8 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0.8 }}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 300,
        mass: 0.8,
      }}
      className="min-h-screen w-full flex flex-col"
    >
      {/* Header with safe area - status bar space */}
      <div className="px-6 pt-[max(env(safe-area-inset-top),44px)] pb-4">
        <BackButton onClick={onBack} />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 flex flex-col">
        {/* Title section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-white text-3xl font-bold tracking-tight mb-2">
            {isSignUp ? 'Create account' : 'Welcome back'}
          </h1>
          <p className="text-white/40 text-base">
            {isSignUp
              ? 'Enter your email to get started'
              : 'Sign in to continue your journey'
            }
          </p>
        </motion.div>

        {/* Purchase email notice - only for sign up */}
        <AnimatePresence>
          {isSignUp && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="mb-6"
            >
              <div className="p-4 rounded-2xl bg-orange-500/[0.08] border border-orange-500/20">
                <p className="text-white/70 text-sm leading-relaxed">
                  <span className="text-orange-400 font-medium">Important:</span>{' '}
                  Use the same email address you used for your purchase.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.form 
          onSubmit={onSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-4"
        >
          <PremiumInput
            type="email"
            value={email}
            onChange={onEmailChange}
            placeholder="Enter your email"
            label="Email"
            disabled={loading}
            error={email.length > 3 ? emailError : undefined}
            success={emailValid}
            autoFocus
          />

          <div>
            <PremiumInput
              type="password"
              value={password}
              onChange={onPasswordChange}
              placeholder="Enter your password"
              label="Password"
              disabled={loading}
              success={passwordValid}
            />
            
            {/* Password strength - only for sign up */}
            {isSignUp && <PasswordStrength password={password} />}
          </div>

          {/* Submit button */}
          <div className="pt-4">
            <SubmitButton loading={loading} disabled={!formValid}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </SubmitButton>
          </div>
        </motion.form>

        {/* Forgot password - only for sign in */}
        {!isSignUp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center"
          >
            <button className="text-white/40 text-sm hover:text-white/60 transition-colors">
              Forgot password?
            </button>
          </motion.div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Toggle mode */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="py-6 text-center"
        >
          <button
            type="button"
            onClick={onToggleMode}
            className="text-white/40 text-base hover:text-white/60 transition-colors"
          >
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <span className="text-white font-medium">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </span>
          </button>
        </motion.div>

        {/* Support section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pb-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">Need help?</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => window.open('https://wa.me/27617525578?text=Hi!%20I%20need%20help%20with%20NEP%20System', '_blank')}
              className="w-11 h-11 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center hover:bg-green-500/30 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-green-400" />
            </button>
            
            <button
              type="button"
              onClick={() => window.location.href = 'mailto:support@nepsystem.pro'}
              className="w-11 h-11 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center hover:bg-blue-500/30 transition-colors"
            >
              <Mail className="w-5 h-5 text-blue-400" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Safe area padding */}
      <div className="h-[env(safe-area-inset-bottom,0px)]" />
    </motion.div>
  );
});
