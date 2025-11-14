import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { setUserContext, clearUserContext } from '@/lib/sentry';

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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (userId: string, email: string) => {
    try {
      // ✅ FIXED: Search by userId (id column) instead of email to avoid 406 error
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Profile fetch error:', error);
        // Silently fail - user will be prompted to complete profile
      }

      const userData = {
        id: userId,
        email: email,
        user_metadata: {
          full_name: profile?.name || email.split('@')[0]
        },
        premium: profile?.premium ?? false, // ✅ SECURITY FIX: Default to free tier
        profileId: profile?.id || userId,
        photo_url: profile?.photo_url || null,
        quiz_completed: profile?.quiz_completed ?? false,
        quiz_in_progress: profile?.quiz_in_progress ?? false
      };

      setUser(userData);

      // Set Sentry user context for error tracking
      setUserContext({
        id: userId,
        email: email,
        username: profile?.name || email.split('@')[0]
      });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since function only uses state setters (which are stable)

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth] State change:', event, session ? 'Session exists' : 'No session');

        // Handle token refresh errors gracefully
        if (event === 'TOKEN_REFRESHED') {
          console.log('[Auth] Token refreshed successfully');
        }

        if (event === 'SIGNED_OUT') {
          console.log('[Auth] User signed out');
          setUser(null);
          setSession(null);
          return;
        }

        setSession(session);
        if (session?.user) {
          // Fetch user profile to get premium status
          setTimeout(() => {
            fetchUserProfile(session.user.id, session.user.email || '');
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.email || '');
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

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
      const { data, error } = await supabase.auth.signUp({
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

      if (data.user) {
        console.log('User created, creating profile...');
        // Create profile and wait for it
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,  // ✅ CRITICAL: Use the auth user's id
            email,
            name: email.split('@')[0],
            premium: false
          })
          .select()
          .single();

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Continue anyway - profile might have been created by trigger
        } else {
          console.log('Profile created successfully:', profile);
        }
      }

      return { error: null };
    } catch (error: any) {
      console.error('SignUp exception:', error);
      return { error: { message: error.message || 'Failed to sign up' } };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    // Clear Sentry user context
    clearUserContext();
  };

  const refreshUser = async () => {
    if (!user?.id || !user?.email) return;
    await fetchUserProfile(user.id, user.email);
  };

  return (
    <AuthContext.Provider value={{
      user,
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
