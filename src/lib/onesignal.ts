import OneSignal from 'react-onesignal';

/**
 * OneSignal Push Notifications Integration
 *
 * This module handles OneSignal initialization and notification management.
 *
 * Setup:
 * 1. Get your OneSignal App ID from https://onesignal.com
 * 2. Add to .env: VITE_ONESIGNAL_APP_ID=your-app-id-here
 * 3. Initialize OneSignal when app starts
 *
 * Features:
 * - Automatic user subscription
 * - Send notifications from Admin panel
 * - Segment users by device, location, etc.
 * - Analytics and delivery tracking
 */

let initialized = false;

/**
 * Initialize OneSignal
 * Should be called once when the app starts
 */
export async function initOneSignal() {
  const appId = import.meta.env.VITE_ONESIGNAL_APP_ID;

  if (!appId) {
    console.warn('[OneSignal] App ID not configured. Push notifications disabled.');
    console.warn('[OneSignal] Add VITE_ONESIGNAL_APP_ID to .env to enable.');
    return false;
  }

  if (initialized) {
    console.log('[OneSignal] Already initialized');
    return true;
  }

  try {
    console.log('[OneSignal] Starting initialization...');
    console.log('[OneSignal] App ID:', appId);

    await OneSignal.init({
      appId: appId,
      allowLocalhostAsSecureOrigin: true, // For development

      // Service Worker Configuration
      // These files are in /public and will be served from the root
      serviceWorkerPath: 'OneSignalSDKWorker.js',
      serviceWorkerParam: { scope: '/' },

      notifyButton: {
        enable: false, // We use our own UI
      },
      welcomeNotification: {
        title: 'Welcome to NEP System! 🧠',
        message: "You'll now receive helpful reminders and updates.",
      },
      // Auto-register when permission is granted
      // But don't auto-prompt (user must click to enable)
      autoRegister: true,
      autoResubscribe: true,
      // Disable auto-prompt - user controls this via NotificationSettings
      promptOptions: {
        autoPrompt: false,
      },
    });

    initialized = true;
    console.log('[OneSignal] Initialized successfully');
    console.log('[OneSignal] Waiting for user to enable notifications...');

    // Check if Service Worker was registered
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        console.log('[OneSignal] Service Worker registrations:', registrations.length);
        registrations.forEach(reg => {
          console.log('[OneSignal] SW Scope:', reg.scope);
          console.log('[OneSignal] SW Active:', !!reg.active);
        });
      } catch (swError) {
        console.warn('[OneSignal] Could not check Service Worker registrations:', swError);
      }
    }

    return true;
  } catch (error) {
    console.error('[OneSignal] Initialization failed:', error);
    return false;
  }
}

/**
 * Check if OneSignal is initialized
 */
export function isOneSignalInitialized(): boolean {
  return initialized;
}

/**
 * Get the current user's OneSignal Player ID
 * This ID is used to target specific users for notifications
 */
export async function getPlayerId(): Promise<string | null> {
  if (!initialized) {
    console.warn('[OneSignal] Not initialized. Call initOneSignal() first.');
    return null;
  }

  try {
    // Use the new Web SDK v16 API
    // Access the window.OneSignal object directly for the new API
    if (typeof window !== 'undefined' && (window as any).OneSignal) {
      const pushSubscription = (window as any).OneSignal.User?.PushSubscription;

      if (pushSubscription) {
        // Try the async method first
        if (typeof pushSubscription.getIdAsync === 'function') {
          const playerId = await pushSubscription.getIdAsync();
          return playerId;
        }

        // Fallback to synchronous property
        if (pushSubscription.id) {
          return pushSubscription.id;
        }
      }
    }

    // Fallback to old API if new API not available
    if (typeof OneSignal.getUserId === 'function') {
      const playerId = await OneSignal.getUserId();
      return playerId;
    }

    console.warn('[OneSignal] No method available to get player ID');
    return null;
  } catch (error) {
    console.error('[OneSignal] Failed to get player ID:', error);
    return null;
  }
}

/**
 * Check if user has granted notification permission
 */
export async function isSubscribed(): Promise<boolean> {
  if (!initialized) return false;

  try {
    // Use the new Web SDK v16 API
    // Access the window.OneSignal object directly for the new API
    if (typeof window !== 'undefined' && (window as any).OneSignal) {
      const pushSubscription = (window as any).OneSignal.User?.PushSubscription;

      if (pushSubscription) {
        // Try the async method first
        if (typeof pushSubscription.getOptedInAsync === 'function') {
          const optedIn = await pushSubscription.getOptedInAsync();
          return optedIn === true;
        }

        // Fallback to synchronous property
        if (typeof pushSubscription.optedIn !== 'undefined') {
          return pushSubscription.optedIn === true;
        }
      }
    }

    // Fallback to old API if new API not available
    if (typeof OneSignal.isPushNotificationsEnabled === 'function') {
      const isSubscribed = await OneSignal.isPushNotificationsEnabled();
      return isSubscribed;
    }

    console.warn('[OneSignal] No method available to check subscription');
    return false;
  } catch (error) {
    console.error('[OneSignal] Failed to check subscription:', error);
    return false;
  }
}

/**
 * Show the native notification permission prompt
 * Uses browser's native Notification API instead of OneSignal's deprecated method
 */
export async function showPermissionPrompt(): Promise<boolean> {
  if (!initialized) {
    console.warn('[OneSignal] Not initialized. Call initOneSignal() first.');
    return false;
  }

  try {
    // Use browser's native Notification API to request permission
    if (!('Notification' in window)) {
      console.error('[OneSignal] Notifications not supported');
      return false;
    }

    // Request permission using native API
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      console.log('[OneSignal] Permission granted');

      // Register for push with OneSignal
      try {
        await OneSignal.registerForPushNotifications();
      } catch (error) {
        console.error('[OneSignal] Failed to register for push:', error);
      }

      return true;
    } else {
      console.log('[OneSignal] Permission denied');
      return false;
    }
  } catch (error) {
    console.error('[OneSignal] Failed to show prompt:', error);
    return false;
  }
}

/**
 * Set user tags for segmentation
 * Example: { brain_type: 'INTENSE', premium: 'true' }
 */
export async function setUserTags(tags: Record<string, string>): Promise<void> {
  if (!initialized) {
    console.warn('[OneSignal] Not initialized. Call initOneSignal() first.');
    return;
  }

  try {
    await OneSignal.sendTags(tags);
    console.log('[OneSignal] User tags set:', tags);
  } catch (error) {
    console.error('[OneSignal] Failed to set tags:', error);
  }
}

/**
 * Set external user ID (e.g., your database user ID)
 * This helps link OneSignal users with your database
 */
export async function setExternalUserId(userId: string): Promise<void> {
  if (!initialized) {
    console.warn('[OneSignal] Not initialized. Call initOneSignal() first.');
    return;
  }

  try {
    await OneSignal.setExternalUserId(userId);
    console.log('[OneSignal] External user ID set:', userId);
  } catch (error) {
    console.error('[OneSignal] Failed to set external user ID:', error);
  }
}

/**
 * Send a notification to all users via OneSignal REST API
 * This is called from the Admin panel
 *
 * Note: Requires OneSignal REST API Key
 * Add to .env: VITE_ONESIGNAL_REST_API_KEY=your-rest-api-key
 */
export async function sendNotificationToAll(
  title: string,
  message: string
): Promise<{ success: boolean; error?: string; id?: string; errors?: string[] }> {
  console.log('[OneSignal] sendNotificationToAll called');
  console.log('[OneSignal] Title:', title);
  console.log('[OneSignal] Message:', message);

  const appId = import.meta.env.VITE_ONESIGNAL_APP_ID;
  const restApiKey = import.meta.env.VITE_ONESIGNAL_REST_API_KEY;

  console.log('[OneSignal] App ID configured:', !!appId);
  console.log('[OneSignal] REST API Key configured:', !!restApiKey);

  if (appId) {
    console.log('[OneSignal] App ID length:', appId.length);
    console.log('[OneSignal] App ID preview:', appId.substring(0, 8) + '...');
  }

  if (restApiKey) {
    console.log('[OneSignal] REST API Key length:', restApiKey.length);
    console.log('[OneSignal] REST API Key preview:', restApiKey.substring(0, 8) + '...');
  }

  if (!appId || !restApiKey) {
    const error = 'OneSignal credentials not configured. Add VITE_ONESIGNAL_APP_ID and VITE_ONESIGNAL_REST_API_KEY to .env';
    console.error('[OneSignal]', error);
    return {
      success: false,
      error,
    };
  }

  try {
    const payload = {
      app_id: appId,
      included_segments: ['Subscribed Users'], // Send to all subscribed users
      headings: { en: title },
      contents: { en: message },
      data: {
        type: 'admin_broadcast',
      },
    };

    console.log('[OneSignal] Request payload:', JSON.stringify(payload, null, 2));

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    console.log('[OneSignal] Response status:', response.status);
    console.log('[OneSignal] Response statusText:', response.statusText);

    const data = await response.json();
    console.log('[OneSignal] Response data:', data);

    if (!response.ok) {
      const errorMessage = data.errors?.[0] || data.error || `HTTP ${response.status}: ${response.statusText}`;
      console.error('[OneSignal] API Error:', errorMessage);
      console.error('[OneSignal] Full error data:', data);

      return {
        success: false,
        error: errorMessage,
        errors: data.errors,
      };
    }

    console.log('[OneSignal] Notification sent successfully!');
    console.log('[OneSignal] Notification ID:', data.id);
    console.log('[OneSignal] Recipients:', data.recipients);

    return {
      success: true,
      id: data.id,
    };
  } catch (error: any) {
    console.error('[OneSignal] Exception while sending notification:', error);
    console.error('[OneSignal] Error stack:', error.stack);
    return {
      success: false,
      error: error.message || 'Failed to send notification',
    };
  }
}

/**
 * Send a notification to specific users by player IDs
 */
export async function sendNotificationToUsers(
  playerIds: string[],
  title: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  const appId = import.meta.env.VITE_ONESIGNAL_APP_ID;
  const restApiKey = import.meta.env.VITE_ONESIGNAL_REST_API_KEY;

  if (!appId || !restApiKey) {
    return {
      success: false,
      error: 'OneSignal credentials not configured',
    };
  }

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restApiKey}`,
      },
      body: JSON.stringify({
        app_id: appId,
        include_player_ids: playerIds,
        headings: { en: title },
        contents: { en: message },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0] || 'Failed to send notification');
    }

    const data = await response.json();
    console.log('[OneSignal] Notification sent to users:', data);

    return { success: true };
  } catch (error: any) {
    console.error('[OneSignal] Failed to send notification:', error);
    return {
      success: false,
      error: error.message || 'Failed to send notification',
    };
  }
}

/**
 * Get notification statistics
 */
export async function getNotificationStats(
  notificationId: string
): Promise<any> {
  const appId = import.meta.env.VITE_ONESIGNAL_APP_ID;
  const restApiKey = import.meta.env.VITE_ONESIGNAL_REST_API_KEY;

  if (!appId || !restApiKey) {
    throw new Error('OneSignal credentials not configured');
  }

  try {
    const response = await fetch(
      `https://onesignal.com/api/v1/notifications/${notificationId}?app_id=${appId}`,
      {
        headers: {
          'Authorization': `Basic ${restApiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get notification stats');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[OneSignal] Failed to get notification stats:', error);
    throw error;
  }
}
