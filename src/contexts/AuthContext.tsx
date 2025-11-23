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

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { error };
      }

      // ✅ FIX: Invalidate all caches on login to ensure fresh data
      // This prevents showing stale quiz_completed status
      if (data?.user?.id) {
        queryClient.invalidateQueries({ queryKey: ['user-profile', data.user.id] });
        queryClient.invalidateQueries({ queryKey: ['child-profiles'] });
      }

      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'Failed to sign in' } };
    }
  };

  const signUp = async (email: string, password: string) => {
    if (password.length < MIN_PASSWORD_LENGTH) {
      return { error: { message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` } };
    }

    try {
      // Create account - profile will be created automatically by database trigger
      const { error } = await supabase.auth.signUp({
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
