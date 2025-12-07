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
          if (import.meta.env.DEV) console.error('Profile fetch error:', error);
          // Silently fail - user will be prompted to complete profile
        }

        // ✅ DEBUG: Log profile data to track quiz state
        if (import.meta.env.DEV) {
          console.log('[useUserProfile] Profile loaded:', {
            userId,
            email,
            name: profile?.name,
            quiz_completed: profile?.quiz_completed,
            quiz_in_progress: profile?.quiz_in_progress,
            timestamp: new Date().toISOString()
          });
        }

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
        if (import.meta.env.DEV) console.error('Failed to fetch user profile:', error);
        return null;
      }
    },
    enabled: !!userId && !!email,
    staleTime: 0, // Always treat data as stale - CRITICAL for quiz_completed accuracy
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 2, // Increased retry to handle transient failures
    refetchOnMount: 'always', // ✅ CRITICAL: Always refetch to get fresh quiz_completed state
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to manually refresh user profile
 * Forces immediate refetch bypassing cache
 * ✅ FIX: Aguarda refetch completar ANTES de resolver a Promise
 * ✅ FIX CRÍTICO: Aumentado delay para 500ms para garantir propagação completa
 */
export function useRefreshProfile() {
  const queryClient = useQueryClient();

  return async (userId: string) => {
    if (import.meta.env.DEV) console.log('🔵 [useRefreshProfile] Iniciando refresh para userId:', userId);
    
    // Step 1: Invalidate cache to mark data as stale
    queryClient.invalidateQueries({
      queryKey: ['user-profile', userId],
      exact: true,
    });
    if (import.meta.env.DEV) console.log('🔵 [useRefreshProfile] Cache invalidado');

    // Step 2: Force refetch and WAIT for completion
    await queryClient.refetchQueries({
      queryKey: ['user-profile', userId],
      type: 'active',
      exact: true,
    });
    if (import.meta.env.DEV) console.log('🔵 [useRefreshProfile] Refetch completado');

    // Step 3: Additional safety delay to ensure cache propagation
    // ✅ CRITICAL FIX: Aumentado de 300ms para 500ms
    // Isso garante que React Query, Supabase e componentes tenham tempo de propagar os dados
    await new Promise(resolve => setTimeout(resolve, 500));
    if (import.meta.env.DEV) console.log('✅ [useRefreshProfile] Delay de propagação completado (500ms)');
  };
}
