import { useState, useCallback, type ReactNode } from 'react';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

interface RateLimitConfig {
  maxCalls: number;
  windowMs: number;
  actionName: string;
}

interface RateLimitState {
  calls: number;
  windowStart: number;
}

/**
 * Hook for rate limiting admin actions to prevent abuse
 * @param maxCalls Maximum number of calls allowed in the time window
 * @param windowMs Time window in milliseconds
 * @param actionName Name of the action for error messages
 */
export function useAdminRateLimit(
  maxCalls: number,
  windowMs: number,
  actionName: string = 'this action'
) {
  const [state, setState] = useState<RateLimitState>({
    calls: 0,
    windowStart: Date.now(),
  });

  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now();
    const timeSinceStart = now - state.windowStart;

    // Reset window if expired
    if (timeSinceStart >= windowMs) {
      setState({ calls: 1, windowStart: now });
      return true;
    }

    // Check if within limit
    if (state.calls >= maxCalls) {
      const remainingTime = Math.ceil((windowMs - timeSinceStart) / 1000);
      
      toast.error(`Too many requests for ${actionName}`, {
        description: `Please wait ${remainingTime} seconds before trying again`,
      });
      
      return false;
    }

    // Increment counter
    setState(prev => ({ ...prev, calls: prev.calls + 1 }));
    return true;
  }, [state, maxCalls, windowMs, actionName]);

  const getRemainingCalls = useCallback((): number => {
    const now = Date.now();
    const timeSinceStart = now - state.windowStart;

    if (timeSinceStart >= windowMs) {
      return maxCalls;
    }

    return Math.max(0, maxCalls - state.calls);
  }, [state, maxCalls, windowMs]);

  const getRemainingTime = useCallback((): number => {
    const now = Date.now();
    const timeSinceStart = now - state.windowStart;

    if (timeSinceStart >= windowMs || state.calls < maxCalls) {
      return 0;
    }

    return Math.max(0, windowMs - timeSinceStart);
  }, [state, maxCalls, windowMs]);

  const reset = useCallback(() => {
    setState({ calls: 0, windowStart: Date.now() });
  }, []);

  return {
    checkRateLimit,
    getRemainingCalls,
    getRemainingTime,
    reset,
  };
}
