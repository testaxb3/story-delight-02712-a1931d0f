import { useCallback } from 'react';
import { useHaptic as useHapticBase } from 'use-haptic';

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

/**
 * Hook for haptic feedback (vibration) on mobile devices
 * Uses the 'use-haptic' package which works on Safari 18+ via input[switch]
 *
 * Based on: https://github.com/posaune0423/use-haptic
 */
export function useHaptic() {
  const { triggerHaptic: triggerHapticBase } = useHapticBase();

  const triggerHaptic = useCallback((pattern: HapticPattern = 'light') => {
    // Map patterns to number of taps
    // The use-haptic provides a single native tap, we trigger multiple times for patterns
    const tapCounts: Record<HapticPattern, number> = {
      light: 1,
      medium: 1,
      heavy: 1,
      success: 2,
      warning: 2,
      error: 3,
    };

    const count = tapCounts[pattern];

    // Trigger the haptic feedback
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        triggerHapticBase();
      }, i * 100);
    }
  }, [triggerHapticBase]);

  return { triggerHaptic };
}
