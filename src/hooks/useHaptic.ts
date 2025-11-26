import { useCallback, useEffect, useMemo, useRef } from 'react';

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

/**
 * Detects if the current device is running iOS
 */
const detectiOS = (): boolean => {
  if (typeof navigator === "undefined") {
    return false;
  }

  const toMatch = [/iPhone/i, /iPad/i, /iPod/i];

  return toMatch.some((toMatchItem) => {
    return RegExp(toMatchItem).exec(navigator.userAgent);
  });
};

/**
 * Hook for haptic feedback (vibration) on mobile devices
 * Provides consistent vibration patterns across the app
 *
 * - iOS: Uses input[switch] element for native haptic feedback (Safari 18.0+)
 * - Android/Others: Uses the native Vibration API
 *
 * This implementation is compatible with iOS PWAs!
 */
export function useHaptic() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const labelRef = useRef<HTMLLabelElement | null>(null);
  const isIOS = useMemo(() => detectiOS(), []);

  // Create hidden input[switch] for iOS haptic feedback
  useEffect(() => {

    // Create and append input element
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = "haptic-switch";
    input.setAttribute("switch", "");
    input.style.display = "none";
    document.body.appendChild(input);
    inputRef.current = input;

    // Create and append label element
    const label = document.createElement("label");
    label.htmlFor = "haptic-switch";
    label.style.display = "none";
    document.body.appendChild(label);
    labelRef.current = label;

    // Cleanup function
    return () => {
      if (input.parentNode) document.body.removeChild(input);
      if (label.parentNode) document.body.removeChild(label);
    };
  }, [isIOS]);

  const triggerHaptic = useCallback((pattern: HapticPattern = 'light') => {
    // Map pattern types to vibration durations in milliseconds
    // Intensidade aumentada para vibração mais forte
    const vibrationPatterns: Record<HapticPattern, number | number[]> = {
      light: 25,  // Aumentado de 10 para 25
      medium: 50, // Aumentado de 20 para 50
      heavy: 75,  // Aumentado de 30 para 75
      success: [25, 50, 25], // Aumentado de [10, 50, 10]
      warning: [50, 50, 50], // Aumentado de [20, 50, 20]
      error: [75, 50, 75, 50, 75], // Aumentado de [30, 50, 30, 50, 30]
    };

    const vibrationPattern = vibrationPatterns[pattern];

    try {
      if (isIOS) {
        // iOS: Use input[switch] for haptic feedback
        // Trigger multiple times for pattern-based feedback
        if (Array.isArray(vibrationPattern)) {
          // For pattern arrays, trigger haptic for each duration
          vibrationPattern.forEach((duration, index) => {
            if (duration > 0) {
              setTimeout(() => {
                labelRef.current?.click();
              }, index * 100);
            }
          });
        } else {
          // For single duration, trigger once
          labelRef.current?.click();
        }
      } else {
        // Android/Others: Use Vibration API
        if ('vibrate' in navigator) {
          navigator.vibrate(vibrationPattern);
        }
      }
    } catch (error) {
      console.warn('[Haptic] Vibration failed:', error);
    }
  }, [isIOS]);

  return { triggerHaptic };
}
