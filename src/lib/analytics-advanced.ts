import { trackEvent, identifyUser as identifyUserBase } from './analytics';
import { captureException, addBreadcrumb } from './sentry';

/**
 * Advanced Analytics System
 * Combines Posthog analytics with Sentry error tracking
 * Provides comprehensive user behavior and error monitoring
 */

// ============================================
// USER LIFECYCLE EVENTS
// ============================================

export const trackUserSignup = (userId: string, method: 'email' | 'google') => {
  trackEvent('user_signup', {
    method,
    timestamp: new Date().toISOString(),
  });
  addBreadcrumb('User signed up', { userId, method });
};

export const trackUserLogin = (userId: string) => {
  trackEvent('user_login', {
    timestamp: new Date().toISOString(),
  });
  addBreadcrumb('User logged in', { userId });
};

export const trackUserLogout = () => {
  trackEvent('user_logout', {
    timestamp: new Date().toISOString(),
  });
  addBreadcrumb('User logged out');
};

// ============================================
// CONTENT ENGAGEMENT
// ============================================

export const trackScriptView = (scriptId: string, scriptTitle: string, category: string) => {
  trackEvent('script_viewed', {
    script_id: scriptId,
    script_title: scriptTitle,
    category,
    timestamp: new Date().toISOString(),
  });
};

export const trackScriptUsed = (scriptId: string, scriptTitle: string, category: string) => {
  trackEvent('script_used', {
    script_id: scriptId,
    script_title: scriptTitle,
    category,
    timestamp: new Date().toISOString(),
  });
  addBreadcrumb('Script used', { scriptId, scriptTitle });
};

export const trackScriptFavorited = (scriptId: string, action: 'add' | 'remove') => {
  trackEvent('script_favorited', {
    script_id: scriptId,
    action,
    timestamp: new Date().toISOString(),
  });
};

export const trackVideoWatched = (videoId: string, videoTitle: string, watchDuration: number, totalDuration: number) => {
  const completionRate = (watchDuration / totalDuration) * 100;
  
  trackEvent('video_watched', {
    video_id: videoId,
    video_title: videoTitle,
    watch_duration_seconds: watchDuration,
    completion_rate: Math.round(completionRate),
    timestamp: new Date().toISOString(),
  });

  if (completionRate >= 80) {
    trackEvent('video_completed', {
      video_id: videoId,
      video_title: videoTitle,
    });
  }
};

export const trackEbookOpened = (ebookId: string, ebookTitle: string) => {
  trackEvent('ebook_opened', {
    ebook_id: ebookId,
    ebook_title: ebookTitle,
    timestamp: new Date().toISOString(),
  });
};

export const trackEbookProgress = (ebookId: string, chapterIndex: number, progressPercent: number) => {
  trackEvent('ebook_progress', {
    ebook_id: ebookId,
    chapter_index: chapterIndex,
    progress_percent: progressPercent,
    timestamp: new Date().toISOString(),
  });
};

export const trackBonusViewed = (bonusId: string, bonusTitle: string, category: string) => {
  trackEvent('bonus_viewed', {
    bonus_id: bonusId,
    bonus_title: bonusTitle,
    category,
    timestamp: new Date().toISOString(),
  });
};

// ============================================
// FEATURE USAGE
// ============================================

export const trackSearchPerformed = (query: string, resultsCount: number, filters?: Record<string, any>) => {
  trackEvent('search_performed', {
    query: query.toLowerCase(),
    results_count: resultsCount,
    filters,
    timestamp: new Date().toISOString(),
  });
};

export const trackFilterApplied = (filterType: string, filterValue: string | string[]) => {
  trackEvent('filter_applied', {
    filter_type: filterType,
    filter_value: filterValue,
    timestamp: new Date().toISOString(),
  });
};

export const trackChildProfileCreated = (brainProfile: string, age?: number) => {
  trackEvent('child_profile_created', {
    brain_profile: brainProfile,
    age,
    timestamp: new Date().toISOString(),
  });
};

export const trackChildProfileSwitched = (fromProfile: string, toProfile: string) => {
  trackEvent('child_profile_switched', {
    from_profile: fromProfile,
    to_profile: toProfile,
    timestamp: new Date().toISOString(),
  });
};

// ============================================
// COMMUNITY ENGAGEMENT
// ============================================

export const trackPostCreated = (postType: string, hasImage: boolean) => {
  trackEvent('community_post_created', {
    post_type: postType,
    has_image: hasImage,
    timestamp: new Date().toISOString(),
  });
};

export const trackPostReaction = (postId: string, reactionType: string) => {
  trackEvent('community_post_reaction', {
    post_id: postId,
    reaction_type: reactionType,
    timestamp: new Date().toISOString(),
  });
};

export const trackCommentAdded = (postId: string, commentLength: number) => {
  trackEvent('community_comment_added', {
    post_id: postId,
    comment_length: commentLength,
    timestamp: new Date().toISOString(),
  });
};

// ============================================
// PERFORMANCE MONITORING
// ============================================

export const trackPageLoad = (pageName: string, loadTime: number) => {
  trackEvent('page_load', {
    page_name: pageName,
    load_time_ms: loadTime,
    timestamp: new Date().toISOString(),
  });

  if (loadTime > 3000) {
    addBreadcrumb('Slow page load detected', { pageName, loadTime });
  }
};

export const trackApiCall = (endpoint: string, duration: number, success: boolean) => {
  trackEvent('api_call', {
    endpoint,
    duration_ms: duration,
    success,
    timestamp: new Date().toISOString(),
  });

  if (!success || duration > 5000) {
    addBreadcrumb('API call issue', { endpoint, duration, success });
  }
};

// ============================================
// ERROR TRACKING
// ============================================

export const trackError = (error: Error, context?: Record<string, any>) => {
  trackEvent('error_occurred', {
    error_message: error.message,
    error_stack: error.stack,
    ...context,
    timestamp: new Date().toISOString(),
  });
  
  captureException(error, context);
};

export const trackUserFeedback = (type: 'positive' | 'negative', feature: string, comment?: string) => {
  trackEvent('user_feedback', {
    type,
    feature,
    comment,
    timestamp: new Date().toISOString(),
  });
};

// ============================================
// CONVERSION & RETENTION
// ============================================

export const trackFeatureDiscovery = (featureName: string) => {
  trackEvent('feature_discovered', {
    feature_name: featureName,
    timestamp: new Date().toISOString(),
  });
};

export const trackOnboardingStep = (step: number, stepName: string, completed: boolean) => {
  trackEvent('onboarding_step', {
    step,
    step_name: stepName,
    completed,
    timestamp: new Date().toISOString(),
  });
};

export const trackReturnVisit = (daysSinceLastVisit: number) => {
  trackEvent('return_visit', {
    days_since_last_visit: daysSinceLastVisit,
    timestamp: new Date().toISOString(),
  });
};

// ============================================
// USER CONTEXT
// ============================================

export const identifyUser = (
  userId: string,
  properties: {
    email?: string;
    name?: string;
    brainProfile?: string;
    isPremium?: boolean;
    childrenCount?: number;
    signupDate?: string;
    [key: string]: any;
  }
) => {
  identifyUserBase(userId, properties);
  addBreadcrumb('User identified', { userId, ...properties });
};

// ============================================
// BATCH TRACKING
// ============================================

export const trackSessionSummary = (summary: {
  sessionDuration: number;
  pagesVisited: number;
  scriptsViewed: number;
  videosWatched: number;
}) => {
  trackEvent('session_summary', {
    ...summary,
    timestamp: new Date().toISOString(),
  });
};
