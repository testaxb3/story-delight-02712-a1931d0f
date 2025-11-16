// PERFORMANCE OPTIMIZATION: Refactored to use React Query
// Benefits: Automatic caching, deduplication, reduced re-renders
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { clearUserContext } from '@/lib/sentry';
import { resetUser } from '@/lib/analytics';
import { useUserProfile, useRefreshProfile } from '@/hooks/useUserProfile';

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
        // Handle token refresh errors gracefully
        if (event === 'TOKEN_REFRESHED') {
          // PERFORMANCE: Token refresh handled silently
        }

        if (event === 'SIGNED_OUT') {
          setSession(null);
          setAuthLoading(false);
          return;
        }

        setSession(session);
        
        // PERFORMANCE: Profile will be fetched automatically by useUserProfile hook
        // No need for manual fetchUserProfile call here
        if (!session?.user) {
          setAuthLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (password.length < MIN_PASSWORD_LENGTH) {
      return { error: { message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` } };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { error };
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
      // ✅ SECURITY: Validate if email is approved for access
      const { data: isApproved, error: checkError } = await supabase
        .rpc('is_email_approved', { p_email: email.toLowerCase().trim() });

      if (checkError) {
        console.error('Error checking approved status:', checkError);
        return { error: { message: 'Error validating access. Please try again.' } };
      }

      if (!isApproved) {
        return { 
          error: { 
            message: 'Access restricted to NEP System members. If you purchased access, please contact support@nepsystem.com' 
          } 
        };
      }

      // Create account with premium status
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            email: email,
            full_name: email.split('@')[0],
            premium: true
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        return { error };
      }

      if (data.user) {
        console.log('User created, creating profile...');
        // Create profile with premium status
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            name: email.split('@')[0],
            premium: true  // ✅ Set premium for approved users
          })
          .select()
          .single();

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Continue anyway - profile might have been created by trigger
        } else {
          console.log('Profile created successfully:', profile);
        }

        // ✅ Update approved_users with user_id
        await supabase
          .from('approved_users')
          .update({
            user_id: data.user.id,
            account_created: true,
            account_created_at: new Date().toISOString()
          })
          .eq('email', email.toLowerCase().trim());
      }

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
