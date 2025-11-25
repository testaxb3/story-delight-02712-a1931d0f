// PERFORMANCE OPTIMIZATION: Refactored to use React Query
// Benefits: Automatic caching, deduplication, reduced re-renders
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { clearUserContext } from '@/lib/sentry';
import { resetUser } from '@/lib/analytics';
import { useUserProfile, useRefreshProfile } from '@/hooks/useUserProfile';
import { ensureUserScaffolding } from '@/lib/supabase/scaffolding';
import { useQueryClient } from '@tanstack/react-query';

// ✅ SECURITY: Password requirements
const MIN_PASSWORD_LENGTH = 8;

interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
  };
  premium: boolean;
  profileId?: string;
  photo_url?: string | null;
  quiz_completed?: boolean;
  quiz_in_progress?: boolean;
}

interface AuthContextType {
  user: User | null;
  session: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const queryClient = useQueryClient();

  // PERFORMANCE: Use React Query hook for profile data
  // This replaces manual state management and provides automatic caching
  const {
    data: user,
    isLoading: profileLoading,
    refetch: refetchProfile
  } = useUserProfile(session?.user?.id, session?.user?.email);

  const refreshProfile = useRefreshProfile();

  // Combined loading state: auth loading OR profile loading
  const loading = authLoading || (!!session && profileLoading);

  useEffect(() => {
    // 🔄 Check for saved session (for PWA fresh installs)
    const savedSessionStr = localStorage.getItem('saved_pwa_session');
    if (savedSessionStr) {
      try {
        const savedSession = JSON.parse(savedSessionStr);
        // Validate and restore session
        if (savedSession?.access_token && savedSession?.refresh_token) {
          console.log('[AuthContext] 🔄 Restoring saved PWA session');

          // ✅ CRITICAL FIX: Limpar TODO o cache do React Query ao restaurar sessão PWA
          // Isso garante que dados frescos sejam carregados, especialmente quiz_completed
          console.log('[AuthContext] 🧹 Limpando cache do React Query para sessão PWA');
          queryClient.clear();

          supabase.auth.setSession({
            access_token: savedSession.access_token,
            refresh_token: savedSession.refresh_token
          });
        }
      } catch (err) {
        console.error('[AuthContext] Failed to restore saved session:', err);
        localStorage.removeItem('saved_pwa_session');
      }
    }

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AuthContext] Auth state change:', event, 'userId:', session?.user?.id, 'email:', session?.user?.email);

        // Handle token refresh errors gracefully
        if (event === 'TOKEN_REFRESHED') {
          // PERFORMANCE: Token refresh handled silently
          return; // Don't update session on refresh to prevent re-renders
        }

        if (event === 'SIGNED_OUT') {
          console.log('[AuthContext] User signed out');
          setSession(null);
          setAuthLoading(false);
          // Clear saved session on logout
          localStorage.removeItem('saved_pwa_session');
          return;
        }

        // Only update session if it actually changed
        setSession(prevSession => {
          const isDifferent = prevSession?.user?.id !== session?.user?.id;
          if (isDifferent) {
            console.log('[AuthContext] Session updated from', prevSession?.user?.id, 'to', session?.user?.id);
          }
          return session;
        });

        // 💾 Save session for PWA reinstalls
        if (session?.access_token && session?.refresh_token) {
          localStorage.setItem('saved_pwa_session', JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token
          }));
        }

        // Ensure user scaffolding on sign in (fallback safety check)
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(() => {
            ensureUserScaffolding(session.user.id, session.user.email || '').catch(err => {
              console.error('Failed to ensure user scaffolding:', err);
            });
          }, 0);
        }

        // PERFORMANCE: Profile will be fetched automatically by useUserProfile hook
        // No need for manual fetchUserProfile call here
        if (!session?.user) {
          setAuthLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[AuthContext] Initial session check:', session?.user?.id, session?.user?.email);
      setSession(session);
      setAuthLoading(false);

      // Ensure scaffolding for existing session (fallback)
      if (session?.user) {
        setTimeout(() => {
          ensureUserScaffolding(session.user.id, session.user.email || '').catch(err => {
            console.error('Failed to ensure user scaffolding:', err);
          });
        }, 0);
      }
    });

    return () => {
      console.log('[AuthContext] Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (password.length < MIN_PASSWORD_LENGTH) {
      return { error: { message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` } };
    }

    // ✅ NETWORK ERROR HANDLING: Retry logic for transient failures
    const maxRetries = 2;
    let lastError: any = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          // Check if it's a network/server error that might be transient
          if (error.message?.includes('500') ||
            error.message?.includes('EOF') ||
            error.message?.includes('network') ||
            error.status === 500) {
            lastError = error;
            if (attempt < maxRetries) {
              console.log(`[AuthContext] Network error on attempt ${attempt + 1}, retrying...`);
              await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
              continue;
            }
          }
          return { error };
        }

        // 💾 Save session for PWA
        if (data?.session) {
          localStorage.setItem('saved_pwa_session', JSON.stringify({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
          }));
        }

        // ✅ CRITICAL FIX: Limpar TODO o cache após login para evitar dados stale
        // Especialmente importante para PWA no iPhone onde cache pode persistir
        if (data?.user?.id) {
          console.log('[AuthContext] 🧹 Limpando TODO o cache do React Query após login');
          queryClient.clear();
          console.log('[AuthContext] ✅ Cache limpo - dados frescos serão carregados');
        }

        return { error: null };
      } catch (error: any) {
        console.error(`[AuthContext] SignIn attempt ${attempt + 1} failed:`, error);
        lastError = error;

        // Retry on network errors
        if (attempt < maxRetries && (
          error.message?.includes('Failed to fetch') ||
          error.message?.includes('Network') ||
          error.message?.includes('timeout')
        )) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }

        return { error: { message: error.message || 'Failed to sign in. Please check your connection.' } };
      }
    }

    return {
      error: {
        message: lastError?.message || 'Connection failed. Please check your internet and try again.'
      }
    };
  };

  const signUp = async (email: string, password: string) => {
    if (password.length < MIN_PASSWORD_LENGTH) {
      return { error: { message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` } };
    }

    try {
      // Create account - profile will be created automatically by database trigger
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            email: email,
            full_name: email.split('@')[0]
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        return { error };
      }

      // 💾 Save session for PWA
      if (data?.session) {
        localStorage.setItem('saved_pwa_session', JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        }));
      }

      // ✅ FIX: Clear React Query cache on sign-up to prevent stale data
      if (data?.user?.id) {
        console.log('[AuthContext] 🧹 Clearing React Query cache after sign-up');
        queryClient.clear();
        console.log('[AuthContext] ✅ Cache cleared - fresh data will be loaded');
      }

      // Profile and user_progress are created automatically by the handle_new_user() trigger
      return { error: null };
    } catch (error: any) {
      console.error('SignUp exception:', error);
      return { error: { message: error.message || 'Failed to sign up' } };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    // Clear Sentry user context
    clearUserContext();
    // Reset analytics user identification
    resetUser();

    // Limpar marcadores de sessão e update
    localStorage.removeItem('app_session_start');
    localStorage.removeItem('app_version_acknowledged');
    localStorage.removeItem('saved_pwa_session');

    // Note: We DON'T clear 'pwa_flow_completed' so user doesn't see PWA flow again on re-login
  };

  const refreshUser = async () => {
    if (!session?.user?.id) return;

    // PERFORMANCE: Use React Query's refresh mechanism
    await refreshProfile(session.user.id);
    await refetchProfile();
  };

  return (
    <AuthContext.Provider value={{
      user: user ?? null,
      session,
      loading,
      signIn,
      signUp,
      signOut,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
