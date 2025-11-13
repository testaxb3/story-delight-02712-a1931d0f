/**
 * Browser Extension API Polyfill for PWA
 * Version: 2.2
 *
 * This script prevents errors from browser extensions trying to use
 * the 'browser' API in PWA context where extensions don't work properly.
 *
 * Common extensions that inject scripts: Google Translate, ad blockers,
 * password managers, etc. These scripts may fail in PWA standalone mode.
 *
 * Also suppresses YouTube iframe errors, CSP violations, Workbox errors,
 * and OneSignal Service Worker errors.
 */

(function() {
  'use strict';

  // Only run in browser environment
  if (typeof window === 'undefined') return;

  console.log('[PWA Polyfill] Loading v2.2 - Extension compatibility and error suppression');

  // Check if we're in PWA standalone mode
  const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                window.navigator.standalone === true ||
                document.referrer.includes('android-app://');

  if (isPWA) {
    console.log('[PWA] Running in standalone mode - applying extension compatibility fixes');
  }

  // Create a minimal browser API stub to prevent errors from extensions
  // This won't make extensions work, but will prevent crashes
  if (typeof browser === 'undefined') {
    window.browser = {
      runtime: {
        sendMessage: function() {
          console.warn('[PWA] Extension API called but not available in PWA mode');
          return Promise.resolve(null);
        },
        onMessage: {
          addListener: function() {},
          removeListener: function() {},
          hasListener: function() { return false; }
        },
        getManifest: function() { return {}; },
        getURL: function(path) { return path; }
      },
      storage: {
        local: {
          get: function() { return Promise.resolve({}); },
          set: function() { return Promise.resolve(); },
          remove: function() { return Promise.resolve(); }
        },
        sync: {
          get: function() { return Promise.resolve({}); },
          set: function() { return Promise.resolve(); },
          remove: function() { return Promise.resolve(); }
        }
      },
      tabs: {
        query: function() { return Promise.resolve([]); },
        sendMessage: function() { return Promise.resolve(null); }
      }
    };
  }

  // Also create chrome.runtime stub if needed (some extensions use chrome.runtime)
  if (typeof chrome !== 'undefined' && !chrome.runtime) {
    chrome.runtime = {
      sendMessage: function() {
        console.warn('[PWA] Chrome extension API called but not available in PWA mode');
        return Promise.resolve(null);
      },
      onMessage: {
        addListener: function() {},
        removeListener: function() {},
        hasListener: function() { return false; }
      },
      getManifest: function() { return {}; },
      getURL: function(path) { return path; },
      lastError: null
    };
  }

  // Suppress common extension-related console errors and warnings
  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = function(...args) {
    const message = args.join(' ');

    // Filter out ONLY extension errors - NOT CSP or network errors that might be important
    if (
      message.includes('browser is not defined') ||
      message.includes('chrome.runtime') ||
      message.includes('message port closed') ||
      message.includes('myContent.js') ||
      message.includes('pagehelper.js') ||
      message.includes('Extension context invalidated')
    ) {
      // Suppress extension errors only
      console.debug('[PWA] Suppressed extension error');
      return;
    }

    // Let other errors through - they might be important!
    // Log CSP/network errors but don't suppress them completely
    if (
      message.includes('Refused to load') ||
      message.includes('Refused to connect') ||
      message.includes('Content Security Policy') ||
      message.includes('violates the following')
    ) {
      console.warn('[PWA] CSP/Network error (not suppressed):', message.substring(0, 100));
    }

    // Call original console.error for all non-extension errors
    originalError.apply(console, args);
  };

  console.warn = function(...args) {
    const message = args.join(' ');

    // Filter out permissions policy violations, CSP warnings, and OneSignal SW errors
    if (
      message.includes('Permissions policy violation') ||
      message.includes('accelerometer is not allowed') ||
      message.includes('gyroscope is not allowed') ||
      message.includes('FetchEvent') ||
      message.includes('network error response') ||
      message.includes('Could not get ServiceWorkerRegistration') ||
      message.includes('[Worker Messenger]') ||
      message.includes('[Page -> SW]')
    ) {
      // These are harmless warnings, suppress them
      console.debug('[PWA] Suppressed warning:', message.substring(0, 80));
      return;
    }

    // Call original console.warn for other warnings
    originalWarn.apply(console, args);
  };

  // Handle unhandled promise rejections from extensions
  window.addEventListener('unhandledrejection', function(event) {
    const reason = event.reason?.message || event.reason;

    if (reason && (
      reason.includes('browser is not defined') ||
      reason.includes('chrome.runtime') ||
      reason.includes('message port closed')
    )) {
      console.warn('[PWA] Suppressed extension promise rejection:', reason);
      event.preventDefault();
    }
  });

  // Handle runtime errors from injected extension scripts
  window.addEventListener('error', function(event) {
    const message = event.message || '';
    const filename = event.filename || '';

    if (
      message.includes('browser is not defined') ||
      message.includes('chrome.runtime') ||
      filename.includes('myContent.js') ||
      filename.includes('pagehelper.js') ||
      filename.includes('extension')
    ) {
      console.warn('[PWA] Suppressed extension script error:', message, 'from', filename);
      event.preventDefault();
      return true;
    }
  }, true);

  console.log('[PWA] Browser extension compatibility layer loaded');
})();
