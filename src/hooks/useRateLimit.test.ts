import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRateLimit } from './useRateLimit';

describe('useRateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('canMakeCall', () => {
    it('should allow calls up to the limit', () => {
      const { result } = renderHook(() => useRateLimit(3, 60000));

      // First 3 calls should be allowed
      expect(result.current.canMakeCall()).toBe(true);
      expect(result.current.canMakeCall()).toBe(true);
      expect(result.current.canMakeCall()).toBe(true);
      
      // 4th call should be blocked
      expect(result.current.canMakeCall()).toBe(false);
    });

    it('should reset after time window expires', () => {
      const { result } = renderHook(() => useRateLimit(2, 1000)); // 2 calls per second

      // Use up the limit
      act(() => {
        result.current.canMakeCall();
        result.current.canMakeCall();
      });

      expect(result.current.canMakeCall()).toBe(false);

      // Advance time past the window
      act(() => {
        vi.advanceTimersByTime(1001);
      });

      // Should be able to call again
      expect(result.current.canMakeCall()).toBe(true);
    });

    it('should handle multiple windows correctly', () => {
      const { result } = renderHook(() => useRateLimit(2, 1000));

      // First window
      act(() => {
        result.current.canMakeCall(); // Call 1
        vi.advanceTimersByTime(500);
        result.current.canMakeCall(); // Call 2
      });

      expect(result.current.canMakeCall()).toBe(false);

      // Advance to expire first call
      act(() => {
        vi.advanceTimersByTime(501);
      });

      // Should allow one more call (first call expired)
      expect(result.current.canMakeCall()).toBe(true);
      expect(result.current.canMakeCall()).toBe(false);
    });
  });

  describe('getRemainingTime', () => {
    it('should return 0 when calls are available', () => {
      const { result } = renderHook(() => useRateLimit(3, 60000));

      expect(result.current.getRemainingTime()).toBe(0);
    });

    it('should return correct remaining time when at limit', () => {
      const { result } = renderHook(() => useRateLimit(2, 5000));

      act(() => {
        result.current.canMakeCall();
        result.current.canMakeCall();
      });

      const remaining = result.current.getRemainingTime();
      expect(remaining).toBeGreaterThan(0);
      expect(remaining).toBeLessThanOrEqual(5000);
    });

    it('should decrease over time', () => {
      const { result } = renderHook(() => useRateLimit(1, 5000));

      act(() => {
        result.current.canMakeCall();
      });

      const initial = result.current.getRemainingTime();
      
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      const after = result.current.getRemainingTime();
      expect(after).toBeLessThan(initial);
    });
  });

  describe('getRemainingCalls', () => {
    it('should return max calls initially', () => {
      const { result } = renderHook(() => useRateLimit(5, 60000));

      expect(result.current.getRemainingCalls()).toBe(5);
    });

    it('should decrease with each call', () => {
      const { result } = renderHook(() => useRateLimit(3, 60000));

      expect(result.current.getRemainingCalls()).toBe(3);
      
      act(() => {
        result.current.canMakeCall();
      });
      
      expect(result.current.getRemainingCalls()).toBe(2);
      
      act(() => {
        result.current.canMakeCall();
      });
      
      expect(result.current.getRemainingCalls()).toBe(1);
    });

    it('should return 0 when at limit', () => {
      const { result } = renderHook(() => useRateLimit(2, 60000));

      act(() => {
        result.current.canMakeCall();
        result.current.canMakeCall();
      });

      expect(result.current.getRemainingCalls()).toBe(0);
    });
  });

  describe('reset', () => {
    it('should reset the rate limit counter', () => {
      const { result } = renderHook(() => useRateLimit(2, 60000));

      // Use up the limit
      act(() => {
        result.current.canMakeCall();
        result.current.canMakeCall();
      });

      expect(result.current.canMakeCall()).toBe(false);

      // Reset
      act(() => {
        result.current.reset();
      });

      // Should be able to call again
      expect(result.current.canMakeCall()).toBe(true);
      expect(result.current.getRemainingCalls()).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('should handle zero max calls', () => {
      const { result } = renderHook(() => useRateLimit(0, 60000));

      expect(result.current.canMakeCall()).toBe(false);
      expect(result.current.getRemainingCalls()).toBe(0);
    });

    it('should handle very short time windows', () => {
      const { result } = renderHook(() => useRateLimit(2, 10)); // 10ms window

      act(() => {
        result.current.canMakeCall();
        result.current.canMakeCall();
      });

      expect(result.current.canMakeCall()).toBe(false);

      act(() => {
        vi.advanceTimersByTime(11);
      });

      expect(result.current.canMakeCall()).toBe(true);
    });

    it('should handle very large time windows', () => {
      const { result } = renderHook(() => useRateLimit(2, 3600000)); // 1 hour

      act(() => {
        result.current.canMakeCall();
      });

      expect(result.current.getRemainingCalls()).toBe(1);

      act(() => {
        vi.advanceTimersByTime(1800000); // 30 minutes
      });

      // Should still be in the window
      expect(result.current.getRemainingCalls()).toBe(1);
    });
  });
});
