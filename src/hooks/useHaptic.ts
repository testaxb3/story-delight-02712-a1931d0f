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
  // Single hook instance with light duration (5ms) as base
  const { triggerHaptic: triggerBase } = useHapticBase(5);

  const triggerHaptic = useCallback((pattern: HapticPattern = 'light') => {
    // Map pattern types to appropriate haptic triggers
    switch (pattern) {
      case 'light':
        triggerBase();
        break;
      case 'medium':
        triggerBase();
        setTimeout(() => triggerBase(), 10);
        break;
      case 'heavy':
        triggerBase();
        setTimeout(() => triggerBase(), 10);
        setTimeout(() => triggerBase(), 20);
        break;
      case 'success':
        // Double tap for success
        triggerBase();
        setTimeout(() => triggerBase(), 100);
        break;
      case 'warning':
        // Medium-heavy double tap for warning
        triggerBase();
        setTimeout(() => triggerBase(), 10);
        setTimeout(() => triggerBase(), 120);
        setTimeout(() => triggerBase(), 130);
        break;
      case 'error':
        // Triple heavy tap for error
        triggerBase();
        setTimeout(() => triggerBase(), 10);
        setTimeout(() => triggerBase(), 20);
        setTimeout(() => triggerBase(), 150);
        setTimeout(() => triggerBase(), 160);
        setTimeout(() => triggerBase(), 170);
        break;
    }
  }, [triggerBase]);

  return { triggerHaptic };
}
