import { useCallback } from 'react';
import { useHaptic as useHapticBase } from 'use-haptic';

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

/**
 * Hook for haptic feedback (vibration) on mobile devices
 * Provides consistent vibration patterns across the app
 * 
 * Uses the 'use-haptic' package which leverages the input[switch] element
 * introduced in Safari 18.0 for iOS haptic feedback, with fallback to
 * Vibration API for Android and other devices.
 */
export function useHaptic() {
  // Light duration for quick, subtle feedback
  const { triggerHaptic: triggerLight } = useHapticBase(5);
  // Medium duration for normal feedback
  const { triggerHaptic: triggerMedium } = useHapticBase(10);
  // Heavy duration for strong feedback
  const { triggerHaptic: triggerHeavy } = useHapticBase(20);

  const triggerHaptic = useCallback((pattern: HapticPattern = 'light') => {
    // Map pattern types to appropriate haptic triggers
    switch (pattern) {
      case 'light':
        triggerLight();
        break;
      case 'medium':
        triggerMedium();
        break;
      case 'heavy':
        triggerHeavy();
        break;
      case 'success':
        // Double tap for success
        triggerLight();
        setTimeout(() => triggerLight(), 100);
        break;
      case 'warning':
        // Medium double tap for warning
        triggerMedium();
        setTimeout(() => triggerMedium(), 100);
        break;
      case 'error':
        // Triple heavy tap for error
        triggerHeavy();
        setTimeout(() => triggerHeavy(), 100);
        setTimeout(() => triggerHeavy(), 200);
        break;
    }
  }, [triggerLight, triggerMedium, triggerHeavy]);

  return { triggerHaptic };
}
