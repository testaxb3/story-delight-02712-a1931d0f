// Push Notifications Manager for PWA
// Handles permission, subscription, and notification scheduling

export interface PushSubscriptionData {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export class NotificationManager {
  private static instance: NotificationManager;

  private constructor() {}

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  /**
   * Check if push notifications are supported
   */
  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  }

  /**
   * Get current permission status
   */
  getPermission(): NotificationPermission {
    return Notification.permission;
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      console.warn('Push notifications not supported');
      return false;
    }

    if (this.getPermission() === 'granted') {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Subscribe to push notifications
   * @param vapidPublicKey - VAPID public key from server
   */
  async subscribe(vapidPublicKey: string): Promise<PushSubscriptionData | null> {
    if (!this.isSupported()) {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey) as BufferSource
      });

      const subscriptionData = subscription.toJSON();

      return {
        endpoint: subscriptionData.endpoint!,
        p256dh: subscriptionData.keys!.p256dh!,
        auth: subscriptionData.keys!.auth!
      };
    } catch (error) {
      console.error('Error subscribing to push:', error);
      return null;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<boolean> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error unsubscribing:', error);
      return false;
    }
  }

  /**
   * Show a local notification (doesn't require subscription)
   */
  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!this.isSupported() || this.getPermission() !== 'granted') {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      await registration.showNotification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        ...options
      } as any);
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  /**
   * Helper: Convert VAPID key to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }
}

// Notification templates
export const NotificationTemplates = {
  dailyMission: (day: number) => ({
    title: '🎯 Daily Mission Available!',
    body: `Day ${day} is ready. Complete today's mission to keep your streak alive!`,
    tag: 'daily-mission',
    requireInteraction: false
  }),

  streakReminder: (streak: number) => ({
    title: '🔥 Keep Your Streak!',
    body: `You're on a ${streak}-day streak! Don't forget to log today.`,
    tag: 'streak-reminder'
  }),

  eveningCheckIn: () => ({
    title: '📊 Evening Check-in',
    body: 'How did today go? Log your progress and reflect.',
    tag: 'evening-checkin'
  }),

  newContent: (contentType: string) => ({
    title: '✨ New Content Available!',
    body: `New ${contentType} added to your library. Check it out!`,
    tag: 'new-content'
  }),

  communityActivity: (activity: string) => ({
    title: '👥 Community Activity',
    body: activity,
    tag: 'community'
  })
};

// Export singleton instance
export const notificationManager = NotificationManager.getInstance();
