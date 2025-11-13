import { supabase } from '@/integrations/supabase/client';
import { AuthError, MagicLinkSentError } from '@/contexts/auth.types';
import { ensureUserScaffolding } from '@/lib/supabase/scaffolding';
import { t } from '@/hooks/useTranslation';

const getRedirectUrl = (): string => {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}/auth`;
};

const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

const isEmailValid = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const signInWithEmail = async (email: string): Promise<void> => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    throw new AuthError('Please enter your email.', 'EMPTY_EMAIL');
  }

  if (!isEmailValid(normalizedEmail)) {
    throw new AuthError('Please enter a valid email.', 'INVALID_EMAIL');
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: normalizedEmail,
    options: {
      emailRedirectTo: getRedirectUrl(),
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error('[Auth] OTP sign-in error:', { code: error.code, message: error.message });
    
    if (error.message?.toLowerCase().includes('rate limit')) {
      throw new AuthError(
        'Too many attempts. Wait a few minutes and try again.',
        'RATE_LIMIT'
      );
    }

    throw new AuthError(
      t().auth.errors.otpSendError,
      error.code || 'OTP_SEND_ERROR'
    );
  }

  throw new MagicLinkSentError(
    'We sent a confirmation link to your email. Click it to continue.'
  );
};

export const verifyOtpToken = async (
  email: string,
  token: string,
  type: 'email' | 'recovery' = 'email'
): Promise<void> => {
  const normalizedEmail = normalizeEmail(email);

  const { error } = await supabase.auth.verifyOtp({
    email: normalizedEmail,
    token,
    type,
  });

  if (error) {
    console.error('[Auth] OTP verification error:', { code: error.code, message: error.message });

    if (error.message?.toLowerCase().includes('expired')) {
      throw new AuthError(
        'The link has expired. Request a new confirmation link.',
        'OTP_EXPIRED'
      );
    }

    if (error.message?.toLowerCase().includes('invalid')) {
      throw new AuthError(
        'The link is invalid. Request a new one.',
        'OTP_INVALID'
      );
    }

    throw new AuthError(
      t().auth.errors.otpVerifyError,
      error.code || 'OTP_VERIFY_ERROR'
    );
  }
};

export const ensureUserProfile = async (userId: string, email: string): Promise<void> => {
  try {
    await ensureUserScaffolding(userId, email);
  } catch (error) {
    console.error('[Auth] Profile scaffolding error:', error);
    // Don't throw error here, as scaffolding is a secondary operation
    // If it fails, the user can still use the application
  }
};

export const signOutUser = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('[Auth] Sign-out error:', { code: error.code, message: error.message });
    throw new AuthError(
      t().auth.errors.signoutError,
      error.code || 'SIGNOUT_ERROR'
    );
  }
};

