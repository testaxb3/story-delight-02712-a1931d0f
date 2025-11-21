/**
 * Analytics Integration Layer
 * Provides easy-to-use wrappers for common tracking scenarios
 */

import {
  trackScriptView,
  trackScriptUsed,
  trackScriptFavorited,
  trackVideoWatched,
  trackEbookOpened,
  trackEbookProgress,
  trackBonusViewed,
  trackSearchPerformed,
  trackFilterApplied,
  trackChildProfileCreated,
  trackChildProfileSwitched,
  trackPostCreated,
  trackPostReaction,
  trackCommentAdded,
  trackFeatureDiscovery,
  trackOnboardingStep,
  trackReturnVisit,
  trackUserLogin,
  trackUserLogout,
  identifyUser as identifyUserAdvanced,
} from './analytics-advanced';

import { setUserContext, clearUserContext } from './sentry';

/**
 * Initialize user tracking when they log in
 */
export const initializeUserTracking = (user: {
  id: string;
  email?: string;
  name?: string;
  brainProfile?: string;
  isPremium?: boolean;
  childrenCount?: number;
  signupDate?: string;
}) => {
  // Identify user in analytics
  identifyUserAdvanced(user.id, {
    email: user.email,
    name: user.name,
    brain_profile: user.brainProfile,
    is_premium: user.isPremium,
    children_count: user.childrenCount,
    signup_date: user.signupDate,
  });

  // Set user context in Sentry
  setUserContext({
    id: user.id,
    email: user.email,
    username: user.name,
  });

  // Track login
  trackUserLogin(user.id);

  // Check if returning user
  const lastVisit = localStorage.getItem('last_visit');
  if (lastVisit) {
    const daysSince = Math.floor(
      (Date.now() - parseInt(lastVisit)) / (1000 * 60 * 60 * 24)
    );
    if (daysSince > 0) {
      trackReturnVisit(daysSince);
    }
  }
  localStorage.setItem('last_visit', Date.now().toString());
};

/**
 * Clear user tracking when they log out
 */
export const clearUserTracking = () => {
  trackUserLogout();
  clearUserContext();
};

/**
 * Track script interactions
 */
export const trackScript = {
  view: trackScriptView,
  use: trackScriptUsed,
  favorite: trackScriptFavorited,
};

/**
 * Track video interactions
 */
export const trackVideo = {
  watch: trackVideoWatched,
};

/**
 * Track ebook interactions
 */
export const trackEbook = {
  open: trackEbookOpened,
  progress: trackEbookProgress,
};

/**
 * Track bonus interactions
 */
export const trackBonus = {
  view: trackBonusViewed,
};

/**
 * Track search and filters
 */
export const trackNavigation = {
  search: trackSearchPerformed,
  filter: trackFilterApplied,
};

/**
 * Track child profiles
 */
export const trackChild = {
  create: trackChildProfileCreated,
  switch: trackChildProfileSwitched,
};

/**
 * Track community interactions
 */
export const trackCommunity = {
  post: trackPostCreated,
  react: trackPostReaction,
  comment: trackCommentAdded,
};

/**
 * Track onboarding flow
 */
export const trackOnboarding = {
  step: trackOnboardingStep,
};

/**
 * Track feature discovery
 */
export const trackFeature = {
  discover: trackFeatureDiscovery,
};
