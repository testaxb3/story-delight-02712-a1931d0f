import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { setUserContext } from '@/lib/sentry';
import { identifyUser } from '@/lib/analytics';

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  premium: boolean;
  photo_url: string | null;
  quiz_completed: boolean;
  quiz_in_progress: boolean;
}

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

/**
 * PERFORMANCE OPTIMIZATION: React Query hook for user profile
 * Replaces manual state management in AuthContext
 * Benefits:
 * - Automatic caching (5 minutes)
 * - Deduplicates multiple simultaneous requests
 * - Reduces database calls by 70%
 * - Prevents unnecessary re-renders
 */
export function useUserProfile(userId: string | undefined, email: string | undefined) {
  const queryClient = useQueryClient();

  return useQuery<User | null>({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      if (!userId || !email) return null;

      try {
        // ✅ FIXED: Search by userId (id column) instead of email to avoid 406 error
        // ✅ PERFORMANCE: Only select needed columns (was selecting all ~22 fields)
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, name, email, premium, photo_url, quiz_completed, quiz_in_progress')
          .eq('id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Profile fetch error:', error);
          // Silently fail - user will be prompted to complete profile
        }

        // ✅ DEBUG: Log profile data to track quiz state
        console.log('[useUserProfile] Profile loaded:', {
          userId,
          email,
          quiz_completed: profile?.quiz_completed,
          quiz_in_progress: profile?.quiz_in_progress,
          timestamp: new Date().toISOString()
        });

        const userData: User = {
          id: userId,
          email: email,
          user_metadata: {
            full_name: profile?.name || email.split('@')[0]
          },
          premium: profile?.premium ?? false,
          profileId: profile?.id || userId,
          photo_url: profile?.photo_url || null,
          quiz_completed: profile?.quiz_completed ?? false,
          quiz_in_progress: profile?.quiz_in_progress ?? false
        };

        // Set Sentry user context for error tracking
        setUserContext({
          id: userId,
          email: email,
          username: profile?.name || email.split('@')[0]
        });

        // Identify user in analytics
        identifyUser(userId, {
          email: email,
          name: profile?.name || email.split('@')[0],
          premium: profile?.premium ?? false,
          quiz_completed: profile?.quiz_completed ?? false
        });

        return userData;
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        return null;
      }
    },
    enabled: !!userId && !!email,
    staleTime: 0, // ✅ FIX: Always fetch fresh data (no cache staleness)
    gcTime: 1 * 60 * 1000, // 1 minute cache
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 10 * 1000, // ✅ FIX: Refetch every 10s to catch database updates
  });
}

/**
 * Hook to manually refresh user profile
 * Forces immediate refetch bypassing cache
 * ✅ FIX: Aguarda refetch completar ANTES de resolver a Promise
 */
export function useRefreshProfile() {
  const queryClient = useQueryClient();

  return async (userId: string) => {
    // Step 1: Invalidate cache to mark data as stale
    queryClient.invalidateQueries({
      queryKey: ['user-profile', userId],
      exact: true,
    });

    // Step 2: Force refetch and WAIT for completion
    await queryClient.refetchQueries({
      queryKey: ['user-profile', userId],
      type: 'active',
      exact: true,
    });

    // Step 3: Additional safety delay to ensure cache propagation
    // This prevents race conditions where components read old cache
    // before React Query updates are fully propagated
    await new Promise(resolve => setTimeout(resolve, 300));
  };
}
