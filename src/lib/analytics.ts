import posthog from 'posthog-js';
import { getEnvVariable } from './env';

const POSTHOG_KEY = getEnvVariable('VITE_POSTHOG_KEY', { optional: true });
const POSTHOG_HOST = getEnvVariable('VITE_POSTHOG_HOST', { optional: true });

/**
 * Initialize Posthog analytics
 * Should be called once when the app starts
 */
export const initAnalytics = () => {
  if (POSTHOG_KEY && POSTHOG_HOST) {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: true,
      capture_pageleave: true,
      loaded: (posthog) => {
        if (import.meta.env.DEV) {
          console.log('[Analytics] Posthog initialized');
        }
      }
    });
  } else {
    console.warn('[Analytics] Posthog not configured - missing environment variables');
  }
};

/**
 * Track a custom event
 * @param eventName - Name of the event to track
 * @param properties - Optional properties to attach to the event
 */
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (posthog.__loaded) {
    posthog.capture(eventName, properties);
  }
};

/**
 * Identify a user with their properties
 * @param userId - Unique user identifier
 * @param properties - User properties (email, name, premium status, etc.)
 */
export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (posthog.__loaded) {
    posthog.identify(userId, properties);
  }
};

/**
 * Reset user identification (call on logout)
 */
export const resetUser = () => {
  if (posthog.__loaded) {
    posthog.reset();
  }
};

export { posthog };
