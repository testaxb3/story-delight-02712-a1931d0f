import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface RateLimitInfo {
  canAccess: boolean;
  remaining: number;
  limit: number;
  unlimited: boolean;
  used?: number;
  message: string;
}

export function useScriptRateLimit() {
  const [checking, setChecking] = useState(false);
  const [limitInfo, setLimitInfo] = useState<RateLimitInfo | null>(null);

  /**
   * Check if user can access a script based on rate limits
   * Free users: 50 scripts per 24 hours
   * Premium/Admin: Unlimited
   */
  const checkRateLimit = useCallback(async (): Promise<boolean> => {
    setChecking(true);

    try {
      const { data, error } = await supabase.rpc('get_remaining_script_accesses');

      if (error) {
        logger.error('Rate limit check error:', error);
        // On error, allow access (fail open)
        return true;
      }

      if (!data) {
        logger.error('No data from rate limit check');
        return true;
      }

      setLimitInfo(data as RateLimitInfo);

      if (!data.canAccess) {
        toast.error(
          data.message || 'Daily limit reached. Upgrade to premium for unlimited access.',
          {
            duration: 5000,
            action: {
              label: 'Upgrade',
              onClick: () => {
                // Navigate to upgrade page or open upgrade modal
                window.location.href = '/profile#upgrade';
              },
            },
          }
        );
        return false;
      }

      // Show warning when approaching limit (10 remaining)
      if (!data.unlimited && data.remaining <= 10 && data.remaining > 0) {
        toast.warning(`You have ${data.remaining} script accesses remaining today.`, {
          duration: 3000,
        });
      }

      return true;
    } catch (error) {
      logger.error('Unexpected rate limit check error:', error);
      // On error, allow access (fail open)
      return true;
    } finally {
      setChecking(false);
    }
  }, []);

  /**
   * Get current rate limit information without checking
   */
  const getRateLimitInfo = useCallback(async (): Promise<RateLimitInfo | null> => {
    try {
      const { data, error } = await supabase.rpc('get_remaining_script_accesses');

      if (error) {
        logger.error('Rate limit info error:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      const info = data as RateLimitInfo;
      setLimitInfo(info);
      return info;
    } catch (error) {
      logger.error('Unexpected rate limit info error:', error);
      return null;
    }
  }, []);

  return {
    checkRateLimit,
    getRateLimitInfo,
    limitInfo,
    checking,
  };
}
