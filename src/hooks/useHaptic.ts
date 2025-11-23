import { useCallback } from 'react';

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

/**
 * Hook for haptic feedback (vibration) on mobile devices
 * Provides consistent vibration patterns across the app
 * Uses the native Vibration API for reliable cross-platform support
 */
export function useHaptic() {
  const triggerHaptic = useCallback((pattern: HapticPattern = 'light') => {
    // Check if vibration is supported
    if (!('vibrate' in navigator)) {
      return;
    }

    // Map pattern types to vibration durations in milliseconds
    const vibrationPatterns: Record<HapticPattern, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 30,
      success: [10, 50, 10],
      warning: [20, 50, 20],
      error: [30, 50, 30, 50, 30],
    };

    const vibrationPattern = vibrationPatterns[pattern];
    
    try {
      navigator.vibrate(vibrationPattern);
    } catch (error) {
      console.warn('[Haptic] Vibration failed:', error);
    }
  }, []);

  return { triggerHaptic };
}
