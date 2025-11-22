import { useCallback, useEffect } from 'react';

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

/**
 * Hook for haptic feedback (vibration) on mobile devices
 * Provides consistent vibration patterns across the app
 *
 * PWA Note: iOS Safari blocks navigator.vibrate() in standalone mode.
 * This hook uses multiple fallback strategies for maximum compatibility.
 */
export function useHaptic() {
  const triggerHaptic = useCallback((pattern: HapticPattern = 'light') => {
    const patterns: Record<HapticPattern, number | number[]> = {
      light: 15,        // Quick tap
      medium: 25,       // Button press
      heavy: 40,        // Important action
      success: [15, 50, 15],   // Success pattern
      warning: [25, 40, 25],   // Warning pattern
      error: [40, 60, 40],     // Error pattern
    };

    const vibrationPattern = patterns[pattern];
    console.log('[Haptic] Attempting vibration:', pattern, vibrationPattern);

    // Strategy 1: Try navigator.vibrate (Android PWA, browsers)
    if (navigator.vibrate) {
      try {
        const result = navigator.vibrate(vibrationPattern);
        console.log('[Haptic] navigator.vibrate result:', result);
        if (result) return; // Success
      } catch (error) {
        console.warn('[Haptic] navigator.vibrate failed:', error);
      }
    }

    // Strategy 2: Try webkit vibration (older iOS)
    if ((navigator as any).webkitVibrate) {
      try {
        (navigator as any).webkitVibrate(vibrationPattern);
        console.log('[Haptic] webkitVibrate called');
        return;
      } catch (error) {
        console.warn('[Haptic] webkitVibrate failed:', error);
      }
    }

    // Strategy 3: Try Haptic Engine API (iOS standalone PWA)
    if ((window as any).webkit?.messageHandlers?.haptic) {
      try {
        (window as any).webkit.messageHandlers.haptic.postMessage({ pattern });
        console.log('[Haptic] iOS Haptic Engine called');
        return;
      } catch (error) {
        console.warn('[Haptic] iOS Haptic Engine failed:', error);
      }
    }

    // Strategy 4: Trigger touch-action via AudioContext (silent audio for haptic)
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Silent audio that triggers haptic on some devices
      gainNode.gain.setValueAtTime(0.00001, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(20, audioContext.currentTime);
      oscillator.start();

      const duration = typeof vibrationPattern === 'number' ? vibrationPattern : vibrationPattern[0];
      oscillator.stop(audioContext.currentTime + duration / 1000);

      console.log('[Haptic] AudioContext haptic triggered');
    } catch (error) {
      console.warn('[Haptic] AudioContext haptic failed:', error);
    }

    console.log('[Haptic] All strategies attempted for pattern:', pattern);
  }, []);

  // Initialize on mount - required for some iOS PWA contexts
  useEffect(() => {
    console.log('[Haptic] Hook initialized');
    console.log('[Haptic] Standalone mode:', (window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches);
    console.log('[Haptic] Vibrate API:', !!navigator.vibrate);
  }, []);

  return { triggerHaptic };
}
