/**
 * Platform detection utilities for PWA updates
 * iOS/Safari requires different update strategies than Chrome/Android
 */

export interface PlatformInfo {
  isIOS: boolean;
  isSafari: boolean;
  isStandalone: boolean; // PWA mode
  requiresHardReload: boolean;
  browserName: string;
}

/**
 * Detects if the current device is iOS (iPhone/iPad)
 */
export function isIOSDevice(): boolean {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  // Check for iOS devices
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;

  // iOS 13+ on iPad may identify as Mac, so check for touch support
  const isIPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

  return isIOS || isIPadOS;
}

/**
 * Detects if the current browser is Safari
 */
export function isSafariBrowser(): boolean {
  const userAgent = navigator.userAgent;
  const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
  return isSafari;
}

/**
 * Detects if the app is running in standalone mode (installed PWA)
 */
export function isStandaloneMode(): boolean {
  // Check if running in standalone mode
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  // iOS specific check
  const isIOSStandalone = (window.navigator as any).standalone === true;

  return isStandalone || isIOSStandalone;
}

/**
 * Gets comprehensive platform information
 */
export function getPlatformInfo(): PlatformInfo {
  const isIOS = isIOSDevice();
  const isSafari = isSafariBrowser();
  const isStandalone = isStandaloneMode();

  // iOS PWAs require hard reload because Service Worker support is limited
  const requiresHardReload = isIOS || (isSafari && isStandalone);

  // Detect browser name
  let browserName = 'Unknown';
  const userAgent = navigator.userAgent;

  if (isIOS) {
    browserName = isStandalone ? 'iOS PWA' : 'iOS Safari';
  } else if (/chrome|chromium|crios/i.test(userAgent)) {
    browserName = 'Chrome';
  } else if (/firefox|fxios/i.test(userAgent)) {
    browserName = 'Firefox';
  } else if (/safari/i.test(userAgent)) {
    browserName = 'Safari';
  } else if (/edg/i.test(userAgent)) {
    browserName = 'Edge';
  }

  return {
    isIOS,
    isSafari,
    isStandalone,
    requiresHardReload,
    browserName,
  };
}

/**
 * Performs platform-appropriate app update
 * iOS requires hard reload with cache busting, others can use Service Worker
 */
export async function performPlatformUpdate(): Promise<void> {
  const platform = getPlatformInfo();

  if (platform.requiresHardReload) {
    // iOS/Safari: Hard reload with cache busting
    await performIOSUpdate();
  } else {
    // Chrome/Android: Use Service Worker update
    await performServiceWorkerUpdate();
  }
}

/**
 * iOS-specific update: Hard reload with cache clearing
 */
async function performIOSUpdate(): Promise<void> {
  try {
    console.log('🍎 Starting iOS update process...');

    // 1. Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('✅ All caches cleared for iOS update');
    }

    // 2. Unregister all service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => registration.unregister())
      );
      console.log('✅ Service workers unregistered for iOS update');
    }

    // 3. Clear localStorage session markers (keep user data)
    localStorage.removeItem('app_session_start');

    // 4. Add a flag to prevent immediate re-check after reload
    sessionStorage.setItem('pwa_just_updated', 'true');

    // 5. Hard reload without modifying URL (prevents 404 errors)
    console.log('🔄 Reloading app with fresh cache...');

    // After clearing all caches and unregistering SW,
    // a simple reload will fetch fresh content from network
    // We use a small delay to ensure all cache operations complete
    setTimeout(() => {
      window.location.reload();
    }, 100);

  } catch (error) {
    console.error('❌ Error during iOS update:', error);
    // Fallback: simple reload
    window.location.reload();
  }
}

/**
 * Service Worker based update for Chrome/Android
 */
async function performServiceWorkerUpdate(): Promise<void> {
  const updateSW = (window as any).__updateSW;

  if (updateSW) {
    try {
      // This triggers skipWaiting and controllerchange
      await updateSW(true);
      console.log('✅ Service Worker updated successfully');
    } catch (error) {
      console.error('Error updating Service Worker:', error);
      // Fallback: reload
      window.location.reload();
    }
  } else {
    // No updateSW available, do hard reload
    console.warn('⚠️ __updateSW not available, falling back to reload');

    // Try to clear caches first
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }

    window.location.reload();
  }
}

/**
 * Logs platform information for debugging
 */
export function logPlatformInfo(): void {
  const info = getPlatformInfo();
  console.log('🔍 Platform Detection:', {
    isIOS: info.isIOS,
    isSafari: info.isSafari,
    isStandalone: info.isStandalone,
    requiresHardReload: info.requiresHardReload,
    browserName: info.browserName,
    userAgent: navigator.userAgent,
  });
}
