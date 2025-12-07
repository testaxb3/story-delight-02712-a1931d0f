import { useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, AlertCircle, Eye, EyeOff, Loader2, MessageCircle, Mail, PartyPopper, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PremiumBackground } from '@/components/auth/PremiumBackground';
import { toast } from 'sonner';

// Premium input with sophisticated states (from AuthForm)
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

      <div className="relative">
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

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isPassword && hasValue && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </motion.button>
          )}

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

// Password strength indicator (from AuthForm)
const PasswordStrength = memo(function PasswordStrength({ password }: { password: string }) {
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
        <span className={`text-xs font-medium ${strength.score <= 2 ? 'text-white/40' : 'text-white/60'}`}>
          {strength.label}
        </span>
      </div>
    </motion.div>
  );
});

// Celebration animation
const CelebrationIcon = () => (
  <motion.div
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
    className="relative"
  >
    <motion.div
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center"
    >
      <PartyPopper className="w-10 h-10 text-emerald-400" />
    </motion.div>
    
    {/* Sparkles */}
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0, 1, 0], 
          scale: [0.5, 1, 0.5],
          x: [0, (i - 1) * 30],
          y: [0, -20 - i * 10]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          delay: i * 0.3,
          ease: 'easeOut'
        }}
        className="absolute top-0 left-1/2"
      >
        <Sparkles className="w-4 h-4 text-yellow-400" />
      </motion.div>
    ))}
  </motion.div>
);

export default function Welcome() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Email validation
  const emailError = useMemo(() => {
    if (!email) return undefined;
    if (!email.includes('@')) return 'Enter a valid email';
    if (!email.includes('.')) return 'Enter a valid email';
    return undefined;
  }, [email]);

  const emailValid = email.length > 0 && !emailError;
  const passwordValid = password.length >= 8;
  const formValid = emailValid && passwordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid || loading) return;

    setLoading(true);
    setFormError(null);

    try {
      const { error } = await signUp(email, password);
      
      if (error) {
        // Handle specific errors
        if (error.message?.includes('EMAIL_NOT_APPROVED') || error.message?.includes('not approved')) {
          setFormError('This email doesn\'t have a purchase. Please use the same email you used when buying.');
          return;
        }
        
        if (error.message?.includes('already registered') || error.message?.includes('already exists')) {
          setFormError('An account with this email already exists.');
          toast.info('Already have an account?', {
            description: 'Click "Sign In" below to access your account.',
            duration: 5000,
          });
          return;
        }

        // Generic error
        setFormError(error.message || 'Something went wrong. Please try again.');
        return;
      }

      // Success - redirect to PWA install flow
      toast.success('Account created!', {
        description: 'Welcome to The Obedience Language!',
      });
      navigate('/pwa-install');
    } catch (err) {
      setFormError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030303] relative overflow-hidden">
      <PremiumBackground />
      
      <div 
        className="relative z-10 min-h-screen flex flex-col px-6"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 2rem)' }}
      >
        {/* Header with celebration */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center pt-8 pb-6"
        >
          <CelebrationIcon />
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-white text-2xl sm:text-3xl font-bold text-center mt-6"
          >
            Purchase Confirmed!
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-white/50 text-center mt-2"
          >
            Let's set up your account
          </motion.p>
        </motion.div>

        {/* Important notice */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mb-6"
        >
          <div className="p-4 rounded-2xl bg-orange-500/[0.08] border border-orange-500/20">
            <p className="text-white/70 text-sm leading-relaxed text-center">
              <span className="text-orange-400 font-medium">Important:</span>{' '}
              Use the same email address you used for your purchase.
            </p>
          </div>
        </motion.div>

        {/* Form error */}
        <AnimatePresence>
          {formError && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-4"
            >
              <div className="p-4 rounded-2xl bg-red-500/[0.08] border border-red-500/20">
                <p className="text-red-400 text-sm text-center">
                  {formError}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-4"
        >
          <PremiumInput
            type="email"
            value={email}
            onChange={setEmail}
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
              onChange={setPassword}
              placeholder="Create a password"
              label="Password"
              disabled={loading}
              success={passwordValid}
            />
            <PasswordStrength password={password} />
          </div>

          {/* Submit button */}
          <div className="pt-4">
            <motion.button
              type="submit"
              disabled={!formValid || loading}
              whileTap={{ scale: 0.98 }}
              className={`
                relative w-full h-14 rounded-2xl font-semibold text-lg
                overflow-hidden transition-all duration-300
                ${!formValid || loading
                  ? 'bg-white/20 text-white/50 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-white/95'
                }
              `}
            >
              {loading && (
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent"
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  'Create My Account'
                )}
              </span>
            </motion.button>
          </div>
        </motion.form>

        {/* Already have account */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center"
        >
          <button
            type="button"
            onClick={() => navigate('/auth')}
            className="text-white/40 text-base hover:text-white/60 transition-colors"
          >
            Already have an account?{' '}
            <span className="text-white font-medium">Sign In</span>
          </button>
        </motion.div>

        {/* Spacer */}
        <div className="flex-1 min-h-8" />

        {/* Support section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="pb-8"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 2rem)' }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-white/30 text-xs">Need help?</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <motion.a
              href="https://wa.me/27617525578?text=Hi!%20I%20need%20help%20with%20NEP%20System"
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">WhatsApp</span>
            </motion.a>
            
            <motion.a
              href="mailto:support@nepsystem.pro"
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/15 transition-colors"
            >
              <Mail className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">Email</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
