import { useCallback, useEffect } from 'react';
import { useHaptic as useHapticBase } from 'use-haptic';

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

/**
 * Hook for haptic feedback (vibration) on mobile devices
 * Provides consistent vibration patterns across the app
 *
 * Now uses the 'use-haptic' package which leverages the native input[switch]
 * element introduced in Safari 18.0 for reliable haptic feedback on iOS.
 */
export function useHaptic() {
  const { triggerHaptic: triggerHapticBase } = useHapticBase();

  const triggerHaptic = useCallback((pattern: HapticPattern = 'light') => {
    console.log('[Haptic] Triggering vibration:', pattern);

    // Map our pattern types to the number of times to trigger haptic
    // The use-haptic package provides a single tap, so we trigger multiple times for complex patterns
    const triggerCounts: Record<HapticPattern, number> = {
      light: 1,        // Single quick tap
      medium: 1,       // Single medium tap
      heavy: 1,        // Single heavy tap
      success: 2,      // Double tap for success
      warning: 2,      // Double tap for warning
      error: 3,        // Triple tap for error
    };

    const count = triggerCounts[pattern];

    // Trigger haptic feedback the specified number of times
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        triggerHapticBase();
      }, i * 100); // 100ms delay between taps for patterns
    }

    console.log('[Haptic] Haptic feedback triggered:', pattern, `${count}x`);
  }, [triggerHapticBase]);

  // Initialize on mount
  useEffect(() => {
    console.log('[Haptic] Hook initialized with use-haptic package');
    console.log('[Haptic] Standalone mode:', (window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  return { triggerHaptic };
}
