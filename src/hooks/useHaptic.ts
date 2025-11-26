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
 * Based on the use-haptic library: https://github.com/posaune0423/use-haptic
 */
export function useHaptic() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const labelRef = useRef<HTMLLabelElement | null>(null);
  const isIOS = useMemo(() => detectiOS(), []);

  useEffect(() => {
    // Create and append input element
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = `haptic-switch-${Math.random().toString(36).substr(2, 9)}`;
    input.setAttribute("switch", "");
    input.style.display = "none";
    document.body.appendChild(input);
    inputRef.current = input;

    // Create and append label element
    const label = document.createElement("label");
    label.htmlFor = input.id;
    label.style.display = "none";
    document.body.appendChild(label);
    labelRef.current = label;

    // Cleanup function
    return () => {
      if (input.parentNode) {
        document.body.removeChild(input);
      }
      if (label.parentNode) {
        document.body.removeChild(label);
      }
    };
  }, []);

  const triggerHaptic = useCallback((pattern: HapticPattern = 'light') => {
    // Map pattern types to vibration durations in milliseconds
    const vibrationPatterns: Record<HapticPattern, number | number[]> = {
      light: 25,
      medium: 50,
      heavy: 75,
      success: [25, 50, 25],
      warning: [50, 50, 50],
      error: [75, 50, 75, 50, 75],
    };

    const vibrationPattern = vibrationPatterns[pattern];

    try {
      // Try navigator.vibrate first (works on Android)
      if (!isIOS && navigator?.vibrate) {
        navigator.vibrate(vibrationPattern);
        return;
      }

      // iOS: Use input[switch] method
      if (isIOS && labelRef.current) {
        if (Array.isArray(vibrationPattern)) {
          vibrationPattern.forEach((duration, index) => {
            if (duration > 0) {
              setTimeout(() => {
                labelRef.current?.click();
              }, index * 100);
            }
          });
        } else {
          labelRef.current.click();
        }
      }
    } catch (error) {
      // Silently fail
    }
  }, [isIOS]);

  return { triggerHaptic };
}
