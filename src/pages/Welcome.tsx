import { useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, AlertCircle, Eye, EyeOff, Loader2, CheckCircle, MessageCircle, Mail, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Clean light mode input
const CleanInput = memo(function CleanInput({
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

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className={`
            w-full h-12 px-4 pr-12 rounded-xl
            bg-white text-gray-900 text-base
            placeholder:text-gray-400
            outline-none
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50
            ${error 
              ? 'border-2 border-red-400 focus:border-red-500' 
              : success
                ? 'border-2 border-emerald-400 focus:border-emerald-500'
                : 'border border-gray-300 focus:border-emerald-500 focus:border-2'
            }
          `}
        />

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isPassword && value.length > 0 && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-red-500"
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
                className="text-emerald-500"
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
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-red-500 text-xs"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

// Simple password strength
const PasswordStrength = memo(function PasswordStrength({ password }: { password: string }) {
  const strength = useMemo(() => {
    if (password.length === 0) return { score: 0, label: '', color: '' };
    if (password.length < 6) return { score: 1, label: 'Too short', color: 'bg-red-400' };
    if (password.length < 8) return { score: 2, label: 'Weak', color: 'bg-orange-400' };
    
    let score = 2;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 3) return { score: 2, label: 'Fair', color: 'bg-yellow-400' };
    if (score <= 4) return { score: 3, label: 'Good', color: 'bg-emerald-400' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
  }, [password]);

  if (password.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="mt-2"
    >
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`
                h-1 flex-1 rounded-full transition-colors
                ${level <= strength.score ? strength.color : 'bg-gray-200'}
              `}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">{strength.label}</span>
      </div>
    </motion.div>
  );
});

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
        if (error.code === 'EMAIL_NOT_APPROVED' || 
            error.message?.includes('EMAIL_NOT_APPROVED') || 
            error.message?.includes('not approved') ||
            error.message?.includes('Purchase required')) {
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

        setFormError(error.message || 'Something went wrong. Please try again.');
        return;
      }

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
    <div 
      className="min-h-screen w-full bg-gray-50"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="min-h-screen flex flex-col px-6 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center pt-8 pb-6"
        >
          {/* Simple check icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 150, delay: 0.1 }}
            className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-5"
          >
            <CheckCircle className="w-9 h-9 text-emerald-500" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-900 text-2xl font-semibold text-center"
          >
            You're in! 🎉
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 text-center mt-1"
          >
            Create your account to get started
          </motion.p>
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
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200">
                <p className="text-red-600 text-sm text-center">
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
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <CleanInput
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
            <CleanInput
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Create a password (8+ characters)"
              label="Password"
              disabled={loading}
              success={passwordValid}
            />
            <PasswordStrength password={password} />
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <motion.button
              type="submit"
              disabled={!formValid || loading}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full h-12 rounded-xl font-semibold text-base
                transition-all duration-200
                ${!formValid || loading
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700'
                }
              `}
            >
              <span className="flex items-center justify-center gap-2">
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

        {/* Important notice - discrete below button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4"
        >
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-700 text-xs leading-relaxed">
              Use the same email you used when purchasing.
            </p>
          </div>
        </motion.div>


        {/* Spacer */}
        <div className="flex-1 min-h-8" />

        {/* Support section - simple text links */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1.5rem)' }}
        >
          <p className="text-gray-400 text-xs mb-2">Need help?</p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://wa.me/27617525578?text=Hi!%20I%20need%20help%20with%20NEP%20System"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-gray-500 hover:text-emerald-600 transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            
            <span className="text-gray-300">•</span>
            
            <a
              href="mailto:support@nepsystem.pro"
              className="flex items-center gap-1.5 text-gray-500 hover:text-emerald-600 transition-colors text-sm"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
