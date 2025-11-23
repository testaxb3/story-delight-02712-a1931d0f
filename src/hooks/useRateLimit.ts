import React, { useRef, useCallback } from 'react';

/**
 * Custom hook for implementing rate limiting
 *
 * @param maxCalls - Maximum number of calls allowed within the time window
 * @param timeWindowMs - Time window in milliseconds
 * @returns Object with methods to check and track rate limits
 *
 * @example
 * const postRateLimit = useRateLimit(3, 60000); // 3 calls per minute
 *
 * if (!postRateLimit.canMakeCall()) {
 *   const remainingMs = postRateLimit.getRemainingTime();
 *   toast.error(`Please wait ${Math.ceil(remainingMs / 1000)}s before posting again`);
 *   return;
 * }
 *
 * // Proceed with the action...
 */
export function useRateLimit(maxCalls: number, timeWindowMs: number) {
  const callTimestamps = useRef<number[]>([]);

  /**
   * Checks if a new call can be made based on rate limits
   * If allowed, records the timestamp
   */
  const canMakeCall = useCallback((): boolean => {
    const now = Date.now();
    const windowStart = now - timeWindowMs;

    // Remove timestamps outside the current window
    callTimestamps.current = callTimestamps.current.filter(
      timestamp => timestamp > windowStart
    );

    // Check if we're at the limit
    if (callTimestamps.current.length >= maxCalls) {
      return false;
    }

    // Record this call
    callTimestamps.current.push(now);
    return true;
  }, [maxCalls, timeWindowMs]);

  /**
   * Returns the remaining time in milliseconds until the next call is allowed
   * Returns 0 if a call can be made immediately
   */
  const getRemainingTime = useCallback((): number => {
    const now = Date.now();
    const windowStart = now - timeWindowMs;

    // Remove timestamps outside the current window
    callTimestamps.current = callTimestamps.current.filter(
      timestamp => timestamp > windowStart
    );

    // If under the limit, no wait time
    if (callTimestamps.current.length < maxCalls) {
      return 0;
    }

    // Calculate when the oldest call will expire
    const oldestCall = callTimestamps.current[0];
    const remainingTime = (oldestCall + timeWindowMs) - now;

    return Math.max(0, remainingTime);
  }, [maxCalls, timeWindowMs]);

  /**
   * Returns the number of calls remaining in the current window
   */
  const getRemainingCalls = useCallback((): number => {
    const now = Date.now();
    const windowStart = now - timeWindowMs;

    // Remove timestamps outside the current window
    callTimestamps.current = callTimestamps.current.filter(
      timestamp => timestamp > windowStart
    );

    return Math.max(0, maxCalls - callTimestamps.current.length);
  }, [maxCalls, timeWindowMs]);

  /**
   * Resets the rate limit counter
   */
  const reset = useCallback((): void => {
    callTimestamps.current = [];
  }, []);

  return {
    canMakeCall,
    getRemainingTime,
    getRemainingCalls,
    reset,
  };
}
